use std::collections::VecDeque;

use indexmap::{IndexMap as BaseIndexMap, IndexSet as BaseIndexSet};
use rustc_hash::{FxBuildHasher, FxHashMap as HashMap, FxHashSet as HashSet};
use serde_json::{Map, Value};

use crate::config::GenerateOptions;

type IndexMap<K, V> = BaseIndexMap<K, V, FxBuildHasher>;
type IndexSet<T> = BaseIndexSet<T, FxBuildHasher>;

pub fn render_model_proxies(
    document: &Value,
    endpoints: &[Value],
    schemas: &Map<String, Value>,
    schema_owners: &Map<String, Value>,
    schema_usage_tags: &HashMap<String, HashSet<String>>,
    schema_refs: &Map<String, Value>,
    dependencies: &IndexMap<String, Vec<String>>,
    generated_objects: &Map<String, Value>,
    generated_dependencies: &Map<String, Value>,
    options: &GenerateOptions,
) -> Map<String, Value> {
    let started = std::time::Instant::now();
    let mut rendered = Map::new();
    if !options.split_by_tags {
        return rendered;
    }
    if !options.models_in_common {
        return render_local_models(
            document,
            schemas,
            schema_owners,
            schema_usage_tags,
            schema_refs,
            dependencies,
            generated_objects,
            generated_dependencies,
            options,
        );
    }
    let render_dependencies = augment_render_dependencies(schemas, schema_refs, dependencies);
    let after_dependencies = started.elapsed();
    let composite_dependencies = compiled_component_dependencies(schemas, schema_refs);
    let after_composites = started.elapsed();
    let (common, proxies, common_elapsed, proxies_elapsed) = std::thread::scope(|scope| {
        let common_started = std::time::Instant::now();
        let common = scope.spawn(move || {
            let content =
                render_common_models(document, schemas, schema_refs, generated_objects, options);
            (content, common_started.elapsed())
        });
        let proxies_started = std::time::Instant::now();
        let proxies = scope.spawn(move || {
            let content = render_proxy_modules(
                endpoints,
                schemas,
                schema_refs,
                &render_dependencies,
                &composite_dependencies,
                generated_dependencies,
                options,
            );
            (content, proxies_started.elapsed())
        });
        let (common, common_elapsed) = common.join().unwrap();
        let (proxies, proxies_elapsed) = proxies.join().unwrap();
        (common, proxies, common_elapsed, proxies_elapsed)
    });
    rendered.insert(options.default_tag.clone(), Value::String(common));
    rendered.extend(proxies);
    if std::env::var_os("OPENAPI_NATIVE_PROFILE").is_some() {
        eprintln!(
            "native models dependencies={:.3}ms composites={:.3}ms common={:.3}ms proxies={:.3}ms total={:.3}ms",
            after_dependencies.as_secs_f64() * 1000.0,
            (after_composites - after_dependencies).as_secs_f64() * 1000.0,
            common_elapsed.as_secs_f64() * 1000.0,
            proxies_elapsed.as_secs_f64() * 1000.0,
            started.elapsed().as_secs_f64() * 1000.0,
        );
    }
    rendered
}

fn render_local_models(
    document: &Value,
    schemas: &Map<String, Value>,
    schema_owners: &Map<String, Value>,
    schema_usage_tags: &HashMap<String, HashSet<String>>,
    schema_refs: &Map<String, Value>,
    dependencies: &IndexMap<String, Vec<String>>,
    generated_objects: &Map<String, Value>,
    generated_dependencies: &Map<String, Value>,
    options: &GenerateOptions,
) -> Map<String, Value> {
    let mut by_tag: IndexMap<String, Map<String, Value>> = IndexMap::default();
    for (name, code) in schemas {
        if options.models_in_modules && let Some(tags) = schema_usage_tags.get(name) {
            for tag in tags {
                by_tag.entry(tag.clone()).or_default().insert(name.clone(), code.clone());
            }
        } else if let Some(tag) = schema_owners.get(name).and_then(Value::as_str) {
            by_tag.entry(tag.to_string()).or_default().insert(name.clone(), code.clone());
        }
    }

    let model_suffix = options
        .configs
        .get("models")
        .map(|config| config.output_file_name_suffix.as_str())
        .unwrap_or("models");
    let import_root = match options.import_path.as_str() {
        "relative" => "../".to_string(),
        "absolute" => format!("{}/", options.output.trim_end_matches('/')),
        _ => format!("{}/", options.ts_path.trim_end_matches('/')),
    };
    let mut rendered = Map::new();
    let name_by_ref: HashMap<&str, &str> = schema_refs
        .iter()
        .filter_map(|(name, reference)| {
            reference
                .as_str()
                .map(|reference| (reference, name.as_str()))
        })
        .collect();
    for (tag, mut tag_schemas) in by_tag {
        let mut imports: IndexMap<String, Vec<String>> = IndexMap::default();
        for schema_name in tag_schemas.keys() {
            if let Some(reference) = schema_refs.get(schema_name).and_then(Value::as_str) {
                for name in dependencies
                    .get(reference)
                    .into_iter()
                    .flatten()
                    .filter_map(|dependency| name_by_ref.get(dependency.as_str()).copied())
                {
                    let Some(owner) = schema_owners.get(name).and_then(Value::as_str) else {
                        continue;
                    };
                    if owner != tag {
                        let names = imports.entry(owner.to_string()).or_default();
                        if !names.iter().any(|existing| existing == name) {
                            names.push(name.to_string());
                        }
                    }
                }
                if let Some(schema) = resolve_document_ref(document, reference) {
                    let mut enum_codes = Vec::new();
                    collect_inline_enum_codes(schema, &mut enum_codes);
                    for code in enum_codes {
                        let Some(name) = schemas.iter().find_map(|(name, value)| {
                            (value.as_str() == Some(code.as_str())
                                && !schema_refs.contains_key(name))
                            .then_some(name.as_str())
                        }) else {
                            continue;
                        };
                        let Some(owner) = schema_owners.get(name).and_then(Value::as_str) else {
                            continue;
                        };
                        if owner != tag {
                            let names = imports.entry(owner.to_string()).or_default();
                            if !names.iter().any(|existing| existing == name) {
                                names.push(name.to_string());
                            }
                        }
                    }
                }
            }
            let mut visited = HashSet::default();
            for name in generated_dependencies
                .get(schema_name)
                .and_then(Value::as_array)
                .into_iter()
                .flatten()
                .filter_map(Value::as_str)
            {
                append_local_model_dependency(
                    name,
                    &tag,
                    schemas,
                    schema_owners,
                    schema_refs,
                    dependencies,
                    &name_by_ref,
                    &mut imports,
                    &mut visited,
                );
            }
        }
        if options.models_in_modules {
            for names in imports.values() {
                for name in names {
                    if let Some(code) = schemas.get(name) {
                        tag_schemas.insert(name.clone(), code.clone());
                    }
                }
            }
            imports.clear();
        }
        let mut content = render_common_models(
            document,
            &tag_schemas,
            schema_refs,
            generated_objects,
            options,
        );
        if !imports.is_empty() {
            let mut lines = vec!["import { z } from \"zod\";".to_string()];
            for (owner, names) in imports {
                let owner_tag = decapitalize(&owner);
                lines.push(format!(
                    "import {{ {} }} from \"{import_root}{owner_tag}/{owner_tag}.{model_suffix}\";",
                    names.join(", ")
                ));
            }
            content = content.replacen("import { z } from \"zod\";", &lines.join("\n"), 1);
        }
        rendered.insert(tag, Value::String(content));
    }
    rendered
}

fn collect_inline_enum_codes(value: &Value, codes: &mut Vec<String>) {
    match value {
        Value::Array(values) => values
            .iter()
            .for_each(|value| collect_inline_enum_codes(value, codes)),
        Value::Object(object) => {
            if !object.contains_key("$ref") {
                if let Some(values) = object.get("enum").and_then(Value::as_array) {
                    let code = format!(
                        "z.enum({})",
                        Value::Array(values.clone()).to_string().replace(',', ", ")
                    );
                    if !codes.contains(&code) {
                        codes.push(code);
                    }
                }
                object
                    .values()
                    .for_each(|value| collect_inline_enum_codes(value, codes));
            }
        }
        _ => {}
    }
}

#[allow(clippy::too_many_arguments)]
fn append_local_model_dependency<'a>(
    name: &'a str,
    tag: &str,
    schemas: &Map<String, Value>,
    schema_owners: &Map<String, Value>,
    schema_refs: &Map<String, Value>,
    dependencies: &IndexMap<String, Vec<String>>,
    name_by_ref: &HashMap<&'a str, &'a str>,
    imports: &mut IndexMap<String, Vec<String>>,
    visited: &mut HashSet<String>,
) {
    if !visited.insert(name.to_string()) {
        return;
    }
    if let Some(owner) = schema_owners.get(name).and_then(Value::as_str) {
        if owner != tag && schemas.contains_key(name) {
            let names = imports.entry(owner.to_string()).or_default();
            if !names.iter().any(|existing| existing == name) {
                names.push(name.to_string());
            }
        }
    }
    let Some(reference) = schema_refs.get(name).and_then(Value::as_str) else {
        return;
    };
    for child in dependencies
        .get(reference)
        .into_iter()
        .flatten()
        .filter_map(|dependency| name_by_ref.get(dependency.as_str()).copied())
    {
        append_local_model_dependency(
            child,
            tag,
            schemas,
            schema_owners,
            schema_refs,
            dependencies,
            name_by_ref,
            imports,
            visited,
        );
    }
}

#[allow(clippy::too_many_arguments)]
fn render_proxy_modules(
    endpoints: &[Value],
    schemas: &Map<String, Value>,
    schema_refs: &Map<String, Value>,
    dependencies: &IndexMap<String, Vec<String>>,
    composite_dependencies: &IndexMap<String, Vec<String>>,
    generated_dependencies: &Map<String, Value>,
    options: &GenerateOptions,
) -> Map<String, Value> {
    let mut rendered = Map::new();
    let name_by_ref: HashMap<&str, &str> = schema_refs
        .iter()
        .filter_map(|(name, reference)| {
            reference
                .as_str()
                .map(|reference| (reference, name.as_str()))
        })
        .collect();
    let ref_by_name: HashMap<&str, &str> = schema_refs
        .iter()
        .filter_map(|(name, reference)| {
            reference
                .as_str()
                .map(|reference| (name.as_str(), reference))
        })
        .collect();
    let mut by_tag: IndexMap<String, Vec<&Value>> = IndexMap::default();
    for endpoint in endpoints {
        let tag = endpoint
            .get("tags")
            .and_then(Value::as_array)
            .and_then(|tags| tags.first())
            .and_then(Value::as_str)
            .unwrap_or(&options.default_tag);
        by_tag.entry(tag.to_string()).or_default().push(endpoint);
    }
    for (tag, tag_endpoints) in by_tag {
        if tag == options.default_tag {
            continue;
        }
        let mut used = Vec::new();
        let mut seen = HashSet::default();
        let mut queue = VecDeque::new();
        for endpoint in tag_endpoints {
            enqueue_endpoint_names(endpoint, &mut used, &mut seen, &mut queue);
        }
        while let Some(name) = queue.pop_front() {
            let mut direct_names = HashSet::default();
            if let Some(reference) = ref_by_name.get(name.as_str()) {
                if let Some(children) = dependencies.get(*reference) {
                    for child in children {
                        if let Some(child_name) = name_by_ref.get(child.as_str()) {
                            direct_names.insert((*child_name).to_string());
                            enqueue(child_name, &mut used, &mut seen, &mut queue);
                        }
                    }
                }
            }
            if let Some(children) = generated_dependencies.get(&name).and_then(Value::as_array) {
                let mut expanded = HashSet::default();
                for child in children.iter().filter_map(Value::as_str) {
                    enqueue_deep_dependency(
                        child,
                        &ref_by_name,
                        &name_by_ref,
                        composite_dependencies,
                        &mut direct_names,
                        &mut expanded,
                        &mut used,
                        &mut seen,
                        &mut queue,
                    );
                }
            }
            if let Some(code) = schemas.get(&name).and_then(Value::as_str) {
                for candidate in schema_identifiers(code) {
                    if candidate != name
                        && schemas.contains_key(candidate)
                        && !direct_names.contains(candidate)
                    {
                        enqueue(candidate, &mut used, &mut seen, &mut queue);
                    }
                }
            }
        }
        used.retain(|name| schemas.contains_key(name));
        if used.is_empty() {
            continue;
        }
        let content = render_proxy(&tag, &used, schemas, options);
        rendered.insert(tag, Value::String(content));
    }
    rendered
}

fn render_common_models(
    document: &Value,
    schemas: &Map<String, Value>,
    schema_refs: &Map<String, Value>,
    generated_objects: &Map<String, Value>,
    options: &GenerateOptions,
) -> String {
    let suffix = &options.schema_suffix;
    let namespace_suffix = options
        .configs
        .get("models")
        .map(|config| config.namespace_suffix.as_str())
        .unwrap_or("Models");
    let namespace = format!("{}{}", capitalize(&options.default_tag), namespace_suffix);
    let mut enum_objects = HashMap::default();
    if let Some(component_schemas) = document.pointer("/components/schemas") {
        collect_enum_objects(component_schemas, &mut enum_objects);
    }
    let mut lines = vec!["import { z } from \"zod\";".to_string(), String::new()];
    if options.ts_namespaces {
        lines.push(format!("export namespace {namespace} {{"));
    }
    let schemas = schemas.iter().collect::<Vec<_>>();
    let chunk_size = schemas.len().div_ceil(4).max(1);
    let schema_lines = std::thread::scope(|scope| {
        schemas
            .chunks(chunk_size)
            .map(|chunk| {
                scope.spawn(|| {
                    chunk
                        .iter()
                        .filter_map(|(name, code)| {
                            render_common_schema_lines(
                                document,
                                name,
                                code,
                                schema_refs,
                                generated_objects,
                                &enum_objects,
                                suffix,
                            )
                        })
                        .flatten()
                        .collect::<Vec<_>>()
                })
            })
            .collect::<Vec<_>>()
            .into_iter()
            .flat_map(|handle| handle.join().unwrap())
            .collect::<Vec<_>>()
    });
    lines.extend(schema_lines);
    if options.ts_namespaces {
        lines.push("}".into());
    }
    format!("{}\n", lines.join("\n").trim_end())
}

fn render_common_schema_lines(
    document: &Value,
    name: &str,
    code: &Value,
    schema_refs: &Map<String, Value>,
    generated_objects: &Map<String, Value>,
    enum_objects: &HashMap<String, Value>,
    suffix: &str,
) -> Option<Vec<String>> {
    let code = code.as_str()?;
    let schema_object = generated_objects
        .get(name)
        .or_else(|| {
            schema_refs
                .get(name)
                .and_then(Value::as_str)
                .and_then(|reference| resolve_document_ref(document, reference))
        })
        .or_else(|| enum_objects.get(code));
    let mut lines = vec!["/** ".into(), format!(" * {name} ")];
    let schema_type = if code.starts_with("z.enum(") {
        "enum"
    } else {
        schema_object
            .and_then(|schema| schema.get("type"))
            .and_then(Value::as_str)
            .unwrap_or("object")
    };
    lines.push(format!(" * @type {{ {schema_type} }}"));
    if let Some(schema) = schema_object {
        let description = schema_description(schema);
        if !description.is_empty() {
            lines.push(format!(
                " * @description {}",
                description.replace('\n', "\n *")
            ));
        }
        let mut properties = IndexMap::default();
        collect_property_docs(document, schema, "", &mut properties, suffix);
        for (property, (ty, description)) in properties {
            lines.push(format!(
                " * @property {{ {ty} }} {property} {} ",
                description.replace('\n', "\n *")
            ));
        }
    }
    lines.push(" */".into());
    lines.push(format!("export const {name} = {code};"));
    let type_name = remove_suffix(name, suffix);
    lines.push(format!("export type {type_name} = z.infer<typeof {name}>;"));
    if code.starts_with("z.enum(") {
        lines.push(format!("export const {type_name} = {name}.enum;"));
    }
    lines.push(String::new());
    Some(lines)
}

fn collect_enum_objects(value: &Value, enums: &mut HashMap<String, Value>) {
    match value {
        Value::Array(values) => values
            .iter()
            .for_each(|value| collect_enum_objects(value, enums)),
        Value::Object(object) => {
            if let Some(values) = object.get("enum").and_then(Value::as_array) {
                let code = format!(
                    "z.enum({})",
                    Value::Array(values.clone()).to_string().replace(',', ", ")
                );
                let entry = enums
                    .entry(code)
                    .or_insert_with(|| Value::Object(Map::new()));
                if let Some(target) = entry.as_object_mut() {
                    for (key, value) in object {
                        target.insert(key.clone(), value.clone());
                    }
                }
            }
            object
                .values()
                .for_each(|value| collect_enum_objects(value, enums));
        }
        _ => {}
    }
}

fn resolve_document_ref<'a>(document: &'a Value, reference: &str) -> Option<&'a Value> {
    let pointer = reference.strip_prefix('#')?;
    document.pointer(pointer)
}

const DESCRIPTION_KEYS: &[(&str, &str)] = &[
    ("minimum", "Minimum"),
    ("exclusiveMinimum", "Exclusive Minimum"),
    ("maximum", "Maximum"),
    ("exclusiveMaximum", "Exclusive Maximum"),
    ("minItems", "Min Items"),
    ("minLength", "Min Length"),
    ("minProperties", "Min Properties"),
    ("maxItems", "Max Items"),
    ("maxLength", "Max Length"),
    ("maxProperties", "Max Properties"),
    ("default", "Default"),
    ("example", "Example"),
];

fn schema_description(schema: &Value) -> String {
    let mut parts = Vec::new();
    if let Some(description) = schema.get("description").and_then(Value::as_str) {
        parts.push(description.to_string());
    }
    for (key, label) in DESCRIPTION_KEYS {
        if let Some(value) = schema.get(*key) {
            parts.push(format!("{label}: `{}`", display_js_value(value)));
        }
    }
    parts.join(". ")
}

fn display_js_value(value: &Value) -> String {
    match value {
        Value::String(value) => value.clone(),
        Value::Array(values) => values
            .iter()
            .map(display_js_value)
            .collect::<Vec<_>>()
            .join(","),
        Value::Object(_) => "[object Object]".into(),
        Value::Null => "null".into(),
        _ => value.to_string(),
    }
}

fn collect_property_docs(
    document: &Value,
    schema: &Value,
    prefix: &str,
    properties: &mut IndexMap<String, (String, String)>,
    schema_suffix: &str,
) {
    if let Some(all_of) = schema.get("allOf").and_then(Value::as_array) {
        for member in all_of.iter().filter(|member| member.get("$ref").is_some()) {
            if let Some(reference) = member.get("$ref").and_then(Value::as_str) {
                if let Some(resolved) = resolve_document_ref(document, reference) {
                    collect_property_docs(document, resolved, prefix, properties, schema_suffix);
                }
            }
        }
        for member in all_of.iter().filter(|member| member.get("$ref").is_none()) {
            collect_property_docs(document, member, prefix, properties, schema_suffix);
        }
    }
    if let Some(object) = schema.get("properties").and_then(Value::as_object) {
        for (name, property_schema) in object {
            let key = if prefix.is_empty() {
                name.clone()
            } else {
                format!("{prefix}.{name}")
            };
            let resolved = property_schema
                .get("$ref")
                .and_then(Value::as_str)
                .and_then(|reference| resolve_document_ref(document, reference))
                .unwrap_or(property_schema);
            let ty = property_doc_type(document, property_schema, schema_suffix);
            let preserve_existing_object = properties.contains_key(&key)
                && property_schema.get("type").and_then(Value::as_str) == Some("object");
            if !preserve_existing_object {
                properties.shift_remove(&key);
                properties.insert(key.clone(), (ty, schema_description(resolved)));
            }
            let composite = ["allOf", "anyOf", "oneOf"].iter().any(|key| {
                property_schema
                    .get(*key)
                    .is_some_and(|value| !value.is_null())
            });
            if property_schema.get("$ref").is_none() && !composite {
                if property_schema.get("type").and_then(Value::as_str) == Some("array") {
                    if let Some(items) = property_schema.get("items") {
                        if items.get("$ref").is_none() {
                            collect_property_docs(
                                document,
                                items,
                                &format!("{key}.[0]"),
                                properties,
                                schema_suffix,
                            );
                        }
                    }
                } else {
                    collect_property_docs(
                        document,
                        property_schema,
                        &key,
                        properties,
                        schema_suffix,
                    );
                }
            } else if composite {
                for keyword in ["allOf", "anyOf", "oneOf"] {
                    for member in property_schema
                        .get(keyword)
                        .and_then(Value::as_array)
                        .into_iter()
                        .flatten()
                    {
                        if member.get("$ref").is_none() {
                            collect_property_docs(
                                document,
                                member,
                                &key,
                                properties,
                                schema_suffix,
                            );
                        }
                    }
                }
            }
        }
    }
    if let Some(additional) = schema
        .get("additionalProperties")
        .filter(|value| value.is_object())
    {
        let key = if prefix.is_empty() {
            "[key]".into()
        } else {
            format!("{prefix}.[key]")
        };
        properties.insert(
            key.clone(),
            (
                property_doc_type(document, additional, schema_suffix),
                schema_description(additional),
            ),
        );
        collect_property_docs(document, additional, &key, properties, schema_suffix);
    }
}

fn property_doc_type(document: &Value, schema: &Value, schema_suffix: &str) -> String {
    if let Some(reference) = schema.get("$ref").and_then(Value::as_str) {
        return property_ref_type(reference);
    }
    if schema.get("type").and_then(Value::as_str) == Some("array") {
        let item_type = schema
            .get("items")
            .and_then(|items| {
                if let Some(reference) = items.get("$ref").and_then(Value::as_str) {
                    Some(property_ref_type(reference))
                } else {
                    Some(
                        items
                            .get("type")
                            .and_then(Value::as_str)
                            .unwrap_or("unknown")
                            .to_string(),
                    )
                }
            })
            .unwrap_or_else(|| "unknown".into());
        return format!("{item_type}[]");
    }
    for keyword in ["allOf", "anyOf", "oneOf"] {
        if let Some(first) = schema
            .get(keyword)
            .and_then(Value::as_array)
            .and_then(|values| values.first())
        {
            return property_doc_type(document, first, schema_suffix);
        }
    }
    schema
        .get("type")
        .and_then(Value::as_str)
        .unwrap_or("unknown")
        .to_string()
}

fn property_ref_type(reference: &str) -> String {
    let mut name = reference
        .rsplit('/')
        .next()
        .unwrap_or("unknown")
        .to_string();
    while name.contains("__schema") {
        name = name.replace("__schema", "_schema");
    }
    name
}

fn compiled_component_dependencies(
    schemas: &Map<String, Value>,
    schema_refs: &Map<String, Value>,
) -> IndexMap<String, Vec<String>> {
    let mut result = IndexMap::default();
    for (name, code) in schemas {
        let Some(reference) = schema_refs.get(name).and_then(Value::as_str) else {
            continue;
        };
        let Some(code) = code.as_str() else {
            continue;
        };
        let mut values = Vec::new();
        for candidate in schema_identifiers(code) {
            if candidate == name {
                continue;
            }
            if let Some(candidate_ref) = schema_refs.get(candidate).and_then(Value::as_str) {
                if !values.iter().any(|value| value == candidate_ref) {
                    values.push(candidate_ref.to_string());
                }
            }
        }
        if !values.is_empty() {
            result.insert(reference.to_string(), values);
        }
    }
    result
}

fn augment_render_dependencies(
    schemas: &Map<String, Value>,
    schema_refs: &Map<String, Value>,
    dependencies: &IndexMap<String, Vec<String>>,
) -> IndexMap<String, Vec<String>> {
    let mut result = dependencies.clone();
    let name_by_ref: HashMap<&str, &str> = schema_refs
        .iter()
        .filter_map(|(name, reference)| {
            reference
                .as_str()
                .map(|reference| (reference, name.as_str()))
        })
        .collect();
    let ref_by_name: HashMap<&str, (&str, usize)> = schema_refs
        .iter()
        .enumerate()
        .filter_map(|(index, (name, reference))| {
            reference
                .as_str()
                .map(|reference| (name.as_str(), (reference, index)))
        })
        .collect();
    for (name, code) in schemas {
        let Some(reference) = schema_refs.get(name).and_then(Value::as_str) else {
            continue;
        };
        let identifiers: HashSet<&str> = code
            .as_str()
            .into_iter()
            .flat_map(schema_identifiers)
            .collect();
        if identifiers.is_empty() {
            continue;
        }
        let values = result.entry(reference.to_string()).or_default();
        let plain_names: HashSet<&str> = values
            .iter()
            .filter_map(|child| name_by_ref.get(child.as_str()).copied())
            .collect();
        let mut additions: Vec<(&str, usize)> = identifiers
            .into_iter()
            .filter(|candidate| *candidate != name && !plain_names.contains(candidate))
            .filter_map(|candidate| ref_by_name.get(candidate).copied())
            .collect();
        additions.sort_unstable_by_key(|(_, index)| *index);
        let additions = additions
            .into_iter()
            .map(|(candidate_ref, _)| candidate_ref.to_string());
        values.extend(additions);
    }
    result
}

#[allow(clippy::too_many_arguments)]
fn enqueue_deep_dependency<'a>(
    name: &'a str,
    ref_by_name: &HashMap<&'a str, &'a str>,
    name_by_ref: &HashMap<&'a str, &'a str>,
    dependencies: &IndexMap<String, Vec<String>>,
    direct_names: &mut HashSet<String>,
    expanded: &mut HashSet<&'a str>,
    used: &mut Vec<String>,
    seen: &mut HashSet<String>,
    queue: &mut VecDeque<String>,
) {
    direct_names.insert(name.to_string());
    enqueue(name, used, seen, queue);
    if !expanded.insert(name) {
        return;
    }
    if let Some(reference) = ref_by_name.get(name) {
        if let Some(children) = dependencies.get(*reference) {
            for child in children {
                if let Some(child_name) = name_by_ref.get(child.as_str()) {
                    enqueue_deep_dependency(
                        child_name,
                        ref_by_name,
                        name_by_ref,
                        dependencies,
                        direct_names,
                        expanded,
                        used,
                        seen,
                        queue,
                    );
                }
            }
        }
    }
}

fn schema_identifiers(code: &str) -> Vec<&str> {
    let mut result = Vec::new();
    for candidate in code.split(|character: char| {
        !(character.is_ascii_alphanumeric() || character == '_' || character == '$')
    }) {
        if candidate.ends_with("Schema") && !candidate.is_empty() && !result.contains(&candidate) {
            result.push(candidate);
        }
    }
    result
}

fn enqueue_endpoint_names(
    endpoint: &Value,
    used: &mut Vec<String>,
    seen: &mut HashSet<String>,
    queue: &mut VecDeque<String>,
) {
    if let Some(response) = endpoint.get("response").and_then(Value::as_str) {
        enqueue(response, used, seen, queue);
    }
    if let Some(errors) = endpoint.get("errors").and_then(Value::as_array) {
        for error in errors {
            if let Some(name) = error.get("zodSchema").and_then(Value::as_str) {
                enqueue(name, used, seen, queue);
            }
        }
    }
    if let Some(parameters) = endpoint.get("parameters").and_then(Value::as_array) {
        for parameter in parameters {
            for key in ["zodSchema", "parameterSortingEnumSchemaName"] {
                if let Some(name) = parameter.get(key).and_then(Value::as_str) {
                    enqueue(name, used, seen, queue);
                }
            }
        }
    }
}

fn enqueue(
    name: &str,
    used: &mut Vec<String>,
    seen: &mut HashSet<String>,
    queue: &mut VecDeque<String>,
) {
    if name.starts_with("z.") || name.starts_with("ZodExtended.") || !seen.insert(name.to_string())
    {
        return;
    }
    used.push(name.to_string());
    queue.push_back(name.to_string());
}

fn render_proxy(
    tag: &str,
    names: &[String],
    schemas: &Map<String, Value>,
    options: &GenerateOptions,
) -> String {
    let models_config = options.configs.get("models");
    let namespace_suffix = models_config
        .map(|config| config.namespace_suffix.as_str())
        .unwrap_or("Models");
    let file_suffix = models_config
        .map(|config| config.output_file_name_suffix.as_str())
        .unwrap_or("models");
    let namespace = format!("{}{}", capitalize(tag), namespace_suffix);
    let common_namespace = format!("{}{}", capitalize(&options.default_tag), namespace_suffix);
    let common_tag = decapitalize(&options.default_tag);
    let import_root = match options.import_path.as_str() {
        "relative" => "../".to_string(),
        "absolute" => format!("{}/", options.output.trim_end_matches('/')),
        _ => format!("{}/", options.ts_path.trim_end_matches('/')),
    };
    let common_path = format!("{import_root}{common_tag}/{common_tag}.{file_suffix}");
    let inferred: Vec<String> = names
        .iter()
        .map(|name| remove_suffix(name, &options.schema_suffix))
        .collect();
    let enum_names: Vec<String> = names
        .iter()
        .filter(|name| {
            schemas
                .get(*name)
                .and_then(Value::as_str)
                .is_some_and(|code| code.starts_with("z.enum"))
        })
        .map(|name| remove_suffix(name, &options.schema_suffix))
        .collect();
    if options.ts_namespaces {
        let mut lines = vec![
            format!("import {{ {common_namespace} }} from \"{common_path}\";"),
            String::new(),
            format!("export namespace {namespace} {{"),
        ];
        lines.extend(
            names
                .iter()
                .map(|name| format!("  export const {name} = {common_namespace}.{name};")),
        );
        lines.extend(
            inferred
                .iter()
                .map(|name| format!("  export type {name} = {common_namespace}.{name};")),
        );
        lines.extend(
            enum_names
                .iter()
                .map(|name| format!("  export const {name} = {common_namespace}.{name};")),
        );
        lines.push("}".into());
        lines.push(String::new());
        return lines.join("\n");
    }
    let mut lines = Vec::new();
    let mut values = names.to_vec();
    for name in enum_names {
        if !values.contains(&name) {
            values.push(name);
        }
    }
    if !values.is_empty() {
        lines.push(format!(
            "export {{ {} }} from \"{common_path}\";",
            values.join(", ")
        ));
    }
    if !inferred.is_empty() {
        lines.push(format!(
            "export type {{ {} }} from \"{common_path}\";",
            inferred.join(", ")
        ));
    }
    format!("{}\n", lines.join("\n"))
}

fn capitalize(value: &str) -> String {
    let mut chars = value.chars();
    chars
        .next()
        .map(|first| first.to_uppercase().chain(chars).collect())
        .unwrap_or_default()
}

fn decapitalize(value: &str) -> String {
    let mut chars = value.chars();
    chars
        .next()
        .map(|first| first.to_lowercase().chain(chars).collect())
        .unwrap_or_default()
}

fn remove_suffix(value: &str, suffix: &str) -> String {
    value.strip_suffix(suffix).unwrap_or(value).to_string()
}

pub fn render_endpoints(
    endpoints: &[Value],
    schemas: &Map<String, Value>,
    schema_owners: &Map<String, Value>,
    options: &GenerateOptions,
) -> Map<String, Value> {
    let mut rendered = Map::new();
    if !options.split_by_tags {
        return rendered;
    }
    let mut by_tag: IndexMap<String, Vec<&Value>> = IndexMap::default();
    for endpoint in endpoints {
        let tag = endpoint
            .get("tags")
            .and_then(Value::as_array)
            .and_then(|tags| tags.first())
            .and_then(Value::as_str)
            .unwrap_or(&options.default_tag);
        by_tag.entry(tag.to_string()).or_default().push(endpoint);
    }
    for (tag, tag_endpoints) in by_tag {
        if should_inline_endpoints(&tag, options) || tag_endpoints.is_empty() {
            continue;
        }
        rendered.insert(
            tag.clone(),
            Value::String(render_endpoint_module(
                &tag,
                &tag_endpoints,
                schemas,
                schema_owners,
                options,
            )),
        );
    }
    rendered
}

fn should_inline_endpoints(tag: &str, options: &GenerateOptions) -> bool {
    options.inline_endpoints
        && !options
            .inline_endpoints_exclude_modules
            .iter()
            .any(|name| name.eq_ignore_ascii_case(tag))
}

fn uses_native_rest_client(options: &GenerateOptions) -> bool {
    options.rest_client == "native"
}

fn request_config_type(options: &GenerateOptions) -> &'static str {
    if uses_native_rest_client(options) {
        "TransportRequestConfig"
    } else {
        "AxiosRequestConfig"
    }
}

fn response_type(options: &GenerateOptions) -> &'static str {
    if uses_native_rest_client(options) {
        "TransportResponse"
    } else {
        "AxiosResponse"
    }
}

fn render_endpoint_module(
    tag: &str,
    endpoints: &[&Value],
    schemas: &Map<String, Value>,
    schema_owners: &Map<String, Value>,
    options: &GenerateOptions,
) -> String {
    let mut lines = vec![format!(
        "import {{ AppRestClient }} from \"{}\";",
        options.rest_client_import_path
    )];
    let has_get = endpoints
        .iter()
        .any(|endpoint| endpoint.get("method").and_then(Value::as_str) == Some("get"));
    if options.axios_request_config || has_get {
        lines.push(if uses_native_rest_client(options) {
            "import { type TransportRequestConfig } from \"@povio/openapi-codegen-cli/rest\";".into()
        } else {
            "import { type AxiosRequestConfig } from \"axios\";".into()
        });
    }
    let parse_schemas: Vec<&str> = endpoints
        .iter()
        .flat_map(|endpoint| {
            endpoint
                .get("parameters")
                .and_then(Value::as_array)
                .into_iter()
                .flatten()
                .filter(|parameter| {
                    !matches!(
                        parameter.get("type").and_then(Value::as_str),
                        Some("Path" | "Header")
                    )
                })
                .filter_map(|parameter| {
                    parameter
                        .get("parameterSortingEnumSchemaName")
                        .or_else(|| parameter.get("zodSchema"))
                        .and_then(Value::as_str)
                })
        })
        .collect();
    let response_schemas = endpoints
        .iter()
        .filter_map(|endpoint| endpoint.get("response").and_then(Value::as_str));
    let used_schemas: Vec<&str> = response_schemas
        .chain(
            options
                .parse_request_params
                .then_some(parse_schemas.iter().copied())
                .into_iter()
                .flatten(),
        )
        .collect();
    if used_schemas.iter().any(|schema| !is_named_schema(schema)) {
        lines.push("import { z } from \"zod\";".into());
    }
    if options.parse_request_params && !parse_schemas.is_empty() {
        lines.push(format!(
            "import {{ ZodExtended }} from \"{}\";",
            options.zod_import_path
        ));
    }
    let has_named_models = used_schemas.iter().any(|schema| is_named_schema(schema))
        || endpoints
            .iter()
            .flat_map(|endpoint| {
                endpoint
                    .get("parameters")
                    .and_then(Value::as_array)
                    .into_iter()
                    .flatten()
            })
            .filter_map(|parameter| parameter.get("zodSchema").and_then(Value::as_str))
            .any(is_named_schema);
    let model_config = options.configs.get("models");
    let model_namespace = format!(
        "{}{}",
        capitalize(tag),
        model_config
            .map(|config| config.namespace_suffix.as_str())
            .unwrap_or("Models")
    );
    if has_named_models {
        let suffix = model_config
            .map(|config| config.output_file_name_suffix.as_str())
            .unwrap_or("models");
        let local_tag = decapitalize(tag);
        if options.ts_namespaces {
            lines.push(format!(
                "import {{ {model_namespace} }} from \"./{local_tag}.{suffix}\";"
            ));
        } else {
            let mut imports: IndexMap<String, Vec<String>> = IndexMap::default();
            for schema in &used_schemas {
                if is_named_schema(schema) {
                    let owner = if options.models_in_modules {
                        tag
                    } else {
                        schema_owners.get(*schema).and_then(Value::as_str).unwrap_or(tag)
                    };
                    let bindings = imports.entry(owner.to_string()).or_default();
                    if !bindings.iter().any(|binding| binding == *schema) {
                        bindings.push((*schema).to_string());
                    }
                }
            }
            for endpoint in endpoints {
                for schema in endpoint
                    .get("parameters")
                    .and_then(Value::as_array)
                    .into_iter()
                    .flatten()
                    .filter_map(|parameter| parameter.get("zodSchema").and_then(Value::as_str))
                    .filter(|schema| is_named_schema(schema))
                {
                    let name = remove_suffix(schema, &options.schema_suffix);
                    let owner = if options.models_in_modules {
                        tag
                    } else {
                        schema_owners.get(schema).and_then(Value::as_str).unwrap_or(tag)
                    };
                    let binding = format!("type {name}");
                    let bindings = imports.entry(owner.to_string()).or_default();
                    if !bindings.contains(&binding) {
                        bindings.push(binding);
                    }
                }
            }
            for (owner, bindings) in imports {
                let owner_tag = decapitalize(&owner);
                let path = if owner == tag {
                    format!("./{owner_tag}.{suffix}")
                } else {
                    format!("{}{owner_tag}/{owner_tag}.{suffix}", import_root(options))
                };
                if bindings.iter().all(|binding| binding.starts_with("type ")) {
                    lines.push(format!(
                        "import type {{ {} }} from \"{path}\";",
                        bindings
                            .iter()
                            .map(|binding| binding.trim_start_matches("type "))
                            .collect::<Vec<_>>()
                            .join(", ")
                    ));
                } else {
                    lines.push(format!(
                        "import {{ {} }} from \"{path}\";",
                        bindings.join(", ")
                    ));
                }
            }
        }
    }
    lines.push(String::new());
    if options.ts_namespaces {
        let namespace_suffix = options
            .configs
            .get("endpoints")
            .map(|config| config.namespace_suffix.as_str())
            .unwrap_or("Api");
        lines.push(format!(
            "export namespace {}{} {{",
            capitalize(tag),
            namespace_suffix
        ));
    }
    for endpoint in endpoints {
        render_endpoint(
            &mut lines,
            endpoint,
            tag,
            schemas,
            options,
            if options.ts_namespaces {
                &model_namespace
            } else {
                ""
            },
        );
    }
    if options.ts_namespaces {
        lines.push("}".into());
    }
    format!("{}\n", lines.join("\n").trim_end())
}

#[derive(Clone)]
struct FunctionParam<'a> {
    source: &'a Value,
    name: String,
    kind: &'a str,
    required: bool,
    ty: String,
}

fn render_endpoint(
    lines: &mut Vec<String>,
    endpoint: &Value,
    tag: &str,
    schemas: &Map<String, Value>,
    options: &GenerateOptions,
    model_namespace: &str,
) {
    let method = endpoint
        .get("method")
        .and_then(Value::as_str)
        .unwrap_or_default();
    let params = function_params(endpoint, options, model_namespace);
    let rendered_params = params
        .iter()
        .map(|param| {
            format!(
                "{}{}: {}, ",
                param.name,
                if param.required { "" } else { "?" },
                param.ty
            )
        })
        .collect::<String>();
    let request_config = options.axios_request_config || method == "get";
    let config_param = if request_config {
        format!(
            "config?: {} & {{ allowInvalidResponseData?: boolean }}",
            request_config_type(options)
        )
    } else {
        String::new()
    };
    let name = endpoint_name(
        endpoint
            .get("operationName")
            .and_then(Value::as_str)
            .unwrap_or_default(),
    );
    lines.push(format!(
        "export const {name} = ({rendered_params}{config_param}) => {{"
    ));
    lines.push(format!("    return AppRestClient.{method}("));
    let response = endpoint
        .get("response")
        .and_then(Value::as_str)
        .unwrap_or("z.void()");
    lines.push(format!(
        "        {{ resSchema: {} }},",
        imported_schema(response, model_namespace)
    ));
    let path = endpoint
        .get("path")
        .and_then(Value::as_str)
        .unwrap_or_default();
    lines.push(format!("        `{}`,", render_path(path)));
    let body = params.iter().find(|param| param.kind == "Body");
    let config = endpoint_config(
        endpoint,
        tag,
        schemas,
        options,
        model_namespace,
        request_config,
    );
    if let Some(body) = body {
        let value = if options.parse_request_params {
            render_param_parse(body.source, &body.name, schemas, options, model_namespace)
        } else {
            body.name.clone()
        };
        lines.push(format!("        {value},"));
    } else if method != "get" && !config.is_empty() {
        lines.push("        undefined,".into());
    }
    lines.push(format!("        {config}"));
    lines.push("    )".into());
    lines.push("};".into());
}

fn function_params<'a>(
    endpoint: &'a Value,
    options: &GenerateOptions,
    model_namespace: &str,
) -> Vec<FunctionParam<'a>> {
    let mut result: Vec<FunctionParam<'a>> = endpoint
        .get("parameters")
        .and_then(Value::as_array)
        .into_iter()
        .flatten()
        .map(|parameter| {
            let kind = parameter
                .get("type")
                .and_then(Value::as_str)
                .unwrap_or_default();
            let schema = parameter
                .get("zodSchema")
                .and_then(Value::as_str)
                .unwrap_or_default();
            let required = parameter
                .get("parameterObject")
                .or_else(|| parameter.get("bodyObject"))
                .and_then(|object| object.get("required"))
                .and_then(Value::as_bool)
                .unwrap_or(true);
            let ty = if is_named_schema(schema) {
                let name = remove_suffix(schema, &options.schema_suffix);
                if model_namespace.is_empty() {
                    name
                } else {
                    format!("{model_namespace}.{name}")
                }
            } else {
                primitive_parameter_type(parameter)
            };
            FunctionParam {
                source: parameter,
                name: variable_name(
                    parameter
                        .get("name")
                        .and_then(Value::as_str)
                        .unwrap_or_default(),
                ),
                kind,
                required,
                ty,
            }
        })
        .collect();
    let kind_rank = |kind: &str| match kind {
        "Path" => 0,
        "Body" => 1,
        "Query" => 2,
        "Header" => 3,
        _ => 4,
    };
    result.sort_by_key(|param| (!param.required, kind_rank(param.kind)));
    result
}

fn primitive_parameter_type(parameter: &Value) -> String {
    match parameter
        .pointer("/parameterObject/schema/type")
        .and_then(Value::as_str)
    {
        Some("number" | "integer") => "number".into(),
        Some("boolean") => "boolean".into(),
        Some("array") => "unknown[]".into(),
        Some("object") => "Record<string, unknown>".into(),
        _ => "string".into(),
    }
}

fn endpoint_config(
    endpoint: &Value,
    _tag: &str,
    schemas: &Map<String, Value>,
    options: &GenerateOptions,
    model_namespace: &str,
    request_config: bool,
) -> String {
    let parameters = endpoint.get("parameters").and_then(Value::as_array);
    let query: Vec<&Value> = parameters
        .into_iter()
        .flatten()
        .filter(|param| param.get("type").and_then(Value::as_str) == Some("Query"))
        .collect();
    let headers: Vec<&Value> = parameters
        .into_iter()
        .flatten()
        .filter(|param| param.get("type").and_then(Value::as_str) == Some("Header"))
        .collect();
    let request_format = endpoint
        .get("requestFormat")
        .and_then(Value::as_str)
        .unwrap_or("application/json");
    let response_format = endpoint.get("responseFormat").and_then(Value::as_str);
    let blob = endpoint.get("response").and_then(Value::as_str) == Some("z.instanceof(Blob)");
    let download = endpoint
        .get("mediaDownload")
        .and_then(Value::as_bool)
        .unwrap_or(false);
    let has_headers = !headers.is_empty()
        || request_format != "application/json"
        || response_format.is_some_and(|format| format != "application/json");
    if query.is_empty() && !has_headers && !blob && !download {
        return if request_config {
            "config".into()
        } else {
            String::new()
        };
    }
    let mut lines = vec!["{".to_string()];
    if request_config {
        lines.push("    ...config,".into());
    }
    if !query.is_empty() {
        lines.push("    params: {".into());
        for param in query {
            let raw_name = param
                .get("name")
                .and_then(Value::as_str)
                .unwrap_or_default();
            let property = if valid_property_name(raw_name) {
                raw_name.to_string()
            } else {
                format!("\"{raw_name}\"")
            };
            let variable = variable_name(raw_name);
            let value = if options.parse_request_params {
                render_param_parse(param, &variable, schemas, options, model_namespace)
            } else {
                variable
            };
            lines.push(format!("        {property}: {value},"));
        }
        lines.push("    },".into());
    }
    if has_headers {
        lines.push("    headers: {".into());
        if request_format != "application/json" {
            lines.push(format!("        'Content-Type': '{request_format}',"));
        }
        if let Some(format) = response_format.filter(|format| *format != "application/json") {
            lines.push(format!("        'Accept': '{format}',"));
        }
        for param in headers {
            let name = param
                .get("name")
                .and_then(Value::as_str)
                .unwrap_or_default();
            lines.push(format!("        '{name}': {},", variable_name(name)));
        }
        lines.push("    },".into());
    }
    if blob {
        lines.push("    responseType: \"blob\",".into());
    }
    if download {
        lines.push("    rawResponse: true,".into());
    }
    lines.push("}".into());
    lines.join("\n        ")
}

fn render_param_parse(
    parameter: &Value,
    variable: &str,
    schemas: &Map<String, Value>,
    _options: &GenerateOptions,
    model_namespace: &str,
) -> String {
    let schema = parameter
        .get("zodSchema")
        .and_then(Value::as_str)
        .unwrap_or_default();
    let required = parameter
        .get("parameterObject")
        .or_else(|| parameter.get("bodyObject"))
        .and_then(|object| object.get("required"))
        .and_then(Value::as_bool)
        .unwrap_or(false);
    let schema_value = if let Some(sort_schema) = parameter
        .get("parameterSortingEnumSchemaName")
        .and_then(Value::as_str)
    {
        let code = schemas
            .get(schema)
            .and_then(Value::as_str)
            .unwrap_or(schema);
        let presence = if code.contains(".nullish()") {
            ".nullish()"
        } else if code.contains(".nullable()") {
            ".nullable()"
        } else if !required {
            ".optional()"
        } else {
            ""
        };
        format!(
            "ZodExtended.sortExp({}){presence}",
            imported_schema(sort_schema, model_namespace)
        )
    } else {
        let optional = !required && is_named_schema(schema);
        format!(
            "{}{}",
            imported_schema(schema, model_namespace),
            if optional { ".optional()" } else { "" }
        )
    };
    let query_arg = if parameter.get("type").and_then(Value::as_str) == Some("Query") {
        format!(
            ", {{ type: \"query\", name: \"{}\" }}",
            parameter
                .get("name")
                .and_then(Value::as_str)
                .unwrap_or_default()
        )
    } else {
        String::new()
    };
    format!("ZodExtended.parse({schema_value}, {variable}{query_arg})")
}

fn imported_schema(schema: &str, model_namespace: &str) -> String {
    if is_named_schema(schema) {
        if model_namespace.is_empty() {
            schema.to_string()
        } else {
            format!("{model_namespace}.{schema}")
        }
    } else {
        schema.to_string()
    }
}

fn is_named_schema(schema: &str) -> bool {
    !schema.starts_with("z.") && !schema.starts_with("ZodExtended.")
}

fn endpoint_name(value: &str) -> String {
    decapitalize(&snake_to_camel(value))
}

fn snake_to_camel(value: &str) -> String {
    let mut output = String::new();
    let mut uppercase = false;
    for character in value.chars() {
        if character == '_' || character == '-' || character == ' ' {
            uppercase = true;
        } else if uppercase {
            output.extend(character.to_uppercase());
            uppercase = false;
        } else {
            output.push(character);
        }
    }
    output
}

fn variable_name(value: &str) -> String {
    let mut output = String::new();
    let mut uppercase = false;
    for character in value.chars() {
        if character.is_ascii_alphanumeric() || character == '_' || character == '$' {
            if uppercase {
                output.extend(character.to_uppercase());
                uppercase = false;
            } else {
                output.push(character);
            }
        } else {
            uppercase = true;
        }
    }
    if output
        .chars()
        .next()
        .is_some_and(|character| character.is_ascii_digit())
    {
        output.insert(0, '_');
    }
    output
}

fn valid_property_name(value: &str) -> bool {
    let mut chars = value.chars();
    chars
        .next()
        .is_some_and(|first| first.is_ascii_alphabetic() || first == '_' || first == '$')
        && chars.all(|character| {
            character.is_ascii_alphanumeric() || character == '_' || character == '$'
        })
}

fn render_path(path: &str) -> String {
    let mut output = String::with_capacity(path.len());
    let bytes = path.as_bytes();
    let mut index = 0;
    while index < bytes.len() {
        if bytes[index] == b':' {
            let start = index + 1;
            let mut end = start;
            while end < bytes.len() && (bytes[end].is_ascii_alphanumeric() || bytes[end] == b'_') {
                end += 1;
            }
            if end > start {
                output.push_str("${");
                output.push_str(&path[start..end]);
                output.push('}');
                index = end;
                continue;
            }
        }
        output.push(bytes[index] as char);
        index += 1;
    }
    output
}

pub fn render_queries(
    endpoints: &[Value],
    schema_owners: &Map<String, Value>,
    options: &GenerateOptions,
) -> Map<String, Value> {
    let mut rendered = Map::new();
    if !options.split_by_tags || options.inline_endpoints || !options.workspace_context.is_empty() {
        return rendered;
    }
    let mut by_tag: IndexMap<String, Vec<&Value>> = IndexMap::default();
    for endpoint in endpoints {
        let tag = endpoint
            .get("tags")
            .and_then(Value::as_array)
            .and_then(|tags| tags.first())
            .and_then(Value::as_str)
            .unwrap_or(&options.default_tag);
        by_tag.entry(tag.to_string()).or_default().push(endpoint);
    }
    let tags = by_tag.into_iter().collect::<Vec<_>>();
    let chunk_size = tags.len().div_ceil(4).max(1);
    let modules = std::thread::scope(|scope| {
        tags.chunks(chunk_size)
            .map(|chunk| {
                scope.spawn(|| {
                    chunk
                        .iter()
                        .map(|(tag, tag_endpoints)| {
                            (
                                tag.clone(),
                                Value::String(render_query_module(
                                    tag,
                                    tag_endpoints,
                                    schema_owners,
                                    options,
                                )),
                            )
                        })
                        .collect::<Vec<_>>()
                })
            })
            .collect::<Vec<_>>()
            .into_iter()
            .flat_map(|handle| handle.join().unwrap())
            .collect::<Vec<_>>()
    });
    rendered.extend(modules);
    rendered
}

pub fn render_acl(
    endpoints: &[Value],
    schema_owners: &Map<String, Value>,
    options: &GenerateOptions,
) -> Map<String, Value> {
    let mut rendered = Map::new();
    if !options.split_by_tags || !options.workspace_context.is_empty() {
        return rendered;
    }
    let mut by_tag: IndexMap<String, Vec<&Value>> = IndexMap::default();
    for endpoint in endpoints {
        if !endpoint
            .get("acl")
            .and_then(Value::as_array)
            .is_some_and(|acl| !acl.is_empty())
        {
            continue;
        }
        let tag = endpoint
            .get("tags")
            .and_then(Value::as_array)
            .and_then(|tags| tags.first())
            .and_then(Value::as_str)
            .unwrap_or(&options.default_tag);
        by_tag.entry(tag.to_string()).or_default().push(endpoint);
    }
    for (tag, tag_endpoints) in by_tag {
        rendered.insert(
            tag.clone(),
            Value::String(render_acl_module(
                &tag,
                &tag_endpoints,
                schema_owners,
                options,
            )),
        );
    }
    rendered
}

pub fn render_shared(endpoints: &[Value], options: &GenerateOptions) -> Map<String, Value> {
    let mut rendered = Map::new();
    if !options.split_by_tags || !options.workspace_context.is_empty() {
        return rendered;
    }
    rendered.insert(
        "queryModules".into(),
        Value::String(render_query_modules(endpoints, options)),
    );
    if let Some(content) = render_domain_errors(endpoints) {
        rendered.insert("domainErrors".into(), Value::String(content));
    }
    if let Some(content) = render_app_acl(endpoints) {
        rendered.insert("appAcl".into(), Value::String(content));
    }
    rendered
}

fn render_query_modules(endpoints: &[Value], options: &GenerateOptions) -> String {
    let suffix = options
        .configs
        .get("queries")
        .map(|config| config.namespace_suffix.as_str())
        .unwrap_or("Queries");
    let mut tags = IndexSet::default();
    for endpoint in endpoints {
        let tag = endpoint
            .get("tags")
            .and_then(Value::as_array)
            .and_then(|tags| tags.first())
            .and_then(Value::as_str)
            .unwrap_or(&options.default_tag);
        tags.insert(tag);
    }
    let mut lines = vec!["export const enum QueryModule {".to_string()];
    for tag in tags {
        lines.push(format!("   {tag} = \"{}{suffix}\",", capitalize(tag)));
    }
    lines.push("}".into());
    lines.join("\n")
}

fn render_app_acl(endpoints: &[Value]) -> Option<String> {
    let mut by_tag: IndexMap<&str, Vec<&Value>> = IndexMap::default();
    for endpoint in endpoints.iter().filter(|endpoint| {
        endpoint
            .get("acl")
            .and_then(Value::as_array)
            .is_some_and(|acl| !acl.is_empty())
    }) {
        let tag = endpoint
            .get("tags")
            .and_then(Value::as_array)
            .and_then(|tags| tags.first())
            .and_then(Value::as_str)
            .unwrap_or_default();
        by_tag.entry(tag).or_default().push(endpoint);
    }
    let acl_endpoints: Vec<&Value> = by_tag.into_values().flatten().collect();
    if acl_endpoints.is_empty() {
        return None;
    }
    // Named schema conditions need the full TypeScript import merger for uncommon configurations.
    if acl_endpoints
        .iter()
        .flat_map(|endpoint| acl_conditions(endpoint))
        .any(|condition| condition.get("zodSchemaName").is_some())
    {
        return None;
    }
    let additional = acl_endpoints.iter().any(|endpoint| {
        endpoint
            .pointer("/acl/0/conditions")
            .and_then(Value::as_object)
            .is_some_and(|conditions| !conditions.is_empty())
    });
    let mut actions: IndexMap<&str, IndexSet<String>> = IndexMap::default();
    for endpoint in acl_endpoints {
        let Some(action) = endpoint.pointer("/acl/0/action").and_then(Value::as_str) else {
            continue;
        };
        let subject = endpoint
            .pointer("/acl/0/subject")
            .and_then(Value::as_str)
            .unwrap_or_default();
        let subjects = actions.entry(action).or_default();
        subjects.insert(format!("\"{subject}\""));
        let mut conditions: Vec<&Value> = acl_conditions(endpoint).collect();
        conditions.sort_by_key(|condition| {
            condition
                .get("name")
                .and_then(Value::as_str)
                .unwrap_or_default()
        });
        if !conditions.is_empty() {
            let fields = conditions
                .iter()
                .map(|condition| {
                    let name = condition
                        .get("name")
                        .and_then(Value::as_str)
                        .unwrap_or_default();
                    let optional = if condition
                        .get("required")
                        .and_then(Value::as_bool)
                        .unwrap_or(false)
                    {
                        ""
                    } else {
                        "?"
                    };
                    let ty = condition
                        .get("type")
                        .and_then(Value::as_str)
                        .unwrap_or_default();
                    format!("{name}{optional}: {ty},")
                })
                .collect::<Vec<_>>()
                .join(" ");
            subjects.insert(format!("ForcedSubject<\"{subject}\"> & {{ {fields} }}"));
        }
    }
    let forced = if additional { ", ForcedSubject" } else { "" };
    let mut lines = vec![
        format!("import type {{ PureAbility, AbilityTuple{forced} }} from \"@casl/ability\";"),
        String::new(),
        "export type AppAbilities = ".into(),
    ];
    for (action, subjects) in actions {
        lines.push(format!(
            "| AbilityTuple<\"{action}\", {}>",
            subjects.into_iter().collect::<Vec<_>>().join(" | ")
        ));
    }
    lines.push(String::new());
    lines.push("export type AppAbility = PureAbility<AppAbilities>;".into());
    Some(lines.join("\n"))
}

fn render_domain_errors(endpoints: &[Value]) -> Option<String> {
    let mut domains: HashMap<String, Vec<(Value, String, Option<String>)>> = HashMap::default();
    for endpoint in endpoints {
        for error in endpoint
            .get("errors")
            .and_then(Value::as_array)
            .into_iter()
            .flatten()
        {
            let Some(domain_error) = error.get("domainError") else {
                continue;
            };
            let Some(domain) = domain_error.get("domain").and_then(Value::as_str) else {
                continue;
            };
            let Some(code) = domain_error.get("code") else {
                continue;
            };
            let key = domain_error
                .get("name")
                .and_then(Value::as_str)
                .map(str::to_string)
                .unwrap_or_else(|| {
                    code.as_str()
                        .map(str::to_string)
                        .unwrap_or_else(|| format!("ERROR_{}", code))
                });
            if !valid_property_name(&key) {
                return None;
            }
            let entries = domains.entry(domain.to_string()).or_default();
            if !entries.iter().any(|(existing, _, _)| existing == code) {
                entries.push((
                    code.clone(),
                    key,
                    error
                        .get("description")
                        .and_then(Value::as_str)
                        .filter(|value| !value.is_empty())
                        .map(str::to_string),
                ));
            }
        }
    }
    if domains.is_empty() {
        return None;
    }
    let mut domains: Vec<_> = domains.into_iter().collect();
    domains.sort_by(|left, right| left.0.cmp(&right.0));
    let mut blocks = Vec::new();
    for (domain, mut entries) in domains {
        entries.sort_by(|left, right| match (left.0.as_f64(), right.0.as_f64()) {
            (Some(left), Some(right)) => left.total_cmp(&right),
            _ => value_text(&left.0).cmp(&value_text(&right.0)),
        });
        let name = domain.split(['-', '_']).map(capitalize).collect::<String>();
        let body = entries
            .into_iter()
            .map(|(code, key, description)| {
                let prefix = description
                    .map(|description| format!("  /** {description} */\n  "))
                    .unwrap_or_else(|| "  ".into());
                format!("{prefix}{key}: {}", value_text(&code))
            })
            .collect::<Vec<_>>()
            .join(",\n");
        blocks.push(format!(
            "export const {name}DomainErrors = {{\n{body},\n}} as const;"
        ));
        blocks.push(format!("export type {name}DomainErrorCode = (typeof {name}DomainErrors)[keyof typeof {name}DomainErrors];"));
    }
    Some(format!("{}\n", blocks.join("\n\n")))
}

fn value_text(value: &Value) -> String {
    value
        .as_str()
        .map(|value| serde_json::to_string(value).unwrap())
        .unwrap_or_else(|| value.to_string())
}

fn render_acl_module(
    tag: &str,
    endpoints: &[&Value],
    schema_owners: &Map<String, Value>,
    options: &GenerateOptions,
) -> String {
    let additional = endpoints.iter().any(|endpoint| {
        endpoint
            .pointer("/acl/0/conditions")
            .and_then(Value::as_object)
            .is_some_and(|conditions| !conditions.is_empty())
    });
    let model_suffix = options
        .configs
        .get("models")
        .map(|config| config.namespace_suffix.as_str())
        .unwrap_or("Models");
    let acl_suffix = options
        .configs
        .get("acl")
        .map(|config| config.namespace_suffix.as_str())
        .unwrap_or("Acl");
    let models_namespace = format!("{}{}", capitalize(tag), model_suffix);
    let has_models = endpoints
        .iter()
        .flat_map(|endpoint| acl_conditions(endpoint))
        .any(|condition| {
            condition
                .get("zodSchemaName")
                .and_then(Value::as_str)
                .is_some_and(is_named_schema)
        });
    let mut lines = Vec::new();
    lines.push(if additional {
        "import { ForcedSubject, subject, type AbilityTuple } from \"@casl/ability\";".into()
    } else {
        "import { type AbilityTuple } from \"@casl/ability\";".into()
    });
    if has_models {
        if options.ts_namespaces {
            lines.push(format!(
                "import type {{ {models_namespace} }} from \"./{}.models\";",
                decapitalize(tag)
            ));
        } else {
            let mut imports: IndexMap<String, Vec<String>> = IndexMap::default();
            for condition in endpoints
                .iter()
                .flat_map(|endpoint| acl_conditions(endpoint))
            {
                if let Some(schema) = condition.get("zodSchemaName").and_then(Value::as_str) {
                    let name = remove_suffix(schema, &options.schema_suffix);
                    let owner = if options.models_in_modules {
                        tag
                    } else {
                        schema_owners.get(schema).and_then(Value::as_str).unwrap_or(tag)
                    };
                    let names = imports.entry(owner.to_string()).or_default();
                    if !names.contains(&name) {
                        names.push(name);
                    }
                }
            }
            for (owner, names) in imports {
                let owner_tag = decapitalize(&owner);
                let path = if owner == tag {
                    format!("./{owner_tag}.models")
                } else {
                    format!("{}{owner_tag}/{owner_tag}.models", import_root(options))
                };
                lines.push(format!(
                    "import type {{ {} }} from \"{path}\";",
                    names.join(", ")
                ));
            }
        }
    }
    lines.push(String::new());
    if options.ts_namespaces {
        lines.push(format!(
            "export namespace {}{} {{",
            capitalize(tag),
            acl_suffix
        ));
    }
    for endpoint in endpoints {
        render_ability(
            &mut lines,
            endpoint,
            if options.ts_namespaces {
                &models_namespace
            } else {
                ""
            },
            options,
        );
        lines.push(String::new());
    }
    if options.ts_namespaces {
        lines.push("}".into());
    }
    format!("{}\n", lines.join("\n").trim_end())
}

fn acl_conditions(endpoint: &Value) -> impl Iterator<Item = &Value> {
    endpoint
        .pointer("/acl/0/conditionsTypes")
        .and_then(Value::as_array)
        .into_iter()
        .flatten()
}

fn condition_type(condition: &Value, models_namespace: &str, options: &GenerateOptions) -> String {
    if let Some(schema) = condition.get("zodSchemaName").and_then(Value::as_str) {
        let name = remove_suffix(schema, &options.schema_suffix);
        if models_namespace.is_empty() {
            name
        } else {
            format!("{models_namespace}.{name}")
        }
    } else {
        condition
            .get("type")
            .and_then(Value::as_str)
            .unwrap_or_default()
            .to_string()
    }
}

fn render_ability(
    lines: &mut Vec<String>,
    endpoint: &Value,
    models_namespace: &str,
    options: &GenerateOptions,
) {
    let (_, cap) = query_names(endpoint);
    let ability_name = format!("canUse{cap}");
    let mut conditions: Vec<&Value> = acl_conditions(endpoint).collect();
    conditions.sort_by(|left, right| {
        left.get("name")
            .and_then(Value::as_str)
            .unwrap_or_default()
            .cmp(
                right
                    .get("name")
                    .and_then(Value::as_str)
                    .unwrap_or_default(),
            )
    });
    let has_conditions = !conditions.is_empty();
    let method = endpoint
        .get("method")
        .and_then(Value::as_str)
        .unwrap_or_default();
    let query_name = format!("use{cap}");
    let ability_query = if method == "get" {
        if endpoint
            .get("mediaDownload")
            .and_then(Value::as_bool)
            .unwrap_or(false)
        {
            format!("`{query_name}` query or `{query_name}Mutation` mutation")
        } else {
            format!("`{query_name}` query")
        }
    } else {
        format!("`{query_name}` mutation")
    };
    lines.push("/**".into());
    lines.push(format!(
        " * Use for {ability_query} ability. {}",
        if has_conditions {
            "For global ability, omit the object parameter."
        } else {
            ""
        }
    ));
    if let Some(description) = endpoint
        .pointer("/acl/0/description")
        .and_then(Value::as_str)
    {
        lines.push(format!(" * @description {description}"));
    }
    for condition in &conditions {
        let name = condition
            .get("name")
            .and_then(Value::as_str)
            .unwrap_or_default();
        let info = condition
            .get("info")
            .and_then(Value::as_str)
            .unwrap_or_default();
        lines.push(format!(
            " * @param {{ {} }} object.{name} {name} from {info}",
            condition_type(condition, models_namespace, options)
        ));
    }
    lines.push(format!(" * @returns {{ AbilityTuple }} An ability tuple indicating the user's ability to use {ability_query}"));
    lines.push(" */".into());
    lines.push(format!("export const {ability_name} = ("));
    if has_conditions {
        let object = conditions
            .iter()
            .map(|condition| {
                let name = condition
                    .get("name")
                    .and_then(Value::as_str)
                    .unwrap_or_default();
                let optional = if condition
                    .get("required")
                    .and_then(Value::as_bool)
                    .unwrap_or(false)
                {
                    ""
                } else {
                    "?"
                };
                format!(
                    "{name}{optional}: {}, ",
                    condition_type(condition, models_namespace, options)
                )
            })
            .collect::<String>();
        lines.push(format!("  object?: {{ {object} }} "));
    }
    lines.push(") => [".into());
    let action = endpoint
        .pointer("/acl/0/action")
        .and_then(Value::as_str)
        .unwrap_or_default();
    let subject = endpoint
        .pointer("/acl/0/subject")
        .and_then(Value::as_str)
        .unwrap_or_default();
    lines.push(format!("  \"{action}\","));
    lines.push(if has_conditions {
        format!("  object ? subject(\"{subject}\", object) : \"{subject}\"")
    } else {
        format!("  \"{subject}\"")
    });
    let subject_types = if has_conditions {
        let object = conditions
            .iter()
            .map(|condition| {
                let name = condition
                    .get("name")
                    .and_then(Value::as_str)
                    .unwrap_or_default();
                let optional = if condition
                    .get("required")
                    .and_then(Value::as_bool)
                    .unwrap_or(false)
                {
                    ""
                } else {
                    "?"
                };
                format!(
                    "{name}{optional}: {},",
                    condition_type(condition, models_namespace, options)
                )
            })
            .collect::<Vec<_>>()
            .join(" ");
        format!("\"{subject}\" | ForcedSubject<\"{subject}\"> & {{ {object} }}")
    } else {
        format!("\"{subject}\"")
    };
    lines.push(format!("] as AbilityTuple<\"{action}\", {subject_types}>;"));
}

fn render_query_module(
    tag: &str,
    endpoints: &[&Value],
    schema_owners: &Map<String, Value>,
    options: &GenerateOptions,
) -> String {
    let model_suffix = options
        .configs
        .get("models")
        .map(|config| config.namespace_suffix.as_str())
        .unwrap_or("Models");
    let api_suffix = options
        .configs
        .get("endpoints")
        .map(|config| config.namespace_suffix.as_str())
        .unwrap_or("Api");
    let query_suffix = options
        .configs
        .get("queries")
        .map(|config| config.namespace_suffix.as_str())
        .unwrap_or("Queries");
    let acl_suffix = options
        .configs
        .get("acl")
        .map(|config| config.namespace_suffix.as_str())
        .unwrap_or("Acl");
    let models_namespace = format!("{}{}", capitalize(tag), model_suffix);
    let api_namespace = format!("{}{}", capitalize(tag), api_suffix);
    let query_namespace = format!("{}{}", capitalize(tag), query_suffix);
    let acl_namespace = format!("{}{}", capitalize(tag), acl_suffix);
    let infinite: Vec<&Value> = endpoints
        .iter()
        .copied()
        .filter(|endpoint| is_infinite(endpoint, options))
        .collect();
    let queries: Vec<&Value> = endpoints
        .iter()
        .copied()
        .filter(|endpoint| endpoint.get("method").and_then(Value::as_str) == Some("get"))
        .collect();
    let mutations: Vec<&Value> = endpoints
        .iter()
        .copied()
        .filter(|endpoint| is_mutation_endpoint(endpoint))
        .collect();
    let has_media_upload = endpoints.iter().any(|endpoint| {
        endpoint
            .get("mediaUpload")
            .and_then(Value::as_bool)
            .unwrap_or(false)
    });
    let has_media_download = endpoints.iter().any(|endpoint| {
        endpoint
            .get("mediaDownload")
            .and_then(Value::as_bool)
            .unwrap_or(false)
    });
    let acl_endpoints: Vec<&Value> = endpoints
        .iter()
        .copied()
        .filter(|endpoint| {
            endpoint
                .get("acl")
                .and_then(Value::as_array)
                .is_some_and(|acl| !acl.is_empty())
        })
        .collect();
    let mut lines = Vec::new();
    if uses_native_rest_client(options) {
        let mut transport_types = Vec::new();
        if !queries.is_empty() || options.axios_request_config {
            transport_types.push("type TransportRequestConfig");
        }
        if has_media_download {
            transport_types.push("type TransportResponse");
        }
        if !transport_types.is_empty() {
            lines.push(format!(
                "import {{ {} }} from \"@povio/openapi-codegen-cli/rest\";",
                transport_types.join(", ")
            ));
        }
    } else if !queries.is_empty() || options.axios_request_config || has_media_upload {
        lines.push(if has_media_upload {
            "import axios, { type AxiosRequestConfig } from \"axios\";".to_string()
        } else {
            "import { type AxiosRequestConfig } from \"axios\";".to_string()
        });
    }
    let mut query_imports = Vec::new();
    if options.prefetch_queries && !queries.is_empty() {
        query_imports.push("QueryClient");
    }
    if !queries.is_empty() {
        query_imports.push("useQuery");
    }
    if options.infinite_queries && !infinite.is_empty() {
        query_imports.push("useInfiniteQuery");
    }
    if !mutations.is_empty() {
        query_imports.push("useMutation");
    }
    lines.push(format!(
        "import {{ {} }} from \"@tanstack/react-query\";",
        query_imports.join(", ")
    ));
    if options.mutation_effects {
        lines.push(format!(
            "import {{ QueryModule }} from \"{}queryModules\";",
            import_root(options)
        ));
    }
    if options.mutation_effects && !mutations.is_empty() {
        lines.push(format!(
            "import {{ useMutationEffects, type MutationEffectsOptions }} from \"{}\";",
            options.mutation_effects_import_path
        ));
    }
    if options.check_acl && !acl_endpoints.is_empty() {
        lines.push(format!(
            "import {{ useAclCheck }} from \"{}\";",
            options.acl_check_import_path
        ));
        if options.ts_namespaces {
            lines.push(format!(
                "import {{ {acl_namespace} }} from \"./{}.acl\";",
                decapitalize(tag)
            ));
        } else {
            let abilities = acl_endpoints
                .iter()
                .map(|endpoint| format!("canUse{}", query_names(endpoint).1))
                .collect::<Vec<_>>();
            lines.push(format!(
                "import {{ {} }} from \"./{}.acl\";",
                abilities.join(", "),
                decapitalize(tag)
            ));
        }
    }
    let mut query_types = Vec::new();
    if !queries.is_empty() || (options.mutation_default_on_error && !mutations.is_empty()) {
        query_types.push("OpenApiQueryConfig".to_string());
    }
    if !queries.is_empty() {
        query_types.push("type AppQueryOptions".to_string());
    }
    if options.infinite_queries && !infinite.is_empty() {
        query_types.push("type AppInfiniteQueryOptions".into());
    }
    if !mutations.is_empty() {
        query_types.push("type AppMutationOptions".into());
    }
    lines.push(format!(
        "import {{ {} }} from \"{}\";",
        query_types.join(", "),
        options.query_types_import_path
    ));
    if endpoints
        .iter()
        .flat_map(|endpoint| {
            endpoint
                .get("parameters")
                .and_then(Value::as_array)
                .into_iter()
                .flatten()
        })
        .filter_map(|param| param.get("zodSchema").and_then(Value::as_str))
        .any(is_named_schema)
    {
        if options.ts_namespaces {
            lines.push(format!(
                "import {{ {models_namespace} }} from \"./{}.models\";",
                decapitalize(tag)
            ));
        } else {
            let mut imports: IndexMap<String, Vec<String>> = IndexMap::default();
            for endpoint in endpoints {
                for schema in endpoint
                    .get("parameters")
                    .and_then(Value::as_array)
                    .into_iter()
                    .flatten()
                    .filter_map(|parameter| parameter.get("zodSchema").and_then(Value::as_str))
                    .filter(|schema| is_named_schema(schema))
                {
                    let name = remove_suffix(&schema, &options.schema_suffix);
                    let owner = if options.models_in_modules {
                        tag
                    } else {
                        schema_owners.get(schema).and_then(Value::as_str).unwrap_or(tag)
                    };
                    let names = imports.entry(owner.to_string()).or_default();
                    if !names.contains(&name) {
                        names.push(name);
                    }
                }
            }
            for (owner, names) in imports {
                let owner_tag = decapitalize(&owner);
                let path = if owner == tag {
                    format!("./{owner_tag}.models")
                } else {
                    format!("{}{owner_tag}/{owner_tag}.models", import_root(options))
                };
                lines.push(format!(
                    "import type {{ {} }} from \"{path}\";",
                    names.join(", ")
                ));
            }
        }
    }
    if options.ts_namespaces {
        lines.push(format!(
            "import {{ {api_namespace} }} from \"./{}.api\";",
            decapitalize(tag)
        ));
    } else {
        let operations = endpoints
            .iter()
            .map(|endpoint| {
                endpoint_name(
                    endpoint
                        .get("operationName")
                        .and_then(Value::as_str)
                        .unwrap_or_default(),
                )
            })
            .collect::<Vec<_>>();
        lines.push(format!(
            "import {{ {} }} from \"./{}.api\";",
            operations.join(", "),
            decapitalize(tag)
        ));
    }
    lines.push(String::new());
    if options.ts_namespaces {
        lines.push(format!("export namespace {query_namespace} {{"));
    }
    lines.push(format!(
        "export const moduleName = {};",
        if options.mutation_effects {
            format!("QueryModule.{tag}")
        } else {
            format!("\"{query_namespace}\"")
        }
    ));
    lines.push(String::new());
    if !queries.is_empty() {
        render_query_keys(&mut lines, &queries, options, &models_namespace);
        lines.push(String::new());
    } else {
        // The TypeScript renderer appends both the empty renderQueryKeys result and
        // its separator. Preserve those raw blank lines for byte parity.
        lines.push(String::new());
        lines.push(String::new());
    }
    for endpoint in endpoints {
        if endpoint.get("method").and_then(Value::as_str) == Some("get") {
            render_query_options_native(
                &mut lines,
                endpoint,
                options,
                &models_namespace,
                &api_namespace,
                false,
            );
            lines.push(String::new());
            render_query_hook_native(
                &mut lines,
                endpoint,
                options,
                &models_namespace,
                &api_namespace,
                &acl_namespace,
                false,
            );
            lines.push(String::new());
            if options.prefetch_queries {
                render_prefetch_native(&mut lines, endpoint, options, &models_namespace, false);
                lines.push(String::new());
            }
        }
        if is_mutation_endpoint(endpoint) {
            render_mutation_native(
                &mut lines,
                endpoint,
                endpoints,
                options,
                &models_namespace,
                &api_namespace,
                &acl_namespace,
            );
            lines.push(String::new());
        }
        if endpoint.get("method").and_then(Value::as_str) == Some("get") {
            if options.infinite_queries && is_infinite(endpoint, options) {
                render_query_options_native(
                    &mut lines,
                    endpoint,
                    options,
                    &models_namespace,
                    &api_namespace,
                    true,
                );
                lines.push(String::new());
                render_query_hook_native(
                    &mut lines,
                    endpoint,
                    options,
                    &models_namespace,
                    &api_namespace,
                    &acl_namespace,
                    true,
                );
                lines.push(String::new());
                if options.prefetch_queries {
                    render_prefetch_native(&mut lines, endpoint, options, &models_namespace, true);
                    lines.push(String::new());
                }
            }
        }
    }
    if options.ts_namespaces {
        lines.push("}".into());
    }
    let mut content = format!("{}\n", lines.join("\n").trim_end());
    if !options.ts_namespaces {
        content = content.replace(&format!("{models_namespace}."), "");
        content = content.replace(&format!("{}Models.", capitalize(&options.default_tag)), "");
        content = content.replace(&format!("{api_namespace}."), "");
        content = content.replace(&format!("{acl_namespace}."), "");
    }
    content
}

fn import_root(options: &GenerateOptions) -> String {
    match options.import_path.as_str() {
        "relative" => "../".into(),
        "absolute" => format!("{}/", options.output.trim_end_matches('/')),
        _ => format!("{}/", options.ts_path.trim_end_matches('/')),
    }
}

fn is_infinite(endpoint: &Value, options: &GenerateOptions) -> bool {
    let page = &options.infinite_query_param_names.page;
    endpoint
        .get("parameters")
        .and_then(Value::as_array)
        .is_some_and(|parameters| {
            parameters.iter().any(|param| {
                param.get("name").and_then(Value::as_str) == Some(page)
                    && param.get("type").and_then(Value::as_str) == Some("Query")
            })
        })
}

fn render_query_keys(
    lines: &mut Vec<String>,
    endpoints: &[&Value],
    options: &GenerateOptions,
    models_namespace: &str,
) {
    lines.push("export const keys = {".into());
    lines.push("    all: [moduleName] as const,".into());
    for endpoint in endpoints {
        let name = endpoint_name(
            endpoint
                .get("operationName")
                .and_then(Value::as_str)
                .unwrap_or_default(),
        );
        let params = query_function_params(endpoint, options, models_namespace, false, true);
        lines.push(format!(
            "    {name}: ({}) => [...keys.all, \"{}\", {}] as const,",
            render_param_list(&params),
            endpoint
                .get("path")
                .and_then(Value::as_str)
                .unwrap_or_default(),
            render_arg_list(&params)
        ));
        if options.infinite_queries && is_infinite(endpoint, options) {
            let params = query_function_params(endpoint, options, models_namespace, true, true);
            lines.push(format!(
                "    {name}Infinite: ({}) => [...keys.all, \"{}\", \"infinite\", {}] as const,",
                render_param_list(&params),
                endpoint
                    .get("path")
                    .and_then(Value::as_str)
                    .unwrap_or_default(),
                render_arg_list(&params)
            ));
        }
    }
    lines.push("};".into());
}

fn query_function_params<'a>(
    endpoint: &'a Value,
    options: &GenerateOptions,
    models_namespace: &str,
    exclude_page: bool,
    path_required_only: bool,
) -> Vec<FunctionParam<'a>> {
    function_params(endpoint, options, models_namespace)
        .into_iter()
        .filter_map(|mut param| {
            if exclude_page && param.name == options.infinite_query_param_names.page {
                return None;
            }
            if path_required_only && param.kind != "Path" {
                param.required = false;
            }
            Some(param)
        })
        .collect()
}

fn render_param_list(params: &[FunctionParam<'_>]) -> String {
    params
        .iter()
        .map(|param| {
            format!(
                "{}{}: {}",
                param.name,
                if param.required { "" } else { "?" },
                param.ty
            )
        })
        .collect::<Vec<_>>()
        .join(", ")
}
fn render_arg_list(params: &[FunctionParam<'_>]) -> String {
    params
        .iter()
        .map(|param| param.name.as_str())
        .collect::<Vec<_>>()
        .join(", ")
}

fn query_names(endpoint: &Value) -> (String, String) {
    let operation = snake_to_camel(
        endpoint
            .get("operationName")
            .and_then(Value::as_str)
            .unwrap_or_default(),
    );
    let cap = capitalize(&operation);
    (operation, cap)
}

fn render_query_options_native(
    lines: &mut Vec<String>,
    endpoint: &Value,
    options: &GenerateOptions,
    models_namespace: &str,
    api_namespace: &str,
    infinite: bool,
) {
    let (operation, _) = query_names(endpoint);
    let api_operation = endpoint_name(
        endpoint
            .get("operationName")
            .and_then(Value::as_str)
            .unwrap_or_default(),
    );
    let params = query_function_params(endpoint, options, models_namespace, infinite, false);
    let args = render_arg_list(&params);
    let object = if params.is_empty() {
        String::new()
    } else {
        format!("{{ {args} }}: {{ {} }}", render_param_list(&params))
    };
    let options_name = format!(
        "{operation}{}QueryOptions",
        if infinite { "Infinite" } else { "" }
    );
    lines.push(format!("const {options_name} = ({object}{}config?: {} & {{ allowInvalidResponseData?: boolean }}) => ({{", if params.is_empty() { "" } else { ", " }, request_config_type(options)));
    lines.push(format!(
        "  queryKey: keys.{api_operation}{}({args}),",
        if infinite { "Infinite" } else { "" }
    ));
    let endpoint_args = if infinite {
        let full = query_function_params(endpoint, options, models_namespace, false, false);
        full.iter()
            .map(|param| {
                if param.name == options.infinite_query_param_names.page {
                    "pageParam".to_string()
                } else {
                    param.name.clone()
                }
            })
            .collect::<Vec<_>>()
            .join(", ")
    } else {
        args.clone()
    };
    if infinite {
        lines.push(format!("  queryFn: ({{ pageParam, signal }}: {{ pageParam: number; signal: AbortSignal }}) => {api_namespace}.{api_operation}({endpoint_args}, {{ ...config, signal }}),"));
        lines.push("  initialPageParam: 1,".into());
        let names = &options.infinite_query_response_param_names;
        lines.push(format!("  getNextPageParam: ({{ {}, {}, {}: limitParam }}: Awaited<ReturnType<typeof {api_namespace}.{api_operation}>>) => {{", names.page, names.total_items, names.limit));
        lines.push(format!("    const pageParam = {} ?? 1;", names.page));
        lines.push(format!(
            "    return pageParam * limitParam < ({} ?? 0) ? pageParam + 1 : null;",
            names.total_items
        ));
        lines.push("  },".into());
    } else {
        lines.push(format!("  queryFn: ({{ signal }}: {{ signal: AbortSignal }}) => {api_namespace}.{api_operation}({args}{}{{ ...config, signal }}),", if args.is_empty() { "" } else { ", " }));
    }
    lines.push("});".into());
}

fn render_query_hook_native(
    lines: &mut Vec<String>,
    endpoint: &Value,
    options: &GenerateOptions,
    models_namespace: &str,
    api_namespace: &str,
    acl_namespace: &str,
    infinite: bool,
) {
    let (operation, cap) = query_names(endpoint);
    let api_operation = endpoint_name(
        endpoint
            .get("operationName")
            .and_then(Value::as_str)
            .unwrap_or_default(),
    );
    let params = query_function_params(endpoint, options, models_namespace, infinite, false);
    let args = render_arg_list(&params);
    render_query_docs(lines, endpoint, options, models_namespace, infinite);
    let hook = format!("use{cap}{}", if infinite { "Infinite" } else { "" });
    let option_type = if infinite {
        "AppInfiniteQueryOptions"
    } else {
        "AppQueryOptions"
    };
    lines.push(format!("export const {hook} = <TData>({}options?: {option_type}<typeof {api_namespace}.{api_operation}, TData>) => {{", if params.is_empty() { "".into() } else { format!("{{ {args} }}: {{ {} }}, ", render_param_list(&params)) }));
    lines.push("  const queryConfig = OpenApiQueryConfig.useConfig();".into());
    let has_acl = options.check_acl
        && endpoint
            .get("acl")
            .and_then(Value::as_array)
            .is_some_and(|acl| !acl.is_empty());
    if has_acl {
        lines.push("  const { checkAcl } = useAclCheck();".into());
    }
    lines.push(if infinite { String::new() } else { "  ".into() });
    lines.push(format!(
        "  return {}({{",
        if infinite {
            "useInfiniteQuery"
        } else {
            "useQuery"
        }
    ));
    let options_name = format!(
        "{operation}{}QueryOptions",
        if infinite { "Infinite" } else { "" }
    );
    let call_args = format!(
        "{}{{ allowInvalidResponseData: queryConfig.allowInvalidResponseData }}",
        if params.is_empty() {
            "".into()
        } else {
            format!("{{ {args} }}, ")
        }
    );
    lines.push(format!("    ...{options_name}({call_args}),"));
    if has_acl {
        lines.push(format!(
            "    queryFn: async ({{ {}signal }}: {{ {}signal: AbortSignal }}) => {{",
            if infinite { "pageParam, " } else { "" },
            if infinite { "pageParam: number; " } else { "" }
        ));
        lines.push(format!(
            "{}checkAcl({acl_namespace}.canUse{cap}({}));",
            if infinite { "      " } else { "    " },
            acl_args(endpoint)
        ));
        lines.push(format!(
            "      return {options_name}({call_args}).queryFn({{ {}signal }});",
            if infinite { "pageParam, " } else { "" }
        ));
        lines.push("    },".into());
    }
    lines.push("    ...options,".into());
    lines.push("  });".into());
    lines.push("};".into());
}

fn acl_args(endpoint: &Value) -> String {
    let Some(conditions) = endpoint
        .pointer("/acl/0/conditionsTypes")
        .and_then(Value::as_array)
    else {
        return String::new();
    };
    if conditions.is_empty() {
        return String::new();
    }
    let mut names: Vec<String> = conditions
        .iter()
        .filter_map(|condition| condition.get("name").and_then(Value::as_str))
        .map(variable_name)
        .collect();
    names.sort();
    let params: HashSet<String> = endpoint
        .get("parameters")
        .and_then(Value::as_array)
        .into_iter()
        .flatten()
        .filter_map(|param| param.get("name").and_then(Value::as_str))
        .map(variable_name)
        .collect();
    if names.iter().all(|name| params.contains(name)) {
        format!("{{ {} }} ", names.join(", "))
    } else {
        String::new()
    }
}

fn render_prefetch_native(
    lines: &mut Vec<String>,
    endpoint: &Value,
    options: &GenerateOptions,
    models_namespace: &str,
    infinite: bool,
) {
    let (operation, cap) = query_names(endpoint);
    let params = query_function_params(endpoint, options, models_namespace, infinite, false);
    let args = render_arg_list(&params);
    let function = format!("prefetch{cap}{}", if infinite { "Infinite" } else { "" });
    let factory = format!(
        "{operation}{}QueryOptions",
        if infinite { "Infinite" } else { "" }
    );
    let method = if infinite {
        "prefetchInfiniteQuery"
    } else {
        "prefetchQuery"
    };
    let omitted = if infinite {
        "\"queryKey\" | \"queryFn\" | \"initialPageParam\" | \"getNextPageParam\""
    } else {
        "\"queryKey\" | \"queryFn\""
    };
    let has_request_config = options.axios_request_config
        || endpoint.get("method").and_then(Value::as_str) == Some("get");
    let request_config_param = if has_request_config {
        format!("config?: {}, ", request_config_type(options))
    } else {
        String::new()
    };
    lines.push(format!("export const {function} = (queryClient: QueryClient, {}options?: Omit<Parameters<QueryClient[\"{method}\"]>[0], {omitted}>, {request_config_param}throwOnError = false) => {{", if params.is_empty() { "".into() } else { format!("{{ {args} }}: {{ {} }}, ", render_param_list(&params)) }));
    let request_config_arg = if has_request_config {
        if params.is_empty() {
            "config"
        } else {
            ", config"
        }
    } else {
        ""
    };
    lines.push(format!(
        "  const queryOptions = {{ ...{factory}({}{}), ...{} }};",
        if params.is_empty() {
            "".into()
        } else {
            format!("{{ {args} }}")
        },
        request_config_arg,
        if infinite {
            "(options as {})"
        } else {
            "options"
        }
    ));
    lines.push(format!(
        "  return throwOnError ? queryClient.{}(queryOptions) : queryClient.{method}(queryOptions);",
        if infinite { "fetchInfiniteQuery" } else { "fetchQuery" }
    ));
    lines.push("};".into());
}

fn render_query_docs(
    lines: &mut Vec<String>,
    endpoint: &Value,
    options: &GenerateOptions,
    models_namespace: &str,
    infinite: bool,
) {
    let (_, cap) = query_names(endpoint);
    lines.push("/** ".into());
    lines.push(if infinite {
        format!(" * Infinite query `use{cap}Infinite")
    } else {
        format!(
            " * Query `use{cap}`{}",
            if endpoint
                .get("summary")
                .and_then(Value::as_str)
                .is_some_and(|value| !value.is_empty())
                && endpoint
                    .get("mediaDownload")
                    .and_then(Value::as_bool)
                    .unwrap_or(false)
            {
                " - recommended when file should be cached"
            } else {
                ""
            }
        )
    });
    if let Some(summary) = endpoint
        .get("summary")
        .and_then(Value::as_str)
        .filter(|value| !value.is_empty())
    {
        lines.push(format!(" * @summary {}", summary.replace('\n', "\n *")));
    }
    if let Some(description) = endpoint
        .get("description")
        .and_then(Value::as_str)
        .filter(|value| !value.is_empty())
    {
        lines.push(format!(
            " * @description {}",
            description.replace('\n', "\n *")
        ));
    }
    if endpoint
        .get("acl")
        .and_then(Value::as_array)
        .is_some_and(|acl| !acl.is_empty())
    {
        lines.push(format!(" * @permission Requires `canUse{cap}` ability "));
    }
    for param in function_params(endpoint, options, models_namespace) {
        lines.push(format!(
            " * @param {{ {} }} {} {} parameter{}",
            param.ty,
            param.name,
            param.kind,
            parameter_description(param.source)
        ));
    }
    lines.push(if infinite {
        " * @param { AppInfiniteQueryOptions } options Infinite query options".into()
    } else {
        " * @param { AppQueryOptions } options Query options".into()
    });
    let response = endpoint
        .get("response")
        .and_then(Value::as_str)
        .unwrap_or("z.void()");
    let result = schema_type(response, models_namespace, options);
    let result = if !infinite
        && endpoint
            .get("mediaDownload")
            .and_then(Value::as_bool)
            .unwrap_or(false)
    {
        format!("{}<{result}>", response_type(options))
    } else {
        result
    };
    lines.push(format!(
        " * @returns {{ {}<{}> }} {}",
        if infinite {
            "UseInfiniteQueryResult"
        } else {
            "UseQueryResult"
        },
        result,
        endpoint
            .get("responseDescription")
            .and_then(Value::as_str)
            .unwrap_or_default()
    ));
    let statuses = endpoint
        .get("responseStatusCodes")
        .and_then(Value::as_array)
        .into_iter()
        .flatten()
        .filter_map(Value::as_str)
        .collect::<Vec<_>>()
        .join(", ");
    lines.push(format!(" * @statusCodes [{statuses}]"));
    lines.push(" */".into());
}

fn schema_type(schema: &str, models_namespace: &str, options: &GenerateOptions) -> String {
    if schema == "z.void()" {
        "void".into()
    } else if is_named_schema(schema) {
        format!(
            "{models_namespace}.{}",
            remove_suffix(schema, &options.schema_suffix)
        )
    } else {
        schema.to_string()
    }
}

fn parameter_description(parameter: &Value) -> String {
    let mut parts = Vec::new();
    if let Some(description) = parameter
        .get("parameterObject")
        .or_else(|| parameter.get("bodyObject"))
        .and_then(|object| object.get("description"))
        .and_then(Value::as_str)
    {
        parts.push(description.to_string());
    }
    let schema = parameter
        .pointer("/parameterObject/schema")
        .filter(|schema| schema.get("$ref").is_none());
    if let Some(schema) = schema {
        if let Some(minimum) = schema.get("minimum") {
            parts.push(format!("Minimum: `{minimum}`"));
        }
        if let Some(maximum) = schema.get("maximum") {
            parts.push(format!("Maximum: `{maximum}`"));
        }
        if let Some(default) = schema.get("default") {
            parts.push(format!("Default: `{}`", display_json(default)));
        }
        if let Some(example) = schema.get("example") {
            parts.push(format!("Example: `{}`", display_json(example)));
        }
    }
    if parts.is_empty() {
        String::new()
    } else {
        format!(". {}", parts.join(". "))
    }
}

fn display_json(value: &Value) -> String {
    value
        .as_str()
        .map(str::to_string)
        .unwrap_or_else(|| value.to_string())
}

fn is_mutation_endpoint(endpoint: &Value) -> bool {
    endpoint.get("method").and_then(Value::as_str) != Some("get")
        || endpoint
            .get("mediaDownload")
            .and_then(Value::as_bool)
            .unwrap_or(false)
}

fn mutation_scope_enabled(endpoint: &Value, tag: &str, options: &GenerateOptions) -> bool {
    if endpoint.get("method").and_then(Value::as_str) == Some("post")
        || !is_mutation_endpoint(endpoint)
    {
        return false;
    }
    let operation = endpoint_name(
        endpoint
            .get("operationName")
            .and_then(Value::as_str)
            .unwrap_or_default(),
    );
    let key = format!("{tag}/{operation}");
    match &options.mutation_scope {
        Value::Bool(value) => *value,
        Value::Object(object) => {
            if let Some(include) = object.get("include").and_then(Value::as_array) {
                include
                    .iter()
                    .filter_map(Value::as_str)
                    .any(|value| value == operation || value == key)
            } else if let Some(exclude) = object.get("exclude").and_then(Value::as_array) {
                !exclude
                    .iter()
                    .filter_map(Value::as_str)
                    .any(|value| value == operation || value == key)
            } else {
                false
            }
        }
        _ => false,
    }
}

fn render_mutation_native(
    lines: &mut Vec<String>,
    endpoint: &Value,
    all_endpoints: &[&Value],
    options: &GenerateOptions,
    models_namespace: &str,
    api_namespace: &str,
    acl_namespace: &str,
) {
    let (_, cap) = query_names(endpoint);
    let api_operation = endpoint_name(
        endpoint
            .get("operationName")
            .and_then(Value::as_str)
            .unwrap_or_default(),
    );
    let mutation_cap = if endpoint.get("method").and_then(Value::as_str) == Some("get") {
        format!("{cap}Mutation")
    } else {
        cap.clone()
    };
    let params = query_function_params(endpoint, options, models_namespace, false, false);
    let args = render_arg_list(&params);
    let media_upload = endpoint
        .get("mediaUpload")
        .and_then(Value::as_bool)
        .unwrap_or(false);
    let scope_params: Vec<&FunctionParam<'_>> = if mutation_scope_enabled(
        endpoint,
        endpoint
            .get("tags")
            .and_then(Value::as_array)
            .and_then(|tags| tags.first())
            .and_then(Value::as_str)
            .unwrap_or(&options.default_tag),
        options,
    ) {
        params.iter().filter(|param| param.kind == "Path").collect()
    } else {
        Vec::new()
    };
    let is_scoped = !scope_params.is_empty();
    let effective_params: Vec<FunctionParam<'_>> = if is_scoped {
        params
            .iter()
            .filter(|param| param.kind != "Path")
            .cloned()
            .collect()
    } else {
        params.clone()
    };
    let effective_args = render_arg_list(&effective_params);
    render_mutation_docs(lines, endpoint, options, models_namespace);
    let mut variables = render_param_list(&effective_params);
    if media_upload {
        if !variables.is_empty() {
            variables.push_str(", ");
        }
        variables.push_str("file?: File; abortController?: AbortController; onUploadProgress?: (progress: { loaded: number; total: number }) => void");
    }
    let path_arg = if is_scoped {
        let names = scope_params
            .iter()
            .map(|param| param.name.as_str())
            .collect::<Vec<_>>()
            .join(", ");
        let common_namespace = format!(
            "{}{}",
            capitalize(&options.default_tag),
            options
                .configs
                .get("models")
                .map(|config| config.namespace_suffix.as_str())
                .unwrap_or("Models")
        );
        let types = scope_params
            .iter()
            .map(|param| {
                let schema = param
                    .source
                    .get("zodSchema")
                    .and_then(Value::as_str)
                    .unwrap_or_default();
                let ty = if is_named_schema(schema) {
                    format!(
                        "{common_namespace}.{}",
                        remove_suffix(schema, &options.schema_suffix)
                    )
                } else {
                    param.ty.clone()
                };
                format!("{}: {ty}", param.name)
            })
            .collect::<Vec<_>>()
            .join("; ");
        format!("{{ {names} }}: {{ {types} }}, ")
    } else {
        String::new()
    };
    let variables_arg = if is_scoped && effective_params.is_empty() {
        String::new()
    } else {
        format!(", {{ {variables} }}")
    };
    lines.push(format!(
        "export const use{mutation_cap} = ({path_arg}options?: AppMutationOptions<typeof {api_namespace}.{api_operation}{variables_arg}>{}) => {{",
        if options.mutation_effects { " & MutationEffectsOptions" } else { "" }
    ));
    if options.mutation_default_on_error {
        lines.push("  const queryConfig = OpenApiQueryConfig.useConfig();".into());
    }
    let has_acl = options.check_acl
        && endpoint
            .get("acl")
            .and_then(Value::as_array)
            .is_some_and(|acl| !acl.is_empty());
    if has_acl {
        lines.push("  const { checkAcl } = useAclCheck();".into());
    }
    if options.mutation_effects {
        let tag = endpoint
            .get("tags")
            .and_then(Value::as_array)
            .and_then(|tags| tags.first())
            .and_then(Value::as_str)
            .unwrap_or(&options.default_tag);
        lines.push(format!("  const {{ runMutationEffects }} = useMutationEffects<QueryModule.{tag}>({{ currentModule: moduleName }});"));
    }
    lines.push(String::new());
    lines.push("  return useMutation({".into());
    let has_body = has_acl || media_upload;
    let mut mutation_args = effective_args.clone();
    if media_upload {
        if !mutation_args.is_empty() {
            mutation_args.push_str(", ");
        }
        mutation_args.push_str("file, abortController, onUploadProgress");
    }
    lines.push(format!(
        "    mutationFn: {}({}) => {}",
        if media_upload { "async " } else { "" },
        if mutation_args.is_empty() {
            "".into()
        } else {
            format!("{{ {mutation_args} }}")
        },
        if has_body { "{ " } else { "" }
    ));
    if has_acl {
        lines.push(format!(
            "      checkAcl({acl_namespace}.canUse{cap}({}));",
            acl_args(endpoint)
        ));
    }
    if media_upload {
        render_media_upload_body(
            lines,
            api_namespace,
            &api_operation,
            &args,
            options.axios_request_config,
            options,
        );
        lines.push("    },".into());
    } else if has_acl {
        lines.push(format!(
            "      return {api_namespace}.{api_operation}({args})"
        ));
        lines.push("    },".into());
    } else {
        lines.push(format!("      {api_namespace}.{api_operation}({args})"));
        lines.push(",".into());
    }
    if is_scoped {
        let interpolation = scope_params
            .iter()
            .map(|param| format!(":${{{}}}", param.name))
            .collect::<Vec<_>>()
            .join("");
        lines.push(format!(
            "    scope: {{ id: `{api_operation}{interpolation}` }},"
        ));
    }
    lines.push("    ...options,".into());
    if options.mutation_default_on_error {
        lines.push("    onError: options?.onError ?? queryConfig.onError,".into());
    }
    if options.mutation_effects {
        let updates = update_query_endpoints(endpoint, all_endpoints);
        lines
            .push("    onSuccess: async (resData, variables, onMutateResult, context) => {".into());
        if updates.is_empty() {
            lines.push("      await runMutationEffects(resData, variables, options);".into());
        } else {
            let destructured =
                destructured_update_variables(endpoint, &updates, options, models_namespace);
            let scoped_names: HashSet<&str> = scope_params
                .iter()
                .map(|param| param.name.as_str())
                .collect();
            let destructured: Vec<String> = destructured
                .into_iter()
                .filter(|name| !scoped_names.contains(name.as_str()))
                .collect();
            if !destructured.is_empty() {
                lines.push(format!(
                    "      const {{ {} }} = variables;",
                    destructured.join(", ")
                ));
            }
            let keys = updates
                .iter()
                .map(|query| {
                    let name = endpoint_name(
                        query
                            .get("operationName")
                            .and_then(Value::as_str)
                            .unwrap_or_default(),
                    );
                    let required: Vec<FunctionParam<'_>> =
                        query_function_params(query, options, models_namespace, false, false)
                            .into_iter()
                            .filter(|param| param.required)
                            .collect();
                    format!("keys.{name}({})", render_arg_list(&required))
                })
                .collect::<Vec<_>>()
                .join(", ");
            lines.push(format!("      const updateKeys = [{keys}];"));
            lines.push(
                "      await runMutationEffects(resData, variables, options, updateKeys);".into(),
            );
        }
        lines.push(
            "      options?.onSuccess?.(resData, variables, onMutateResult, context);".into(),
        );
        lines.push("    },".into());
    }
    lines.push("  });".into());
    lines.push("};".into());
}

fn render_media_upload_body(
    lines: &mut Vec<String>,
    api_namespace: &str,
    operation: &str,
    args: &str,
    has_config: bool,
    options: &GenerateOptions,
) {
    let config_arg = if has_config {
        if args.is_empty() {
            "config"
        } else {
            ", config"
        }
    } else {
        ""
    };
    lines.push(format!(
        "      const uploadInstructions = await {api_namespace}.{operation}({args}{config_arg});"
    ));
    lines.push("      ".into());
    lines.push("      if (file && uploadInstructions.url) {".into());
    lines.push(
        "        const method = (uploadInstructions.method?.toLowerCase() ?? \"put\") as \"put\" | \"post\";"
            .into(),
    );
    lines.push("        let dataToSend: File | FormData = file;".into());
    lines.push("        if (method === \"post\") {".into());
    lines.push("          dataToSend = new FormData();".into());
    lines.push("          if (uploadInstructions.fields) {".into());
    lines.push("            for (const [key, value] of uploadInstructions.fields) {".into());
    lines.push("              dataToSend.append(key, value);".into());
    lines.push("            }".into());
    lines.push("          }".into());
    lines.push("          dataToSend.append(\"file\", file);".into());
    lines.push("        }".into());
    lines.push(if uses_native_rest_client(options) {
        "        await AppRestClient.upload(uploadInstructions.url, dataToSend, {".into()
    } else {
        "        await axios[method](uploadInstructions.url, dataToSend, {".into()
    });
    if uses_native_rest_client(options) {
        lines.push("          headers: method === \"put\" ? { \"Content-Type\": file.type } : undefined,".into());
    } else {
        lines.push("          headers: {".into());
        lines.push("            \"Content-Type\": file.type,".into());
        lines.push("          },".into());
    }
    lines.push("          signal: abortController?.signal,".into());
    lines.push("          onUploadProgress: onUploadProgress".into());
    lines.push("          ? (progressEvent) => onUploadProgress({ loaded: progressEvent.loaded, total: progressEvent.total ?? 0 })".into());
    lines.push("          : undefined,".into());
    lines.push(if uses_native_rest_client(options) {
        "        }, method);".into()
    } else {
        "        });".into()
    });
    lines.push("      }".into());
    lines.push("      ".into());
    lines.push("      return uploadInstructions;".into());
}

fn update_query_endpoints<'a>(mutation: &Value, endpoints: &'a [&Value]) -> Vec<&'a Value> {
    let response = mutation.get("response").and_then(Value::as_str);
    let mutation_names: HashSet<&str> = mutation
        .get("parameters")
        .and_then(Value::as_array)
        .into_iter()
        .flatten()
        .filter_map(|param| param.get("name").and_then(Value::as_str))
        .collect();
    endpoints
        .iter()
        .copied()
        .filter(|endpoint| {
            endpoint.get("method").and_then(Value::as_str) == Some("get")
                && endpoint.get("response").and_then(Value::as_str) == response
                && endpoint
                    .get("parameters")
                    .and_then(Value::as_array)
                    .into_iter()
                    .flatten()
                    .filter(|param| {
                        param
                            .get("parameterObject")
                            .and_then(|object| object.get("required"))
                            .and_then(Value::as_bool)
                            .unwrap_or(false)
                    })
                    .filter_map(|param| param.get("name").and_then(Value::as_str))
                    .all(|name| mutation_names.contains(name))
        })
        .collect()
}

fn destructured_update_variables(
    mutation: &Value,
    updates: &[&Value],
    options: &GenerateOptions,
    models_namespace: &str,
) -> Vec<String> {
    let required_names: HashSet<String> = updates
        .iter()
        .flat_map(|endpoint| {
            query_function_params(endpoint, options, models_namespace, false, false)
        })
        .filter(|param| param.required)
        .map(|param| param.name)
        .collect();
    query_function_params(mutation, options, models_namespace, false, false)
        .into_iter()
        .filter(|param| {
            param.required && param.kind != "Body" && required_names.contains(&param.name)
        })
        .map(|param| param.name)
        .collect()
}

fn render_mutation_docs(
    lines: &mut Vec<String>,
    endpoint: &Value,
    options: &GenerateOptions,
    models_namespace: &str,
) {
    let (_, cap) = query_names(endpoint);
    let mutation_cap = if endpoint.get("method").and_then(Value::as_str) == Some("get") {
        format!("{cap}Mutation")
    } else {
        cap.clone()
    };
    lines.push("/** ".into());
    lines.push(format!(
        " * Mutation `use{mutation_cap}`{}",
        if endpoint
            .get("summary")
            .and_then(Value::as_str)
            .is_some_and(|value| !value.is_empty())
            && endpoint
                .get("mediaDownload")
                .and_then(Value::as_bool)
                .unwrap_or(false)
        {
            " - recommended when file should not be cached"
        } else {
            ""
        }
    ));
    if let Some(summary) = endpoint
        .get("summary")
        .and_then(Value::as_str)
        .filter(|value| !value.is_empty())
    {
        lines.push(format!(" * @summary {}", summary.replace('\n', "\n *")));
    }
    if let Some(description) = endpoint
        .get("description")
        .and_then(Value::as_str)
        .filter(|value| !value.is_empty())
    {
        lines.push(format!(
            " * @description {}",
            description.replace('\n', "\n *")
        ));
    }
    if endpoint
        .get("acl")
        .and_then(Value::as_array)
        .is_some_and(|acl| !acl.is_empty())
    {
        lines.push(format!(" * @permission Requires `canUse{cap}` ability "));
    }
    for param in function_params(endpoint, options, models_namespace) {
        lines.push(format!(
            " * @param {{ {} }} {} {} parameter{}",
            param.ty,
            param.name,
            param.kind,
            parameter_description(param.source)
        ));
    }
    if endpoint
        .get("mediaUpload")
        .and_then(Value::as_bool)
        .unwrap_or(false)
    {
        lines.push(" * @param { File } file Body parameter".into());
    }
    lines.push(format!(
        " * @param {{ AppMutationOptions{} }} options Mutation options",
        if options.mutation_effects {
            " & MutationEffectsOptions"
        } else {
            ""
        }
    ));
    let response = endpoint
        .get("response")
        .and_then(Value::as_str)
        .unwrap_or("z.void()");
    let result = schema_type(response, models_namespace, options);
    lines.push(format!(
        " * @returns {{ UseMutationResult<{}> }} {}",
        if endpoint
            .get("mediaDownload")
            .and_then(Value::as_bool)
            .unwrap_or(false)
        {
            format!("{}<{result}>", response_type(options))
        } else {
            result
        },
        endpoint
            .get("responseDescription")
            .and_then(Value::as_str)
            .unwrap_or_default()
    ));
    let statuses = endpoint
        .get("responseStatusCodes")
        .and_then(Value::as_array)
        .into_iter()
        .flatten()
        .filter_map(Value::as_str)
        .collect::<Vec<_>>()
        .join(", ");
    lines.push(format!(" * @statusCodes [{statuses}]"));
    lines.push(" */".into());
}
