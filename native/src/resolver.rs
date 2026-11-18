use indexmap::IndexMap as BaseIndexMap;
use regex::Regex;
use rustc_hash::{FxBuildHasher, FxHashMap as HashMap, FxHashSet as HashSet};
use serde::Serialize;
use serde_json::{Map, Value};

use crate::config::GenerateOptions;

type IndexMap<K, V> = BaseIndexMap<K, V, FxBuildHasher>;

const METHODS: [&str; 8] = [
    "get", "put", "post", "delete", "options", "head", "patch", "trace",
];
const RESERVED: [&str; 35] = [
    "break",
    "case",
    "catch",
    "class",
    "const",
    "continue",
    "debugger",
    "default",
    "delete",
    "do",
    "else",
    "export",
    "extends",
    "false",
    "finally",
    "for",
    "function",
    "if",
    "import",
    "in",
    "instanceof",
    "new",
    "null",
    "return",
    "super",
    "switch",
    "this",
    "throw",
    "true",
    "try",
    "typeof",
    "var",
    "void",
    "while",
    "with",
];

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ResolverStats {
    pub operations: usize,
    pub operation_tags: usize,
    pub schemas: usize,
    pub direct_schema_edges: usize,
    pub deep_schema_edges: usize,
    pub schema_tags: usize,
}

pub struct IndexedOperation<'a> {
    pub path: &'a str,
    pub method: &'static str,
    pub operation: &'a Map<String, Value>,
    pub tag: String,
    pub name: String,
    pub path_parameters: Option<&'a Value>,
}

pub struct Resolver<'a> {
    document: &'a Value,
    /// `#/components/schemas/<name>` references, the vast majority of `$ref`s, resolved once.
    component_schemas: HashMap<String, &'a Value>,
    pub operations: Vec<IndexedOperation<'a>>,
    pub deep_dependencies: HashMap<String, HashSet<String>>,
    pub schema_tags: HashMap<String, HashSet<String>>,
    pub topology_order: Vec<String>,
    pub ordered_dependencies: IndexMap<String, Vec<String>>,
}

impl<'a> Resolver<'a> {
    pub fn new(document: &'a Value, options: &GenerateOptions) -> Result<Self, String> {
        let started = std::time::Instant::now();
        let ordered_dependencies = collect_ordered_dependencies(document, options.extract_enums);
        let after_direct = started.elapsed();
        let ordered_deep_dependencies = ordered_transitive_graph(&ordered_dependencies);
        let after_deep = started.elapsed();
        let topology_order = ordered_topology(&ordered_deep_dependencies);
        let deep_dependencies = ordered_deep_dependencies
            .into_iter()
            .map(|(root, dependencies)| (root, dependencies.into_iter().collect()))
            .collect();
        let mut operations = index_operations(document, options)?;
        assign_unique_names(&mut operations, options);
        // Naming shares a single collision index when tags are not split, but
        // schema compilation still uses each operation's source tag, as in the
        // JavaScript resolver's operation contexts.
        if !options.split_by_tags {
            for operation in &mut operations {
                operation.tag = format_tag(
                    operation
                        .operation
                        .get("tags")
                        .and_then(Value::as_array)
                        .and_then(|tags| tags.first())
                        .and_then(Value::as_str)
                        .unwrap_or(&options.default_tag),
                );
            }
        }
        let after_operations = started.elapsed();
        let mut schema_tags = collect_schema_tags(document, &operations, &deep_dependencies);
        let after_tags = started.elapsed();
        if options.extract_enums {
            merge_duplicate_enum_tags(document, &mut schema_tags);
        }
        if std::env::var_os("OPENAPI_NATIVE_PROFILE").is_some() {
            let finished = started.elapsed();
            eprintln!(
                "native resolver direct={:.3}ms deep={:.3}ms topology+ops={:.3}ms tags={:.3}ms enums={:.3}ms",
                after_direct.as_secs_f64() * 1000.0,
                (after_deep - after_direct).as_secs_f64() * 1000.0,
                (after_operations - after_deep).as_secs_f64() * 1000.0,
                (after_tags - after_operations).as_secs_f64() * 1000.0,
                (finished - after_tags).as_secs_f64() * 1000.0,
            );
        }
        let component_schemas = document
            .pointer("/components/schemas")
            .and_then(Value::as_object)
            .into_iter()
            .flatten()
            .map(|(name, schema)| {
                let escaped = name.replace('~', "~0").replace('/', "~1");
                (format!("#/components/schemas/{escaped}"), schema)
            })
            .collect();
        Ok(Self {
            document,
            component_schemas,
            operations,
            deep_dependencies,
            schema_tags,
            topology_order,
            ordered_dependencies,
        })
    }

    /// `document.pointer` for a `#`-prefixed reference, without re-parsing component references.
    pub fn resolve_ref(&self, reference: &str) -> Option<&'a Value> {
        if let Some(schema) = self.component_schemas.get(reference) {
            return Some(schema);
        }
        self.document.pointer(reference.strip_prefix('#')?)
    }

    pub fn stats(&self, document: &Value) -> ResolverStats {
        ResolverStats {
            operations: self.operations.len(),
            operation_tags: self
                .operations
                .iter()
                .map(|operation| operation.tag.as_str())
                .collect::<HashSet<_>>()
                .len(),
            schemas: document
                .pointer("/components/schemas")
                .and_then(Value::as_object)
                .map_or(0, Map::len),
            direct_schema_edges: self.ordered_dependencies.values().map(Vec::len).sum(),
            deep_schema_edges: self.deep_dependencies.values().map(HashSet::len).sum(),
            schema_tags: self.schema_tags.values().map(HashSet::len).sum(),
        }
    }
}

fn collect_ordered_dependencies(
    document: &Value,
    extract_enums: bool,
) -> IndexMap<String, Vec<String>> {
    let Some(schemas) = document
        .pointer("/components/schemas")
        .and_then(Value::as_object)
    else {
        return IndexMap::default();
    };
    let mut enum_ref_by_values: IndexMap<String, String> = IndexMap::default();
    if extract_enums {
        for (name, schema) in schemas {
            // Keyed by the rendered code, which leaves out `null`, as the TypeScript resolver compares enums.
            if let Some(code) = crate::zod::enum_code(schema) {
                enum_ref_by_values
                    .entry(code)
                    .or_insert_with(|| format!("#/components/schemas/{name}"));
            }
        }
    }
    let mut direct: IndexMap<String, Vec<String>> = IndexMap::default();
    let mut parents_by_inline_enum: HashMap<String, Vec<String>> = HashMap::default();
    for (name, schema) in schemas {
        let root = format!("#/components/schemas/{name}");
        let mut dependencies = Vec::new();
        let mut seen = HashSet::default();
        collect_ordered_refs(schema, &mut dependencies, &mut seen);
        if !dependencies.is_empty() {
            direct.insert(root.clone(), dependencies);
        }
        if extract_enums {
            let mut inline_values = HashSet::default();
            if let Some(object) = schema.as_object() {
                for (key, value) in object {
                    if !crate::zod::is_stray_array_keyword(object, key) {
                        collect_inline_enum_values(value, &mut inline_values);
                    }
                }
            }
            for values in inline_values {
                parents_by_inline_enum
                    .entry(values)
                    .or_default()
                    .push(root.clone());
            }
        }
    }
    // The TypeScript resolver appends duplicate-inline-enum edges after building
    // the ordinary reference graph. Preserve that insertion order: named enums
    // first, then their parent schemas in document order.
    if extract_enums {
        for (enum_values, enum_reference) in &enum_ref_by_values {
            for parent_reference in parents_by_inline_enum
                .get(enum_values)
                .into_iter()
                .flatten()
            {
                if parent_reference == enum_reference {
                    continue;
                }
                let dependencies = direct.entry(parent_reference.clone()).or_default();
                if !dependencies.contains(enum_reference) {
                    dependencies.push(enum_reference.clone());
                }
            }
        }
    }
    direct
}

fn collect_inline_enum_values(value: &Value, values: &mut HashSet<String>) {
    match value {
        Value::Array(items) => {
            for value in items {
                collect_inline_enum_values(value, values);
            }
        }
        Value::Object(object) => {
            if let Some(code) = crate::zod::enum_code(value) {
                values.insert(code);
            }
            for (key, value) in object {
                if !crate::zod::is_stray_array_keyword(object, key) {
                    collect_inline_enum_values(value, values);
                }
            }
        }
        _ => {}
    }
}

// Intern references once per compilation. DFS uses dense integer adjacency and
// generation marks instead of allocating/hashing a string set for every root.
fn ordered_transitive_graph(
    direct: &IndexMap<String, Vec<String>>,
) -> IndexMap<String, Vec<String>> {
    let mut ids: IndexMap<&str, usize> = IndexMap::default();
    for root in direct.keys() {
        let next = ids.len();
        ids.insert(root, next);
    }
    for children in direct.values() {
        for child in children {
            let next = ids.len();
            ids.entry(child).or_insert(next);
        }
    }
    let mut adjacency = vec![Vec::new(); ids.len()];
    for (root, children) in direct {
        adjacency[ids[root.as_str()]] = children.iter().map(|child| ids[child.as_str()]).collect();
    }
    let names: Vec<&str> = ids.keys().copied().collect();
    let mut marks = vec![0; ids.len()];
    let mut output = Vec::new();
    let mut deep = IndexMap::default();
    for (root_id, root) in direct.keys().enumerate() {
        output.clear();
        visit_dependency_ids(root_id, root_id, &adjacency, &mut marks, &mut output);
        deep.insert(
            root.clone(),
            output.iter().map(|&id| names[id].to_string()).collect(),
        );
    }
    deep
}

fn visit_dependency_ids(
    current: usize,
    root: usize,
    adjacency: &[Vec<usize>],
    marks: &mut [usize],
    output: &mut Vec<usize>,
) {
    let generation = root + 1;
    for &child in &adjacency[current] {
        if marks[child] != generation {
            marks[child] = generation;
            output.push(child);
            if child != root {
                visit_dependency_ids(child, root, adjacency, marks, output);
            }
        }
    }
}

fn ordered_topology(deep: &IndexMap<String, Vec<String>>) -> Vec<String> {
    let mut sorted = Vec::new();
    let mut visited = HashSet::default();
    for root in deep.keys() {
        visit_topology(root, deep, &mut sorted, &mut visited);
    }
    sorted
}

fn visit_topology<'a>(
    name: &'a str,
    graph: &'a IndexMap<String, Vec<String>>,
    sorted: &mut Vec<String>,
    visited: &mut HashSet<&'a str>,
) {
    // Visiting a node marks it before descending, covering both shared dependencies
    // and cycle ancestors without a second membership scan over the output.
    if !visited.insert(name) {
        return;
    }
    if let Some(children) = graph.get(name) {
        for child in children {
            visit_topology(child, graph, sorted, visited);
        }
    }
    sorted.push(name.to_string());
}

fn collect_ordered_refs(value: &Value, refs: &mut Vec<String>, seen: &mut HashSet<String>) {
    let Some(object) = value.as_object() else {
        return;
    };
    if let Some(reference) = object.get("$ref").and_then(Value::as_str) {
        let reference = autocorrect_ref(reference);
        if seen.insert(reference.clone()) {
            refs.push(reference);
        }
    }
    if let Some(items) = ["allOf", "anyOf", "oneOf"]
        .iter()
        .find_map(|keyword| object.get(*keyword).and_then(Value::as_array))
    {
        for item in items {
            collect_ordered_refs(item, refs, seen);
        }
    }
    if let Some(properties) = object.get("properties").and_then(Value::as_object) {
        for property in properties.values() {
            collect_ordered_refs(property, refs, seen);
        }
    }
    if let Some(additional) = object
        .get("additionalProperties")
        .filter(|value| value.is_object())
    {
        collect_ordered_refs(additional, refs, seen);
    }
    // Every member of a type array (`type: ["array", "string", "null"]`) is traversed.
    if crate::zod::object_has_schema_type(object, "array") {
        for items in crate::zod::array_item_schemas(object) {
            collect_ordered_refs(items, refs, seen);
        }
    }
}

fn merge_duplicate_enum_tags(document: &Value, schema_tags: &mut HashMap<String, HashSet<String>>) {
    let Some(schemas) = document
        .pointer("/components/schemas")
        .and_then(Value::as_object)
    else {
        return;
    };
    let mut enum_ref_by_code = HashMap::default();
    for (name, schema) in schemas {
        if let Some(values) = schema.get("enum").and_then(Value::as_array) {
            if let Ok(code) = serde_json::to_string(values) {
                enum_ref_by_code
                    .entry(code)
                    .or_insert_with(|| format!("#/components/schemas/{name}"));
            }
        }
    }
    let mut additions: Vec<(String, Vec<String>)> = Vec::new();
    for (name, schema) in schemas {
        // Component-level enums are canonical declarations, not extracted inline enums.
        if schema.get("enum").is_some() {
            continue;
        }
        let parent_ref = format!("#/components/schemas/{name}");
        let parent_tags: Vec<String> = schema_tags
            .get(&parent_ref)
            .into_iter()
            .flatten()
            .cloned()
            .collect();
        if parent_tags.is_empty() {
            continue;
        }
        collect_duplicate_enum_tags(schema, &enum_ref_by_code, &parent_tags, &mut additions);
    }
    for (reference, tags) in additions {
        schema_tags.entry(reference).or_default().extend(tags);
    }
}

fn collect_duplicate_enum_tags(
    value: &Value,
    enum_ref_by_code: &HashMap<String, String>,
    tags: &[String],
    additions: &mut Vec<(String, Vec<String>)>,
) {
    match value {
        Value::Object(object) => {
            if let Some(values) = object.get("enum").and_then(Value::as_array) {
                if let Ok(code) = serde_json::to_string(values) {
                    if let Some(reference) = enum_ref_by_code.get(&code) {
                        additions.push((reference.clone(), tags.to_vec()));
                    }
                }
            }
            for (key, child) in object {
                if !crate::zod::is_stray_array_keyword(object, key) {
                    collect_duplicate_enum_tags(child, enum_ref_by_code, tags, additions);
                }
            }
        }
        Value::Array(array) => {
            for child in array {
                collect_duplicate_enum_tags(child, enum_ref_by_code, tags, additions);
            }
        }
        _ => {}
    }
}

fn index_operations<'a>(
    document: &'a Value,
    options: &GenerateOptions,
) -> Result<Vec<IndexedOperation<'a>>, String> {
    let exclude_path = if options.exclude_path_regex.is_empty() {
        None
    } else {
        Some(Regex::new(&options.exclude_path_regex).map_err(|error| error.to_string())?)
    };
    let include: HashSet<String> = options
        .include_tags
        .iter()
        .map(|tag| format_tag(tag).to_lowercase())
        .collect();
    let exclude: HashSet<String> = options
        .exclude_tags
        .iter()
        .map(|tag| format_tag(tag).to_lowercase())
        .collect();
    let mut result = Vec::new();
    let Some(paths) = document.get("paths").and_then(Value::as_object) else {
        return Ok(result);
    };
    for (path, item) in paths {
        if exclude_path
            .as_ref()
            .is_some_and(|regex| regex.is_match(path))
        {
            continue;
        }
        let Some(item) = item.as_object() else {
            continue;
        };
        for (method_name, value) in item {
            let Some(method) = METHODS
                .iter()
                .copied()
                .find(|candidate| candidate == method_name)
            else {
                continue;
            };
            let Some(operation) = value.as_object() else {
                continue;
            };
            if operation
                .get("deprecated")
                .and_then(Value::as_bool)
                .unwrap_or(false)
                && !options.with_deprecated_endpoints
            {
                continue;
            }
            let source_tag = operation
                .get("tags")
                .and_then(Value::as_array)
                .and_then(|tags| tags.first())
                .and_then(Value::as_str)
                .unwrap_or(&options.default_tag);
            let formatted = format_tag(source_tag);
            let normalized = formatted.to_lowercase();
            if !include.contains(&normalized)
                && (!include.is_empty() || exclude.contains(&normalized))
            {
                continue;
            }
            let tag = if options.split_by_tags {
                formatted
            } else {
                options.default_tag.clone()
            };
            result.push(IndexedOperation {
                path,
                method,
                operation,
                tag,
                name: String::new(),
                path_parameters: item.get("parameters"),
            });
        }
    }
    Ok(result)
}

#[derive(Default)]
struct OperationNameIndex {
    stable_counts: HashMap<String, usize>,
    path_source_count: usize,
    reserved_fallback_count: usize,
}

fn assign_unique_names(operations: &mut [IndexedOperation<'_>], options: &GenerateOptions) {
    // Match the JavaScript index: path-derived names are evaluated in the current
    // operation's context, not at each candidate's own path.
    let mut indexes: HashMap<String, [OperationNameIndex; 2]> = HashMap::default();
    for operation in operations.iter() {
        let tag_indexes = indexes.entry(operation.tag.clone()).or_default();
        for (index, keep_tag) in tag_indexes.iter_mut().zip([false, true]) {
            if operation
                .operation
                .get("operationId")
                .and_then(Value::as_str)
                .unwrap_or_default()
                .is_empty()
            {
                index.path_source_count += 1;
                continue;
            }
            let context = IndexedOperation {
                path: "",
                method: "",
                operation: operation.operation,
                tag: operation.tag.clone(),
                name: String::new(),
                path_parameters: None,
            };
            let (name, reserved_fallback) =
                resolve_operation_name(&context, options, keep_tag, false);
            if reserved_fallback {
                index.reserved_fallback_count += 1;
            } else {
                *index.stable_counts.entry(name).or_default() += 1;
            }
        }
    }
    let empty_operation = Map::new();
    for operation in operations.iter_mut() {
        let mut unique = None;
        for (index, keep_tag) in indexes[&operation.tag].iter().zip([false, true]) {
            let name = operation_name(operation, options, keep_tag, false);
            let path_context = IndexedOperation {
                path: operation.path,
                method: operation.method,
                operation: &empty_operation,
                tag: operation.tag.clone(),
                name: String::new(),
                path_parameters: None,
            };
            let path_matches = index.path_source_count > 0
                && operation_name(&path_context, options, keep_tag, false) == name;
            let reserved_matches = index.reserved_fallback_count > 0
                && format!(
                    "{}{}",
                    operation.method,
                    path_to_variable_name(operation.path)
                ) == name;
            let count = index.stable_counts.get(&name).copied().unwrap_or_default()
                + if path_matches {
                    index.path_source_count
                } else {
                    0
                }
                + if reserved_matches {
                    index.reserved_fallback_count
                } else {
                    0
                };
            if count == 1 {
                unique = Some(name);
                break;
            }
        }
        operation.name = unique.unwrap_or_else(|| operation_name(operation, options, true, true));
    }
}

fn operation_name(
    operation: &IndexedOperation<'_>,
    options: &GenerateOptions,
    keep_tag: bool,
    keep_prefix: bool,
) -> String {
    resolve_operation_name(operation, options, keep_tag, keep_prefix).0
}

fn resolve_operation_name(
    operation: &IndexedOperation<'_>,
    options: &GenerateOptions,
    keep_tag: bool,
    keep_prefix: bool,
) -> (String, bool) {
    let mut name = operation
        .operation
        .get("operationId")
        .and_then(Value::as_str)
        .filter(|id| !id.is_empty())
        .map(invalid_identifier)
        .unwrap_or_else(|| {
            format!(
                "{}{}",
                operation.method,
                path_to_variable_name(operation.path)
            )
        });
    if !options.remove_operation_prefix_ending_with.is_empty() {
        if keep_prefix {
            name = name
                .split(&options.remove_operation_prefix_ending_with)
                .enumerate()
                .map(|(index, part)| {
                    if index == 0 {
                        part.to_string()
                    } else {
                        capitalize(part)
                    }
                })
                .collect();
        } else if let Some(index) = name.rfind(&options.remove_operation_prefix_ending_with) {
            name = name[index + options.remove_operation_prefix_ending_with.len()..].to_string();
        }
    }
    if (options.ts_namespaces || options.tree_shakeable_namespaces) && !keep_tag {
        let without_tag = remove_word(&name, &operation.tag);
        if without_tag.is_empty() {
            name = operation.method.to_string();
        } else if !RESERVED.contains(&without_tag.as_str()) {
            name = without_tag;
        }
    }
    if RESERVED.contains(&name.as_str()) {
        (
            format!(
                "{}{}",
                operation.method,
                path_to_variable_name(operation.path)
            ),
            true,
        )
    } else {
        (name, false)
    }
}

fn collect_schema_tags(
    document: &Value,
    operations: &[IndexedOperation<'_>],
    deep: &HashMap<String, HashSet<String>>,
) -> HashMap<String, HashSet<String>> {
    let mut result: HashMap<String, HashSet<String>> = HashMap::default();
    for operation in operations {
        let mut refs = HashSet::default();
        if let Some(params) = operation.operation.get("parameters") {
            collect_operation_schema_refs(document, params, &mut refs, &mut HashSet::default());
        }
        if let Some(body) = operation.operation.get("requestBody") {
            collect_operation_schema_refs(document, body, &mut refs, &mut HashSet::default());
        }
        if let Some(responses) = operation.operation.get("responses") {
            collect_operation_schema_refs(document, responses, &mut refs, &mut HashSet::default());
        }
        for reference in refs {
            result
                .entry(reference.clone())
                .or_default()
                .insert(operation.tag.clone());
            if let Some(children) = deep.get(&reference) {
                for child in children {
                    result
                        .entry(child.clone())
                        .or_default()
                        .insert(operation.tag.clone());
                }
            }
        }
    }
    result
}

fn collect_operation_schema_refs(
    document: &Value,
    value: &Value,
    refs: &mut HashSet<String>,
    visited_components: &mut HashSet<String>,
) {
    match value {
        Value::Object(object) => {
            if let Some(reference) = object.get("$ref").and_then(Value::as_str) {
                let reference = autocorrect_ref(reference);
                if reference.starts_with("#/components/schemas/") {
                    refs.insert(reference);
                    return;
                }
                if visited_components.insert(reference.clone()) {
                    if let Some(resolved) = resolve_pointer(document, &reference) {
                        collect_operation_schema_refs(document, resolved, refs, visited_components);
                    }
                }
                return;
            }
            for (key, child) in object {
                if !crate::zod::is_stray_array_keyword(object, key) {
                    collect_operation_schema_refs(document, child, refs, visited_components);
                }
            }
        }
        Value::Array(array) => {
            for child in array {
                collect_operation_schema_refs(document, child, refs, visited_components);
            }
        }
        _ => {}
    }
}

fn resolve_pointer<'a>(document: &'a Value, reference: &str) -> Option<&'a Value> {
    reference
        .strip_prefix('#')
        .and_then(|pointer| document.pointer(pointer))
}

fn autocorrect_ref(reference: &str) -> String {
    if reference.starts_with("#/") {
        reference.to_string()
    } else if let Some(rest) = reference.strip_prefix('#') {
        format!("#/{rest}")
    } else {
        reference.to_string()
    }
}

pub(crate) fn format_tag(value: &str) -> String {
    let mut result = String::with_capacity(value.len());
    let mut uppercase_next = false;
    for character in value.chars() {
        if character.is_alphanumeric() {
            if uppercase_next {
                result.extend(character.to_uppercase());
                uppercase_next = false;
            } else {
                result.push(character);
            }
        } else {
            uppercase_next = true;
        }
    }
    result
}

fn invalid_identifier(value: &str) -> String {
    let mut result = String::new();
    let mut uppercase_next = false;
    for character in value.chars() {
        if result.is_empty()
            && !(character.is_ascii_alphabetic() || character == '_' || character == '$')
        {
            continue;
        }
        if character.is_ascii_alphanumeric() || character == '_' || character == '$' {
            if uppercase_next {
                result.extend(character.to_uppercase());
                uppercase_next = false;
            } else {
                result.push(character);
            }
        } else {
            uppercase_next = true;
        }
    }
    result
}

fn path_to_variable_name(path: &str) -> String {
    let mut base = String::new();
    let mut uppercase_next = true;
    let mut last_param = None;
    for segment in path.split('/') {
        if segment.is_empty() {
            continue;
        }
        if segment.starts_with('{') && segment.ends_with('}') {
            last_param = Some(segment[1..segment.len() - 1].to_string());
            continue;
        }
        for character in segment.chars() {
            if character == '-' {
                uppercase_next = true;
            } else if uppercase_next {
                base.extend(character.to_uppercase());
                uppercase_next = false;
            } else if character.is_alphanumeric() || character == '_' {
                base.push(character);
            } else {
                base.push('_');
            }
        }
        uppercase_next = true;
    }
    if let Some(param) = last_param {
        base.push_str("By");
        base.push_str(&capitalize(&param));
    }
    base
}

fn capitalize(value: &str) -> String {
    let mut chars = value.chars();
    chars
        .next()
        .map(|first| first.to_uppercase().chain(chars).collect())
        .unwrap_or_default()
}

fn remove_word(source: &str, word: &str) -> String {
    let singular = word
        .strip_suffix("es")
        .or_else(|| word.strip_suffix('s'))
        .unwrap_or(word);
    if singular.is_empty() {
        return source.to_string();
    }
    let needle = singular.to_ascii_lowercase();
    let mut output = source.to_string();
    while let Some(start) = output.to_ascii_lowercase().find(&needle) {
        let mut end = start + needle.len();
        for (index, character) in output[end..].char_indices() {
            if character.is_ascii_uppercase() {
                break;
            }
            end = start + needle.len() + index + character.len_utf8();
        }
        output.replace_range(start..end, "");
    }
    output
}

#[cfg(test)]
mod dependency_tests {
    use super::*;

    fn reference(name: &str) -> String {
        format!("#/components/schemas/{name}")
    }

    #[test]
    fn dense_traversal_preserves_first_visit_order_and_cycle_membership() {
        let graph: IndexMap<String, Vec<String>> = [
            ("A", vec!["B", "C", "B"]),
            ("B", vec!["A", "D"]),
            ("Isolated", vec![]),
            ("Self", vec!["Self"]),
        ]
        .into_iter()
        .map(|(name, children)| {
            (
                name.to_string(),
                children.into_iter().map(str::to_string).collect(),
            )
        })
        .collect();
        let deep = ordered_transitive_graph(&graph);
        assert_eq!(deep["A"], ["B", "A", "D", "C"]);
        assert_eq!(deep["B"], ["A", "B", "C", "D"]);
        assert!(deep["Isolated"].is_empty());
        assert_eq!(deep["Self"], ["Self"]);
        assert!(!deep.contains_key("C"));
    }

    #[test]
    fn enum_dependencies_keep_canonical_and_parent_order_and_deduplicate_edges() {
        let document = serde_json::json!({ "components": { "schemas": {
            "FirstB": { "type": "string", "enum": ["b", null] },
            "SecondA": { "type": "string", "enum": ["a"] },
            "DuplicateB": { "type": "string", "enum": ["b"] },
            "ParentA": { "properties": { "value": { "enum": ["a"] } } },
            "ParentB": { "properties": { "value": { "enum": ["b", null] } } },
            "ParentBoth": { "properties": {
                "reference": { "$ref": "#/components/schemas/FirstB" },
                "sameReference": { "$ref": "#/components/schemas/FirstB" },
                "first": { "enum": ["a"] },
                "second": { "enum": ["b"] },
                "repeated": { "enum": ["b"] }
            } }
        } } });
        let graph = collect_ordered_dependencies(&document, true);
        assert_eq!(
            graph.keys().cloned().collect::<Vec<_>>(),
            ["ParentBoth", "ParentB", "ParentA"].map(reference)
        );
        assert_eq!(
            graph[&reference("ParentBoth")],
            ["FirstB", "SecondA"].map(reference)
        );
        assert_eq!(graph[&reference("ParentB")], [reference("FirstB")]);
        assert_eq!(graph[&reference("ParentA")], [reference("SecondA")]);
        let without_extraction = collect_ordered_dependencies(&document, false);
        assert_eq!(
            without_extraction.keys().cloned().collect::<Vec<_>>(),
            [reference("ParentBoth")]
        );
        assert_eq!(
            without_extraction[&reference("ParentBoth")],
            [reference("FirstB")]
        );
    }

    #[test]
    fn topology_keeps_depth_first_order_for_cycles_shared_and_disconnected_nodes() {
        let graph: IndexMap<String, Vec<String>> = [
            ("Root", vec!["CycleA", "Leaf", "CycleA"]),
            ("CycleA", vec!["CycleB"]),
            ("CycleB", vec!["CycleA", "Leaf"]),
            ("Other", vec!["OtherLeaf"]),
            ("Self", vec!["Self"]),
            ("Isolated", vec![]),
        ]
        .into_iter()
        .map(|(name, children)| {
            (
                name.to_string(),
                children.into_iter().map(str::to_string).collect(),
            )
        })
        .collect();
        assert_eq!(
            ordered_topology(&graph),
            [
                "Leaf",
                "CycleB",
                "CycleA",
                "Root",
                "OtherLeaf",
                "Other",
                "Self",
                "Isolated"
            ]
        );
        assert_eq!(
            ordered_topology(&ordered_transitive_graph(&graph)),
            ordered_topology(&graph)
        );
    }

    #[test]
    fn stats_count_unique_direct_edges_without_a_duplicate_graph() {
        let document = serde_json::json!({
            "paths": { "/parent": { "get": {
                "operationId": "getParent", "tags": ["Items"],
                "responses": { "200": { "description": "OK", "content": {
                    "application/json": { "schema": { "$ref": "#/components/schemas/Parent" } }
                } } }
            } } },
            "components": { "schemas": {
                "Enum": { "enum": ["value"] },
                "Parent": { "properties": {
                    "first": { "$ref": "#/components/schemas/Leaf" },
                    "second": { "$ref": "#/components/schemas/Leaf" },
                    "choice": { "enum": ["value"] },
                    "choiceAgain": { "enum": ["value"] }
                } },
                "Leaf": { "properties": { "parent": { "$ref": "#/components/schemas/Parent" } } }
            } }
        });
        let options: GenerateOptions = serde_json::from_value(serde_json::json!({})).unwrap();
        let resolver = Resolver::new(&document, &options).unwrap();
        let stats = resolver.stats(&document);
        assert_eq!(stats.operations, 1);
        assert_eq!(stats.operation_tags, 1);
        assert_eq!(stats.schemas, 3);
        assert_eq!(stats.direct_schema_edges, 3);
        assert_eq!(stats.deep_schema_edges, 6);
        assert_eq!(stats.schema_tags, 3);
    }
}
