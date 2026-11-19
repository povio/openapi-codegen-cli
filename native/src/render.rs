use std::{borrow::Cow, collections::VecDeque};

use crate::json::{Map, Value};
use indexmap::{IndexMap as BaseIndexMap, IndexSet as BaseIndexSet};
use rayon::prelude::*;
use rustc_hash::{FxBuildHasher, FxHashMap as HashMap, FxHashSet as HashSet};

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
    circular_schemas: &[String],
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
            circular_schemas,
            options,
        );
    }
    let render_dependencies = augment_render_dependencies(schemas, schema_refs, dependencies);
    let after_dependencies = started.elapsed();
    let composite_dependencies = compiled_component_dependencies(schemas, schema_refs);
    let after_composites = started.elapsed();
    let ((common, common_elapsed), (proxies, proxies_elapsed)) = rayon::join(
        || {
            let started = std::time::Instant::now();
            let content = render_common_models(
                document,
                schemas,
                schema_refs,
                generated_objects,
                &document_enum_objects(document),
                &property_refs(schema_refs, schema_owners, options),
                circular_schemas,
                &options.default_tag,
                options,
            );
            (content, started.elapsed())
        },
        || {
            let started = std::time::Instant::now();
            let content = render_proxy_modules(
                endpoints,
                schemas,
                schema_refs,
                &render_dependencies,
                &composite_dependencies,
                generated_dependencies,
                options,
            );
            (content, started.elapsed())
        },
    );
    // Match JavaScript: an empty schema collection emits no shared model file.
    if !schemas.is_empty() {
        rendered.insert(options.default_tag.clone(), Value::String(common));
    }
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
    circular_schemas: &[String],
    options: &GenerateOptions,
) -> Map<String, Value> {
    // Which schemas each module gets, in schema order; modules copy their code in parallel below.
    let mut by_tag: IndexMap<String, Vec<(&String, &Value)>> = IndexMap::default();
    for (name, code) in schemas {
        if options.models_in_modules
            && let Some(tags) = schema_usage_tags.get(name)
        {
            for tag in tags {
                by_tag.entry(tag.clone()).or_default().push((name, code));
            }
        } else if let Some(tag) = schema_owners.get(name).and_then(Value::as_str) {
            by_tag
                .entry(tag.to_string())
                .or_default()
                .push((name, code));
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
    // Independent scans of the document and the schema references.
    let scan_inline_enums = || -> HashMap<&str, Vec<String>> {
        let references: Vec<&str> = schema_refs.values().filter_map(Value::as_str).collect();
        references
            .into_par_iter()
            .filter_map(|reference| {
                let schema = resolve_document_ref(document, reference)?;
                if schema.get("enum").is_some() {
                    return None;
                }
                let mut codes = IndexSet::default();
                collect_inline_enum_codes(schema, &mut codes);
                Some((reference, codes.into_iter().collect()))
            })
            .collect()
    };
    let (enum_objects, (property_refs, inline_enums)) = rayon::join(
        || document_enum_objects(document),
        || {
            rayon::join(
                || property_refs(schema_refs, schema_owners, options),
                scan_inline_enums,
            )
        },
    );
    // First non-ref schema per enum code, matching the previous linear `find_map` over `schemas`.
    let mut enum_name_by_code: HashMap<&str, &str> = HashMap::default();
    for (name, value) in schemas {
        if let Some(code) = value.as_str()
            && !schema_refs.contains_key(name)
        {
            enum_name_by_code.entry(code).or_insert(name.as_str());
        }
    }
    // Inline enums with a component enum's values are rendered as that enum.
    if options.extract_enums {
        for (name, value) in schemas {
            if let Some(code) = value.as_str().filter(|code| code.starts_with("z.enum("))
                && schema_refs.contains_key(name)
            {
                enum_name_by_code.entry(code).or_insert(name.as_str());
            }
        }
    }
    // Each component's inline enum dependencies (`inline_enums`, built above) are independent of
    // its module: built once, the ordered list is borrowed in every module that uses it.
    // With `modelsInModules` the dependencies are copied into the module (not imported) in the
    // order they are found, as the TypeScript renderer appends them, so they are not grouped by owner.
    let import_group = |owner: &str| {
        if options.models_in_modules {
            String::new()
        } else {
            owner.to_string()
        }
    };
    let modules = by_tag
        .into_iter()
        .collect::<Vec<_>>()
        .into_par_iter()
        .map(|(tag, entries)| {
            let mut tag_schemas: Map<String, Value> = entries
                .into_iter()
                .map(|(name, code)| (name.clone(), code.clone()))
                .collect();
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
                            let names = imports.entry(import_group(owner)).or_default();
                            if !names.iter().any(|existing| existing == name) {
                                names.push(name.to_string());
                            }
                        }
                    }
                    // An enum component declares its values; it does not use another enum.
                    if let Some(enum_codes) = inline_enums.get(reference) {
                        for code in enum_codes {
                            let Some(name) = enum_name_by_code.get(code.as_str()).copied() else {
                                continue;
                            };
                            let Some(owner) = schema_owners.get(name).and_then(Value::as_str)
                            else {
                                continue;
                            };
                            if owner != tag {
                                let names = imports.entry(import_group(owner)).or_default();
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
                        &import_group,
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
                let namespace_suffix = options
                    .configs
                    .get("models")
                    .map(|config| config.namespace_suffix.as_str())
                    .unwrap_or("Models");
                for value in tag_schemas.values_mut() {
                    let Value::String(code) = value else {
                        continue;
                    };
                    *code = strip_model_namespace_references(code, namespace_suffix);
                }
            } else {
                // Generated schemas can reference schemas the dependency graph does not record (e.g. an
                // inline enum extracted to a shared enum owned by another tag), so the emitted code is
                // the final source of truth for which models need to be imported.
                for code in tag_schemas.values().filter_map(Value::as_str) {
                    for name in code_schema_references(code, |name| schemas.contains_key(name)) {
                        if tag_schemas.contains_key(&name) {
                            continue;
                        }
                        let Some(owner) = schema_owners.get(&name).and_then(Value::as_str) else {
                            continue;
                        };
                        if owner != tag {
                            let names = imports.entry(owner.to_string()).or_default();
                            if !names.contains(&name) {
                                names.push(name);
                            }
                        }
                    }
                }
            }
            let mut content = render_common_models(
                document,
                &tag_schemas,
                schema_refs,
                generated_objects,
                &enum_objects,
                &property_refs,
                circular_schemas,
                &tag,
                options,
            );
            if !imports.is_empty() {
                let mut lines = vec!["import { z } from \"zod\";".to_string()];
                for (owner, names) in imports {
                    let owner_tag = decapitalize(&owner);
                    lines.push(format!(
                    "import {{ {} }} from \"{import_root}{owner_tag}/{owner_tag}.{model_suffix}\";",
                    if options.ts_namespaces {
                        let suffix = options
                            .configs
                            .get("models")
                            .map(|config| config.namespace_suffix.as_str())
                            .unwrap_or("Models");
                        format!("{}{suffix}", capitalize(&owner))
                    } else {
                        names.join(", ")
                    }
                ));
                }
                content = content.replacen("import { z } from \"zod\";", &lines.join("\n"), 1);
            }
            (tag, Value::String(content))
        })
        .collect::<Vec<_>>();
    rendered.extend(modules);
    rendered
}

fn collect_inline_enum_codes(value: &Value, codes: &mut IndexSet<String>) {
    match value {
        Value::Array(values) => values
            .iter()
            .for_each(|value| collect_inline_enum_codes(value, codes)),
        Value::Object(object) => {
            if !object.contains_key("$ref") {
                if let Some(code) = crate::zod::enum_code(value) {
                    codes.insert(code);
                }
                object
                    .iter()
                    .filter(|(key, _)| !crate::zod::is_stray_array_keyword(object, key))
                    .for_each(|(_, value)| collect_inline_enum_codes(value, codes));
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
    import_group: &dyn Fn(&str) -> String,
    imports: &mut IndexMap<String, Vec<String>>,
    visited: &mut HashSet<String>,
) {
    if !visited.insert(name.to_string()) {
        return;
    }
    if let Some(owner) = schema_owners.get(name).and_then(Value::as_str) {
        if owner != tag && schemas.contains_key(name) {
            let names = imports.entry(import_group(owner)).or_default();
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
            import_group,
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
    let schema_positions: HashMap<&str, usize> = schemas
        .keys()
        .enumerate()
        .map(|(position, name)| (name.as_str(), position))
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
            // Generated schemas reach components only: JavaScript collects their refs, not the
            // extracted enums they use. A component's extracted enums follow its refs, in extraction
            // order (the order of `schemas`).
            let is_component = ref_by_name.contains_key(name.as_str());
            if let Some(code) = schemas.get(&name).and_then(Value::as_str) {
                let mut extracted_enums = Vec::new();
                for candidate in schema_identifiers(code) {
                    if candidate == name
                        || !schemas.contains_key(candidate)
                        || direct_names.contains(candidate)
                    {
                        continue;
                    }
                    let extracted_enum = !ref_by_name.contains_key(candidate)
                        && schemas
                            .get(candidate)
                            .and_then(Value::as_str)
                            .is_some_and(|code| code.starts_with("z.enum("));
                    if !extracted_enum {
                        enqueue(candidate, &mut used, &mut seen, &mut queue);
                    } else if is_component {
                        extracted_enums.push(candidate);
                    }
                }
                extracted_enums.sort_by_key(|candidate| schema_positions.get(candidate).copied());
                for candidate in extracted_enums {
                    enqueue(candidate, &mut used, &mut seen, &mut queue);
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

// Keep tiny modules sequential to avoid task scheduling overhead, and submit larger
// ordered batches to the reusable render pool (including nested render calls).
fn render_schema_items<T: Send>(
    schemas: &Map<String, Value>,
    render: impl Fn(&str, &Value) -> Option<T> + Sync,
) -> Vec<T> {
    const PARALLEL_SCHEMA_THRESHOLD: usize = 128;
    if schemas.len() < PARALLEL_SCHEMA_THRESHOLD {
        return schemas
            .iter()
            .filter_map(|(name, code)| render(name, code))
            .collect();
    }
    let schemas = schemas.iter().collect::<Vec<_>>();
    let chunk_size = schemas.len().div_ceil(4);
    schemas
        .par_chunks(chunk_size)
        .map(|chunk| {
            chunk
                .iter()
                .filter_map(|(name, code)| render(name, code))
                .collect::<Vec<_>>()
        })
        .collect::<Vec<_>>()
        .into_iter()
        .flatten()
        .collect()
}

fn render_common_models(
    document: &Value,
    schemas: &Map<String, Value>,
    schema_refs: &Map<String, Value>,
    generated_objects: &Map<String, Value>,
    enum_objects: &HashMap<String, Cow<'_, Value>>,
    property_refs: &PropertyRefs,
    circular_schemas: &[String],
    namespace_tag: &str,
    options: &GenerateOptions,
) -> String {
    let suffix = &options.schema_suffix;
    let namespace_suffix = options
        .configs
        .get("models")
        .map(|config| config.namespace_suffix.as_str())
        .unwrap_or("Models");
    let namespace = format!("{}{}", capitalize(namespace_tag), namespace_suffix);
    let property_ref_names = PropertyRefNames {
        refs: property_refs,
        namespace_tag,
        namespace_suffix,
        ts_namespaces: options.ts_namespaces,
    };
    let mut lines = vec!["import { z } from \"zod\";".to_string(), String::new()];
    if options.lazy_schemas && options.ts_namespaces {
        return render_lazy_common_models(
            document,
            schemas,
            schema_refs,
            generated_objects,
            &enum_objects,
            circular_schemas,
            suffix,
            &property_ref_names,
            &namespace,
            lines,
            options,
        );
    }
    if options.ts_namespaces {
        lines.push(format!("export namespace {namespace} {{"));
    }
    let schema_lines = render_schema_items(schemas, |name, code| {
        render_common_schema_lines(
            document,
            name,
            code,
            schema_refs,
            generated_objects,
            enum_objects,
            circular_schemas,
            suffix,
            &property_ref_names,
            options,
        )
    });
    lines.extend(schema_lines.into_iter().flatten());
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
    enum_objects: &HashMap<String, Cow<'_, Value>>,
    circular_schemas: &[String],
    suffix: &str,
    property_ref_names: &PropertyRefNames,
    options: &GenerateOptions,
) -> Option<Vec<String>> {
    let code = code.as_str()?;
    let (mut lines, schema_object) = render_schema_docs(
        document,
        name,
        code,
        schema_refs,
        generated_objects,
        enum_objects,
        property_ref_names,
        options.generate_js_doc,
    );
    let type_name = remove_suffix(name, suffix);
    let is_circular = circular_schemas.iter().any(|schema| schema == name);
    if is_circular {
        if let Some(schema) = schema_object {
            lines.push(format!(
                "export type {type_name} = {};",
                render_schema_type(
                    schema,
                    &SchemaTypeContext {
                        document,
                        suffix,
                        options,
                        ref_names: property_ref_names,
                    }
                )
            ));
        }
        let (type_annotation, schema_code) = circular_schema_declaration(code, &type_name);
        lines.push(format!(
            "export const {name}: {type_annotation} = {schema_code};"
        ));
    } else {
        let schema_code = if options.compile_schemas {
            format!("z.compile({code})")
        } else {
            code.to_string()
        };
        lines.push(format!("export const {name} = {schema_code};"));
        lines.push(format!("export type {type_name} = z.infer<typeof {name}>;"));
    }
    if code.starts_with("z.enum(") {
        lines.push(format!("export const {type_name} = {name}.enum;"));
    }
    lines.push(String::new());
    Some(lines)
}

/// Renders the JSDoc block for a schema and returns the schema object it was derived from.
fn render_schema_docs<'a>(
    document: &'a Value,
    name: &str,
    code: &str,
    schema_refs: &Map<String, Value>,
    generated_objects: &'a Map<String, Value>,
    enum_objects: &'a HashMap<String, Cow<'_, Value>>,
    property_ref_names: &PropertyRefNames,
    generate_js_doc: bool,
) -> (Vec<String>, Option<&'a Value>) {
    let schema_object = generated_objects
        .get(name)
        .or_else(|| {
            schema_refs
                .get(name)
                .and_then(Value::as_str)
                .and_then(|reference| resolve_document_ref(document, reference))
        })
        .or_else(|| enum_objects.get(code).map(Cow::as_ref));
    if !generate_js_doc {
        return (Vec::new(), schema_object);
    }
    let mut lines: Vec<String> = vec!["/** ".into(), format!(" * {name} ")];
    let schema_type = if code.starts_with("z.enum(") {
        "enum".to_string()
    } else {
        schema_object
            .and_then(|schema| js_doc_schema_type(schema.get("type")))
            .filter(|schema_type| !schema_type.is_empty())
            .unwrap_or_else(|| "object".into())
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
        collect_property_docs(document, schema, "", &mut properties, property_ref_names);
        for (property, (ty, description)) in properties {
            lines.push(format!(
                " * @property {{ {ty} }} {property} {} ",
                description.replace('\n', "\n *")
            ));
        }
    }
    escape_js_doc_lines(&mut lines[..]);
    lines.push(" */".into());
    (lines, schema_object)
}

// Lazy namespaces mirror src/generators/generate/generateModels.ts (renderLazyModels) byte for byte:
// memoized module-level factories, an exported object of getters and a merged `declare namespace`
// for the inferred types.
const ONCE_HELPER_LINES: [&str; 4] = [
    "const once = <T>(create: () => T) => {",
    "  let value: T | undefined;",
    "  return () => (value ??= create());",
    "};",
];

struct LazySchemaParts {
    factories: Vec<String>,
    members: Vec<String>,
    types: Vec<String>,
}

fn render_lazy_common_models(
    document: &Value,
    schemas: &Map<String, Value>,
    schema_refs: &Map<String, Value>,
    generated_objects: &Map<String, Value>,
    enum_objects: &HashMap<String, Cow<'_, Value>>,
    circular_schemas: &[String],
    suffix: &str,
    property_ref_names: &PropertyRefNames,
    namespace: &str,
    mut lines: Vec<String>,
    options: &GenerateOptions,
) -> String {
    let schema_names: HashSet<&str> = schemas.keys().map(String::as_str).collect();
    lines.extend(ONCE_HELPER_LINES.iter().map(|line| line.to_string()));
    lines.push(String::new());
    let parts = render_schema_items(schemas, |name, code| {
        render_lazy_schema_parts(
            document,
            name,
            code,
            schema_refs,
            generated_objects,
            enum_objects,
            circular_schemas,
            suffix,
            property_ref_names,
            &schema_names,
            namespace,
            options,
        )
    });
    let mut members = Vec::new();
    let mut types = Vec::new();
    for part in parts {
        lines.extend(part.factories);
        members.extend(part.members);
        types.extend(part.types);
    }
    lines.push(String::new());
    lines.push(format!("export const {namespace} = {{"));
    lines.extend(members);
    lines.push("};".into());
    lines.push(format!("export declare namespace {namespace} {{"));
    lines.extend(types);
    lines.push("}".into());
    format!("{}\n", lines.join("\n").trim_end())
}

fn render_lazy_schema_parts(
    document: &Value,
    name: &str,
    code: &Value,
    schema_refs: &Map<String, Value>,
    generated_objects: &Map<String, Value>,
    enum_objects: &HashMap<String, Cow<'_, Value>>,
    circular_schemas: &[String],
    suffix: &str,
    property_ref_names: &PropertyRefNames,
    schema_names: &HashSet<&str>,
    namespace: &str,
    options: &GenerateOptions,
) -> Option<LazySchemaParts> {
    let code = code.as_str()?;
    let (docs, schema_object) = render_schema_docs(
        document,
        name,
        code,
        schema_refs,
        generated_objects,
        enum_objects,
        property_ref_names,
        options.generate_js_doc,
    );
    let type_name = remove_suffix(name, suffix);
    let is_circular = circular_schemas.iter().any(|schema| schema == name);
    let (type_annotation, schema_code) = if is_circular {
        let (annotation, code) =
            circular_schema_declaration(code, &format!("{namespace}.{type_name}"));
        (format!(": () => {annotation}"), code)
    } else if options.compile_schemas {
        (String::new(), format!("z.compile({code})"))
    } else {
        (String::new(), code.to_string())
    };
    let mut factories = vec![format!(
        "const {name}{type_annotation} = once(() => {});",
        call_lazy_schema_references(&schema_code, schema_names)
    )];
    let mut members: Vec<String> = docs
        .iter()
        .flat_map(|line| line.split('\n'))
        .map(|line| format!("  {line}"))
        .collect();
    members.extend(render_lazy_member(name, &format!("{name}()")));
    let types = vec![match (is_circular, schema_object) {
        (true, Some(schema)) => format!(
            "  export type {type_name} = {};",
            render_schema_type(
                schema,
                &SchemaTypeContext {
                    document,
                    suffix,
                    options,
                    ref_names: property_ref_names,
                }
            )
        ),
        _ => format!("  export type {type_name} = z.infer<typeof {namespace}.{name}>;"),
    }];
    if code.starts_with("z.enum(") {
        factories.push(format!("const {type_name} = once(() => {name}().enum);"));
        members.extend(render_lazy_member(&type_name, &format!("{type_name}()")));
    }
    Some(LazySchemaParts {
        factories,
        members,
        types,
    })
}

fn render_lazy_member(name: &str, value: &str) -> [String; 3] {
    [
        format!("  get {name}() {{"),
        format!("    return {value};"),
        "  },".to_string(),
    ]
}

fn find_literal_end(chars: &[char], start: usize, quote: char) -> usize {
    let mut index = start + 1;
    while index < chars.len() {
        let ch = chars[index];
        if ch == '\\' {
            index += 2;
            continue;
        }
        index += 1;
        if ch == quote {
            break;
        }
    }
    index.min(chars.len())
}

fn find_regex_end(chars: &[char], start: usize) -> usize {
    let mut escaped = false;
    let mut character_class = false;
    for (index, ch) in chars.iter().enumerate().skip(start + 1) {
        if escaped {
            escaped = false;
            continue;
        }
        match ch {
            '\\' => escaped = true,
            '[' => character_class = true,
            ']' => character_class = false,
            '/' if !character_class => return index + 1,
            _ => {}
        }
    }
    chars.len()
}

struct CodeIdentifier<'a> {
    identifier: &'a str,
    /// The identifier follows a `.` (`CommonModels.PetSchema`, `.enum`).
    is_member_access: bool,
    /// The identifier is an object key (`{ PetSchema: ... }`).
    is_object_key: bool,
    /// The first character after the identifier.
    next_char: Option<char>,
}

/// Walks generated schema code and rewrites its identifiers through `replace`, which returns the
/// replacement text and whether to consume the character following the identifier. String,
/// template and regex literals are copied unchanged, so literal data (enum values, defaults,
/// patterns) is never mistaken for a symbol reference. Mirrors `rewriteCodeIdentifiers` in
/// src/generators/utils/generate/generate.lazy.utils.ts.
fn rewrite_code_identifiers<'c>(
    code: &'c str,
    mut replace: impl FnMut(&CodeIdentifier<'c>) -> (Cow<'c, str>, bool),
) -> String {
    // Every character this looks for is ASCII, and UTF-8 continuation bytes never equal an ASCII
    // byte, so walking bytes finds the same boundaries as walking characters.
    let bytes = code.as_bytes();
    let mut output = String::with_capacity(code.len());
    let mut index = 0;
    while index < bytes.len() {
        let byte = bytes[index];
        if matches!(byte, b'"' | b'\'' | b'`') {
            let end = literal_end(bytes, index, byte);
            output.push_str(&code[index..end]);
            index = end;
            continue;
        }
        if byte == b'/' && output.trim_end().ends_with(".regex(") {
            let end = regex_end(bytes, index);
            output.push_str(&code[index..end]);
            index = end;
            continue;
        }
        if is_identifier_byte(byte) {
            let mut end = index + 1;
            while end < bytes.len() && is_identifier_byte(bytes[end]) {
                end += 1;
            }
            let rest = &code[end..];
            let next_char = rest.chars().next();
            let (text, consume_next_char) = replace(&CodeIdentifier {
                identifier: &code[index..end],
                // A spread (`...PetSchema.shape`) is not a member access.
                is_member_access: output.ends_with('.') && !output.ends_with("..."),
                is_object_key: rest.chars().find(|next| !next.is_whitespace()) == Some(':'),
                next_char,
            });
            output.push_str(&text);
            index = if consume_next_char {
                end + next_char.map_or(1, char::len_utf8)
            } else {
                end
            };
            continue;
        }
        // Copy everything up to the next byte this loop handles.
        let mut end = index + 1;
        while end < bytes.len()
            && !matches!(bytes[end], b'"' | b'\'' | b'`' | b'/')
            && !is_identifier_byte(bytes[end])
        {
            end += 1;
        }
        output.push_str(&code[index..end]);
        index = end;
    }
    output
}

fn is_identifier_byte(byte: u8) -> bool {
    byte.is_ascii_alphanumeric() || byte == b'_' || byte == b'$'
}

/// `find_literal_end` on bytes: just past the closing quote, or the end of the code.
fn literal_end(bytes: &[u8], start: usize, quote: u8) -> usize {
    let mut index = start + 1;
    while index < bytes.len() {
        let byte = bytes[index];
        if byte == b'\\' {
            index += 2;
            continue;
        }
        index += 1;
        if byte == quote {
            break;
        }
    }
    index.min(bytes.len())
}

/// `find_regex_end` on bytes: just past the closing `/`, or the end of the code.
fn regex_end(bytes: &[u8], start: usize) -> usize {
    let mut escaped = false;
    let mut character_class = false;
    for (index, byte) in bytes.iter().enumerate().skip(start + 1) {
        if escaped {
            escaped = false;
            continue;
        }
        match byte {
            b'\\' => escaped = true,
            b'[' => character_class = true,
            b']' => character_class = false,
            b'/' if !character_class => return index + 1,
            _ => {}
        }
    }
    bytes.len()
}

/// Rewrites bare references to sibling schemas (`PetSchema`) into factory calls (`PetSchema()`).
/// Member accesses (`CommonModels.PetSchema`, `.enum`), object keys and literal values are left alone.
fn call_lazy_schema_references(code: &str, schema_names: &HashSet<&str>) -> String {
    rewrite_code_identifiers(code, |token| {
        let call = schema_names.contains(token.identifier)
            && !token.is_member_access
            && !token.is_object_key;
        (
            if call {
                Cow::Owned(format!("{}()", token.identifier))
            } else {
                Cow::Borrowed(token.identifier)
            },
            false,
        )
    })
}

fn is_model_namespace(identifier: &str, namespace_suffix: &str) -> bool {
    identifier.len() > namespace_suffix.len()
        && identifier.ends_with(namespace_suffix)
        && identifier.starts_with(|ch: char| ch.is_ascii_uppercase())
}

/// Removes model namespace qualifiers (`CommonModels.PetSchema` -> `PetSchema`) from symbol
/// references, leaving literal values untouched. Used when every referenced model is emitted into
/// the module itself (`modelsInModules`).
fn strip_model_namespace_references(code: &str, namespace_suffix: &str) -> String {
    rewrite_code_identifiers(code, |token| {
        if !token.is_member_access
            && !token.is_object_key
            && token.next_char == Some('.')
            && is_model_namespace(token.identifier, namespace_suffix)
        {
            (Cow::Borrowed(""), true)
        } else {
            (Cow::Borrowed(token.identifier), false)
        }
    })
}

/// Schema names a piece of generated code refers to, bare (`PetSchema`) or namespace qualified
/// (`CommonModels.PetSchema`), in order of first appearance. Literals and object keys are ignored.
fn code_schema_references(code: &str, is_schema_name: impl Fn(&str) -> bool) -> Vec<String> {
    let mut references: Vec<String> = Vec::new();
    rewrite_code_identifiers(code, |token| {
        if !token.is_object_key
            && is_schema_name(token.identifier)
            && !references
                .iter()
                .any(|existing| existing == token.identifier)
        {
            references.push(token.identifier.to_string());
        }
        (Cow::Borrowed(token.identifier), false)
    });
    references
}

const OBJECT_PRESERVING_METHODS: [&str; 7] = [
    "partial",
    "required",
    "catchall",
    "strict",
    "strip",
    "passthrough",
    "extend",
];

/// Whether `chars`, ignoring trailing whitespace, ends with `.regex(`.
fn chars_end_with_regex_call(chars: &[char]) -> bool {
    let end = chars
        .iter()
        .rposition(|ch| !ch.is_whitespace())
        .map_or(0, |position| position + 1);
    chars[..end].ends_with(&['.', 'r', 'e', 'g', 'e', 'x', '('])
}

/// Index just past the `)` that closes the call opened at `open_index`.
fn find_call_end(chars: &[char], open_index: usize) -> Option<usize> {
    let mut depth = 0usize;
    let mut index = open_index;
    while index < chars.len() {
        let ch = chars[index];
        if ch == '"' || ch == '\'' || ch == '`' {
            index = find_literal_end(chars, index, ch);
            continue;
        }
        if ch == '/' && chars_end_with_regex_call(&chars[..index]) {
            index = find_regex_end(chars, index);
            continue;
        }
        match ch {
            '(' | '[' | '{' => depth += 1,
            ')' | ']' | '}' => {
                depth = depth.saturating_sub(1);
                if depth == 0 {
                    return Some(index + 1);
                }
            }
            _ => {}
        }
        index += 1;
    }
    None
}

/// Whether generated schema code evaluates to a `z.ZodObject`: a `z.object(...)` call followed
/// only by methods that return an object schema again (`.partial()`, `.catchall(...)`, ...).
fn is_zod_object_code(code: &str) -> bool {
    const PREFIX: &str = "z.object(";
    if !code.starts_with(PREFIX) {
        return false;
    }
    let chars: Vec<char> = code.chars().collect();
    let mut index = find_call_end(&chars, PREFIX.len() - 1);
    while let Some(position) = index.filter(|position| *position < chars.len()) {
        if chars[position] != '.' {
            return false;
        }
        let name_end = chars[position + 1..]
            .iter()
            .position(|ch| !ch.is_ascii_alphabetic())
            .map_or(chars.len(), |offset| position + 1 + offset);
        let method: String = chars[position + 1..name_end].iter().collect();
        if method.is_empty()
            || chars.get(name_end) != Some(&'(')
            || !OBJECT_PRESERVING_METHODS.contains(&method.as_str())
        {
            return false;
        }
        index = find_call_end(&chars, name_end);
    }
    index == Some(chars.len())
}

/// Circular schemas need an explicit type annotation and must not read their own binding while it
/// is being initialized. Object schemas already defer recursive members with `z.lazy`, so they
/// keep their `ZodObject` type (`ZodReadonly<ZodObject>` with `allReadonly`, so that allOf members
/// can unwrap it); any other schema (unions, arrays, intersections, ...) is wrapped in `z.lazy` as a
/// whole and typed as a plain `ZodType`. Returns `(type annotation, code)`.
fn circular_schema_declaration(code: &str, type_name: &str) -> (String, String) {
    if is_zod_object_code(code) {
        (
            format!("z.ZodObject<z.ZodRawShape> & z.ZodType<{type_name}>"),
            code.to_string(),
        )
    } else if code
        .strip_suffix(".readonly()")
        .is_some_and(is_zod_object_code)
    {
        (
            format!("z.ZodReadonly<z.ZodObject<z.ZodRawShape>> & z.ZodType<{type_name}>"),
            code.to_string(),
        )
    } else {
        (
            format!("z.ZodType<{type_name}>"),
            format!("z.lazy(() => {code})"),
        )
    }
}

struct SchemaTypeContext<'a> {
    document: &'a Value,
    suffix: &'a str,
    options: &'a GenerateOptions,
    ref_names: &'a PropertyRefNames<'a>,
}

/// Explicit types of circular schemas (which cannot be inferred) describe the output type of the
/// generated zod schema, so they follow the zod generation rules: a schema's own `nullable`,
/// defaults and optionality are applied by the chain where it is used (object properties, array
/// items, additional properties), never on the schema itself, matching `z.infer` of non-circular
/// schemas. Mirrors `renderSchemaType` in src/generators/generate/generateModels.ts.
fn render_schema_type(schema: &Value, context: &SchemaTypeContext) -> String {
    let options = context.options;
    if let Some(reference) = schema.get("$ref").and_then(Value::as_str) {
        return render_reference_type(reference, context);
    }

    for (key, separator) in [("allOf", " & "), ("oneOf", " | "), ("anyOf", " | ")] {
        if let Some(parts) = schema
            .get(key)
            .and_then(Value::as_array)
            .filter(|parts| !parts.is_empty())
        {
            let rendered = parts
                .iter()
                .map(|part| render_schema_type(part, context))
                .collect::<Vec<_>>();
            let multiple = rendered.len() > 1;
            return rendered
                .into_iter()
                .map(|part| {
                    if multiple && part.contains(['|', '&']) {
                        format!("({part})")
                    } else {
                        part
                    }
                })
                .collect::<Vec<_>>()
                .join(separator);
        }
    }

    if let Some(values) = schema
        .get("enum")
        .and_then(Value::as_array)
        .filter(|values| !values.is_empty())
    {
        return values
            .iter()
            .map(Value::to_string)
            .collect::<Vec<_>>()
            .join(" | ");
    }

    // Type arrays (OpenAPI 3.1) are a union of their types; `null` makes the schema nullable.
    if let Some(types) = schema.get("type").and_then(Value::as_array) {
        let mut parts = types
            .iter()
            .filter(|schema_type| schema_type.as_str() != Some("null"))
            .map(|schema_type| {
                let mut variant = schema.as_object().cloned().unwrap_or_default();
                variant.insert("type".into(), schema_type.clone());
                render_schema_type(&Value::Object(variant), context)
            })
            .collect::<Vec<_>>();
        if parts.len() < types.len() {
            parts.push("null".into());
        }
        let multiple = parts.len() > 1;
        return parts
            .into_iter()
            .map(|part| {
                if multiple && part.contains(['|', '&']) {
                    format!("({part})")
                } else {
                    part
                }
            })
            .collect::<Vec<_>>()
            .join(" | ");
    }

    if schema.get("type").and_then(Value::as_str) == Some("array") {
        if let Some((items, rest)) = schema.as_object().and_then(crate::zod::tuple_parts) {
            let required = schema.get("minItems").and_then(Value::as_u64).unwrap_or(0) as usize;
            // Tuple members are chained with the referenced schema's nullability (see zod.rs).
            let member_type = |member: &Value| {
                let resolved = member
                    .get("$ref")
                    .and_then(Value::as_str)
                    .and_then(|reference| resolve_document_ref(context.document, reference))
                    .unwrap_or(member);
                add_nullable_type(resolved, render_schema_type(member, context))
            };
            let item_types = items.iter().map(member_type).collect::<Vec<_>>();
            let rest_type = match rest {
                Some(Value::Bool(false)) => None,
                Some(rest @ Value::Object(_)) => Some(member_type(rest)),
                _ => Some("unknown".to_string()),
            };
            // zod's readonly output keeps the tuple shape only when the first member is required;
            // otherwise it widens to a readonly array of the member types.
            if options.all_readonly && !(!item_types.is_empty() && required > 0) {
                let mut element_types = item_types
                    .iter()
                    .enumerate()
                    .map(|(index, item_type)| {
                        if index < required {
                            item_type.clone()
                        } else {
                            format!("{item_type} | undefined")
                        }
                    })
                    .collect::<Vec<_>>();
                element_types.extend(rest_type);
                return if element_types.is_empty() {
                    "ReadonlyArray<never>".into()
                } else {
                    format!("ReadonlyArray<{}>", element_types.join(" | "))
                };
            }
            // Members after `minItems` are optional, matching the generated `.optional()` tuple members.
            let mut members = item_types
                .into_iter()
                .enumerate()
                .map(|(index, item_type)| {
                    if index < required {
                        item_type
                    } else if item_type.contains('|') || item_type.contains('&') {
                        format!("({item_type})?")
                    } else {
                        format!("{item_type}?")
                    }
                })
                .collect::<Vec<_>>();
            if let Some(rest_type) = rest_type {
                if rest_type.contains('|') || rest_type.contains('&') {
                    members.push(format!("...({rest_type})[]"));
                } else {
                    members.push(format!("...{rest_type}[]"));
                }
            }
            let readonly = if options.all_readonly {
                "readonly "
            } else {
                ""
            };
            return format!("{readonly}[{}]", members.join(", "));
        }
        let item_type = schema
            .get("items")
            .map(|items| add_nullable_type(items, render_schema_type(items, context)))
            .unwrap_or_else(|| "unknown".into());
        return if options.all_readonly {
            format!("ReadonlyArray<{item_type}>")
        } else {
            format!("Array<{item_type}>")
        };
    }

    // Like zod.rs, an explicit scalar type wins over object keywords: when a type array such as
    // `["object", "string", "null"]` is expanded, the `string` member keeps `properties`.
    if let Some(scalar_type) = render_scalar_schema_type(schema) {
        return scalar_type;
    }

    if schema.get("type").and_then(Value::as_str) == Some("object")
        || schema.get("properties").is_some()
        || schema.get("additionalProperties").is_some()
    {
        let required = schema
            .get("required")
            .and_then(Value::as_array)
            .filter(|required| !required.is_empty());
        let is_partial = !options.with_implicit_required_props
            && schema.get("properties").is_some()
            && required.is_none();
        let properties = schema
            .get("properties")
            .and_then(Value::as_object)
            .into_iter()
            .flatten()
            .map(|(name, property)| {
                let is_required = if is_partial {
                    true
                } else if let Some(required) = required {
                    required.iter().any(|value| value.as_str() == Some(name))
                } else {
                    options.with_implicit_required_props
                };
                let resolved = property
                    .get("$ref")
                    .and_then(Value::as_str)
                    .and_then(|reference| resolve_document_ref(context.document, reference))
                    .unwrap_or(property);
                let has_default = options.with_default_values && resolved.get("default").is_some();
                let is_nullable = resolved.get("nullable").and_then(Value::as_bool) == Some(true)
                    || (options.replace_optional_with_nullish && (is_partial || !is_required));
                let optional = if is_partial || (!is_required && !has_default) {
                    "?"
                } else {
                    ""
                };
                let mut property_type = render_schema_type(property, context);
                if is_nullable && property_type != "null" {
                    property_type.push_str(" | null");
                }
                let property_name = if name
                    .chars()
                    .next()
                    .is_some_and(|first| first.is_ascii_alphabetic())
                    && name
                        .chars()
                        .all(|character| character.is_ascii_alphanumeric() || character == '_')
                {
                    name.clone()
                } else {
                    Value::String(name.clone()).to_string()
                };
                format!("{property_name}{optional}: {property_type}")
            })
            .collect::<Vec<_>>();
        // Like JavaScript's truthiness check, `false` and `null` add no index signature.
        let index_type = schema
            .get("additionalProperties")
            .filter(|additional| !matches!(additional, Value::Bool(false) | Value::Null))
            .map(|additional| {
                let value_type = if additional.is_object() {
                    add_nullable_type(additional, render_schema_type(additional, context))
                } else {
                    "unknown".into()
                };
                format!("{{ [key: string]: {value_type} }}")
            });
        // Like zod's catchall output, properties and the index signature are intersected, so
        // property types need not be assignable to the additional properties type. Each part is
        // made readonly on its own: `Readonly<A & B>` of a recursive type would circularly
        // reference itself.
        let readonly = |object_type: String| {
            if options.all_readonly {
                format!("Readonly<{object_type}>")
            } else {
                object_type
            }
        };
        return match index_type {
            Some(index_type) if !properties.is_empty() => format!(
                "{} & {}",
                readonly(format!("{{ {} }}", properties.join("; "))),
                readonly(index_type)
            ),
            Some(index_type) => readonly(index_type),
            None => readonly(format!("{{ {} }}", properties.join("; "))),
        };
    }

    "unknown".into()
}

fn render_scalar_schema_type(schema: &Value) -> Option<String> {
    Some(match schema.get("type").and_then(Value::as_str)? {
        "string" if schema.get("format").and_then(Value::as_str) == Some("binary") => "Blob".into(),
        "string" => "string".into(),
        "number" | "integer" => "number".into(),
        "boolean" => "boolean".into(),
        "null" => "null".into(),
        _ => return None,
    })
}

/// A referenced schema's type as seen from the models file being rendered. The schema code
/// references the same model, so its namespace (or, without namespaces, its schema) is imported.
fn render_reference_type(reference: &str, context: &SchemaTypeContext) -> String {
    let name = reference.rsplit('/').next().unwrap_or("unknown");
    let schema_name = crate::zod::schema_name(name, context.suffix);
    let type_name = remove_suffix(&schema_name, context.suffix);
    if context.options.models_in_modules {
        return type_name;
    }
    let ref_names = context.ref_names;
    match ref_names
        .refs
        .get(reference)
        .and_then(|(_, owner)| owner.as_deref())
    {
        Some(owner) if owner != ref_names.namespace_tag => {
            if ref_names.ts_namespaces {
                format!(
                    "{}{}.{type_name}",
                    capitalize(owner),
                    ref_names.namespace_suffix
                )
            } else {
                format!("z.infer<typeof {schema_name}>")
            }
        }
        _ => type_name,
    }
}

/// Nullability added by the zod chain of an (unresolved) array item or additional properties schema.
fn add_nullable_type(schema: &Value, rendered: String) -> String {
    if schema.get("nullable").and_then(Value::as_bool) == Some(true) && rendered != "null" {
        format!("{rendered} | null")
    } else {
        rendered
    }
}

/// Schema reference -> (type name, owner tag); independent of the tag being rendered.
type PropertyRefs = HashMap<String, (String, Option<String>)>;

fn property_refs(
    schema_refs: &Map<String, Value>,
    schema_owners: &Map<String, Value>,
    options: &GenerateOptions,
) -> PropertyRefs {
    schema_refs
        .iter()
        .filter_map(|(name, reference)| {
            let reference = reference.as_str()?;
            let owner = if options.models_in_common || !options.split_by_tags {
                Some(options.default_tag.as_str())
            } else {
                schema_owners.get(name).and_then(Value::as_str)
            };
            Some((
                reference.to_string(),
                (
                    remove_suffix(name, &options.schema_suffix),
                    owner.map(str::to_string),
                ),
            ))
        })
        .collect()
}

/// Resolves property reference type names as seen from `namespace_tag`'s models file.
struct PropertyRefNames<'a> {
    refs: &'a PropertyRefs,
    namespace_tag: &'a str,
    namespace_suffix: &'a str,
    ts_namespaces: bool,
}

impl PropertyRefNames<'_> {
    fn get(&self, reference: &str) -> Option<String> {
        let (type_name, owner) = self.refs.get(reference)?;
        Some(match owner {
            Some(owner) if self.ts_namespaces && owner != self.namespace_tag => {
                format!("{}{}.{type_name}", capitalize(owner), self.namespace_suffix)
            }
            _ => type_name.clone(),
        })
    }
}

/// Keeps documentation text from closing the surrounding block comment early: `*\/` instead of `*/`.
fn escape_js_doc(text: &str) -> String {
    text.replace("*/", "*\\/")
}

fn escape_js_doc_lines(lines: &mut [String]) {
    for line in lines {
        if line.contains("*/") {
            *line = escape_js_doc(line);
        }
    }
}

fn document_enum_objects(document: &Value) -> HashMap<String, Cow<'_, Value>> {
    let mut enum_objects = HashMap::default();
    if let Some(component_schemas) = document.pointer("/components/schemas") {
        collect_enum_objects(component_schemas, &mut enum_objects);
    }
    enum_objects
}

fn collect_enum_objects<'a>(value: &'a Value, enums: &mut HashMap<String, Cow<'a, Value>>) {
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
                match enums.entry(code) {
                    std::collections::hash_map::Entry::Vacant(entry) => {
                        entry.insert(Cow::Borrowed(value));
                    }
                    std::collections::hash_map::Entry::Occupied(mut entry) => {
                        if let Some(target) = entry.get_mut().to_mut().as_object_mut() {
                            for (key, value) in object {
                                target.insert(key.clone(), value.clone());
                            }
                        }
                    }
                }
            }
            object
                .iter()
                .filter(|(key, _)| !crate::zod::is_stray_array_keyword(object, key))
                .for_each(|(_, value)| collect_enum_objects(value, enums));
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
    property_ref_names: &PropertyRefNames,
) {
    // Like `iterateSchema`, every member of a type array is traversed.
    if crate::zod::has_schema_type(schema, "array") {
        if let Some(items) = schema
            .get("items")
            .filter(|items| items.get("$ref").is_none())
        {
            let key = if prefix.is_empty() {
                "[0]".into()
            } else {
                format!("{prefix}.[0]")
            };
            collect_property_docs(document, items, &key, properties, property_ref_names);
        }
    }
    if let Some(all_of) = schema.get("allOf").and_then(Value::as_array) {
        for member in all_of.iter().filter(|member| member.get("$ref").is_some()) {
            if let Some(reference) = member.get("$ref").and_then(Value::as_str) {
                if let Some(resolved) = resolve_document_ref(document, reference) {
                    collect_property_docs(
                        document,
                        resolved,
                        prefix,
                        properties,
                        property_ref_names,
                    );
                }
            }
        }
        for member in all_of.iter().filter(|member| member.get("$ref").is_none()) {
            collect_property_docs(document, member, prefix, properties, property_ref_names);
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
            let ty = property_doc_type(document, property_schema, property_ref_names);
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
                                property_ref_names,
                            );
                        }
                    }
                } else {
                    collect_property_docs(
                        document,
                        property_schema,
                        &key,
                        properties,
                        property_ref_names,
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
                                property_ref_names,
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
                property_doc_type(document, additional, property_ref_names),
                schema_description(additional),
            ),
        );
        collect_property_docs(document, additional, &key, properties, property_ref_names);
    }
}

/// `getJsDocSchemaType`: the JSDoc type of an OpenAPI `type`; OpenAPI 3.1 type arrays read as a
/// union, e.g. `string | null`.
fn js_doc_schema_type(schema_type: Option<&Value>) -> Option<String> {
    match schema_type? {
        Value::String(schema_type) => Some(schema_type.clone()),
        Value::Array(types) if !types.is_empty() => Some(
            types
                .iter()
                // `Array.prototype.join` renders `null` as an empty string.
                .map(|value| match value {
                    Value::Null => String::new(),
                    value => display_js_value(value),
                })
                .collect::<Vec<_>>()
                .join(" | "),
        ),
        _ => None,
    }
}

/// `getJsDocArrayType`
fn js_doc_array_type(item_type: &str) -> String {
    if item_type.contains(" | ") {
        format!("({item_type})[]")
    } else {
        format!("{item_type}[]")
    }
}

fn property_doc_type(
    document: &Value,
    schema: &Value,
    property_ref_names: &PropertyRefNames,
) -> String {
    if let Some(reference) = schema.get("$ref").and_then(Value::as_str) {
        return property_ref_type(reference, property_ref_names);
    }
    if schema.get("type").and_then(Value::as_str) == Some("array") {
        return match schema.get("items") {
            Some(items) => match items.get("$ref").and_then(Value::as_str) {
                Some(reference) => {
                    format!("{}[]", property_ref_type(reference, property_ref_names))
                }
                None => js_doc_array_type(
                    &js_doc_schema_type(items.get("type")).unwrap_or_else(|| "unknown".into()),
                ),
            },
            None => "unknown[]".into(),
        };
    }
    for keyword in ["allOf", "anyOf", "oneOf"] {
        if let Some(first) = schema
            .get(keyword)
            .and_then(Value::as_array)
            .and_then(|values| values.first())
        {
            return property_doc_type(document, first, property_ref_names);
        }
    }
    js_doc_schema_type(schema.get("type")).unwrap_or_else(|| "unknown".into())
}

fn property_ref_type(reference: &str, property_ref_names: &PropertyRefNames) -> String {
    if let Some(name) = property_ref_names.get(reference) {
        return name;
    }
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
        if !candidate.is_empty() && !result.contains(&candidate) {
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
    if !is_named_schema(name) {
        return;
    }
    // A referenced schema can carry its use-site validation chain (`ExampleSchema.min(3)`);
    // only the schema identifier names a model.
    let name = base_schema_name(name);
    if !seen.insert(name.to_string()) {
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
    if options.ts_namespaces && options.lazy_schemas {
        let mut lines = vec![
            format!("import {{ {common_namespace} }} from \"{common_path}\";"),
            String::new(),
            format!("export const {namespace} = {{"),
        ];
        for name in names.iter().chain(enum_names.iter()) {
            lines.extend(render_lazy_member(
                name,
                &format!("{common_namespace}.{name}"),
            ));
        }
        lines.push("};".into());
        lines.push(format!("export declare namespace {namespace} {{"));
        lines.extend(
            inferred
                .iter()
                .map(|name| format!("  export type {name} = {common_namespace}.{name};")),
        );
        lines.push("}".into());
        lines.push(String::new());
        return lines.join("\n");
    }
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

pub(crate) fn decapitalize(value: &str) -> String {
    let mut chars = value.chars();
    chars
        .next()
        .map(|first| first.to_lowercase().chain(chars).collect())
        .unwrap_or_default()
}

fn remove_suffix(value: &str, suffix: &str) -> String {
    let value = value.split('.').next().unwrap_or(value);
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
    let model_owners = ModelOwners::new(schema_owners, options);
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
                &model_owners,
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
    model_owners: &ModelOwners,
    options: &GenerateOptions,
) -> String {
    let mut lines = vec![format!(
        "import {{ AppRestClient }} from \"{}\";",
        rest_client_import_path(options)
    )];
    let has_get = endpoints
        .iter()
        .any(|endpoint| endpoint.get("method").and_then(Value::as_str) == Some("get"));
    if options.axios_request_config || has_get {
        lines.push(if uses_native_rest_client(options) {
            "import { type TransportRequestConfig } from \"@povio/openapi-codegen-cli/rest\";"
                .into()
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
                    let schema = base_schema_name(schema);
                    // Like JavaScript, shared models are imported through the module's own proxy.
                    let owner = if options.models_in_modules || options.models_in_common {
                        tag
                    } else {
                        schema_owners
                            .get(schema)
                            .and_then(Value::as_str)
                            .unwrap_or(tag)
                    };
                    let bindings = imports.entry(owner.to_string()).or_default();
                    if !bindings.iter().any(|binding| binding == schema) {
                        bindings.push(schema.to_string());
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
                    let owner = if options.models_in_modules || options.models_in_common {
                        tag
                    } else {
                        schema_owners
                            .get(schema)
                            .and_then(Value::as_str)
                            .unwrap_or(tag)
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
    let mut schema_order = used_schemas.clone();
    schema_order.extend(endpoints.iter().flat_map(|endpoint| {
        endpoint
            .get("parameters")
            .and_then(Value::as_array)
            .into_iter()
            .flatten()
            .filter_map(|parameter| parameter.get("zodSchema").and_then(Value::as_str))
    }));
    resolve_model_namespace_owners(
        format!("{}\n", lines.join("\n").trim_end()),
        tag,
        model_owners,
        &schema_order,
        options,
    )
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
            let required = is_parameter_required(parameter);
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

/// `isEndpointParameterRequired`: a request body, query, header or cookie parameter is optional
/// unless `required: true`; path parameters are always required.
fn is_parameter_required(parameter: &Value) -> bool {
    if let Some(body) = parameter.get("bodyObject") {
        return body
            .get("required")
            .and_then(Value::as_bool)
            .unwrap_or(false);
    }
    let Some(object) = parameter.get("parameterObject") else {
        return true;
    };
    object.get("in").and_then(Value::as_str) == Some("path")
        || object
            .get("required")
            .and_then(Value::as_bool)
            .unwrap_or(false)
}

/// Render-only key holding the OpenAPI type of a parameter's `$ref` schema target.
const RESOLVED_SCHEMA_TYPE: &str = "x-resolvedSchemaType";

/// Temporarily annotate the owned endpoint data for rendering. Record only the
/// changed fields, avoiding a deep copy of every endpoint for a handful of refs.
pub fn resolve_parameter_types(
    endpoints: &mut [Value],
    document: &Value,
) -> Vec<(usize, usize, Option<Value>)> {
    let mut previous = Vec::new();
    for (endpoint_index, endpoint) in endpoints.iter_mut().enumerate() {
        let Some(parameters) = endpoint.get_mut("parameters").and_then(Value::as_array_mut) else {
            continue;
        };
        for (parameter_index, parameter) in parameters.iter_mut().enumerate() {
            let schema_type = parameter
                .pointer("/parameterObject/schema/$ref")
                .and_then(Value::as_str)
                .and_then(|reference| resolve_document_ref(document, reference))
                .and_then(|schema| schema.get("type"))
                .cloned();
            if let (Some(schema_type), Some(object)) = (schema_type, parameter.as_object_mut()) {
                let old = object.insert(RESOLVED_SCHEMA_TYPE.into(), schema_type);
                previous.push((endpoint_index, parameter_index, old));
            }
        }
    }
    previous
}

pub fn restore_parameter_types(
    endpoints: &mut [Value],
    previous: Vec<(usize, usize, Option<Value>)>,
) {
    for (endpoint_index, parameter_index, old) in previous {
        let object = endpoints[endpoint_index]["parameters"][parameter_index]
            .as_object_mut()
            .unwrap();
        match old {
            Some(value) => {
                object.insert(RESOLVED_SCHEMA_TYPE.into(), value);
            }
            None => {
                object.shift_remove(RESOLVED_SCHEMA_TYPE);
            }
        }
    }
}

/// `getInlineParameterTsType`: the TS type of an inline (unnamed) parameter schema by its OpenAPI
/// `type`; a type array (`["string", "null"]`) is the union of its members' types.
fn primitive_parameter_type(parameter: &Value) -> String {
    fn single_type(schema_type: Option<&str>) -> &'static str {
        match schema_type {
            Some("number" | "integer") => "number",
            Some("boolean") => "boolean",
            Some("array") => "unknown[]",
            Some("object") => "Record<string, unknown>",
            Some("null") => "null",
            _ => "string",
        }
    }
    match parameter
        .get(RESOLVED_SCHEMA_TYPE)
        .or_else(|| parameter.pointer("/parameterObject/schema/type"))
    {
        Some(Value::Array(types)) if !types.is_empty() => {
            let mut result: Vec<&str> = Vec::new();
            for schema_type in types {
                let ts_type = single_type(schema_type.as_str());
                if !result.contains(&ts_type) {
                    result.push(ts_type);
                }
            }
            result.join(" | ")
        }
        schema_type => single_type(schema_type.and_then(Value::as_str)).into(),
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

/// The schema identifier of a named schema expression, without a use-site validation chain
/// (`ExampleSchema.refine(...)` -> `ExampleSchema`), like JavaScript's `split(".")[0]`.
pub(crate) fn base_schema_name(schema: &str) -> &str {
    schema.split('.').next().unwrap_or(schema)
}

fn endpoint_name(value: &str) -> String {
    decapitalize(&snake_to_camel(value))
}

fn snake_to_camel(value: &str) -> String {
    // JavaScript snakeToCamel replaces non-overlapping /(_\w)/g matches.
    let mut output = String::new();
    let mut characters = value.chars().peekable();
    while let Some(character) = characters.next() {
        if character == '_'
            && characters
                .peek()
                .is_some_and(|next| next.is_ascii_alphanumeric() || *next == '_')
        {
            output.push(characters.next().unwrap().to_ascii_uppercase());
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
    document: &Value,
    schema_owners: &Map<String, Value>,
    options: &GenerateOptions,
) -> Map<String, Value> {
    let mut rendered = Map::new();
    if !options.split_by_tags || options.inline_endpoints || !options.workspace_context.is_empty() {
        return rendered;
    }
    let annotated = with_cursor_pagination(endpoints, document, options);
    let endpoints: Vec<&Value> = match &annotated {
        Some(annotated) => annotated.iter().map(|endpoint| endpoint.as_ref()).collect(),
        None => endpoints.iter().collect(),
    };
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
    let model_owners = ModelOwners::new(schema_owners, options);
    let modules = tags
        .par_iter()
        .map(|(tag, tag_endpoints)| {
            (
                tag.clone(),
                Value::String(render_query_module(
                    tag,
                    tag_endpoints,
                    schema_owners,
                    &model_owners,
                    options,
                )),
            )
        })
        .collect::<Vec<_>>();
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
    if let Some(content) = render_domain_errors(endpoints, options) {
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
    // Each tag's mutation hooks, for the `QueryModuleMutations` interface.
    let mut tags: IndexMap<&str, Vec<String>> = IndexMap::default();
    for endpoint in endpoints {
        let tag = endpoint
            .get("tags")
            .and_then(Value::as_array)
            .and_then(|tags| tags.first())
            .and_then(Value::as_str)
            .unwrap_or(&options.default_tag);
        let hooks = tags.entry(tag).or_default();
        if is_mutation_endpoint(endpoint) {
            let (_, cap) = query_names(endpoint);
            if endpoint.get("method").and_then(Value::as_str) == Some("get") {
                hooks.push(format!("use{cap}Mutation"));
            } else {
                hooks.push(format!("use{cap}"));
            }
        }
    }
    let mutation_tags = tags
        .iter()
        .filter(|(_, hooks)| !hooks.is_empty())
        .collect::<Vec<_>>();
    let mut lines = Vec::new();
    let query_types = if mutation_tags.is_empty() {
        "InvalidationMap"
    } else {
        "InvalidationMap, MutationEffectsOf"
    };
    lines.push(format!(
        "import type {{ {query_types} }} from \"{}\";",
        query_types_import_path(options)
    ));
    let queries_suffix = output_suffix(options, "queries", "queries");
    for (tag, _) in &mutation_tags {
        let namespace = format!("{}{suffix}", capitalize(tag));
        let file = decapitalize(tag);
        let from = format!(
            "{}{file}/{file}.{queries_suffix}",
            root_import_root(options)
        );
        lines.push(if options.ts_namespaces {
            format!("import type {{ {namespace} }} from \"{from}\";")
        } else {
            format!("import type * as {namespace} from \"{from}\";")
        });
    }
    lines.push(String::new());
    lines.push("export const enum QueryModule {".to_string());
    for tag in tags.keys() {
        lines.push(format!("   {tag} = \"{}{suffix}\",", capitalize(tag)));
    }
    lines.push("}".into());
    lines.push(String::new());
    lines.push("export interface QueryModuleMutations {".into());
    for (tag, hooks) in &mutation_tags {
        let namespace = format!("{}{suffix}", capitalize(tag));
        let hooks = hooks
            .iter()
            .map(|hook| format!("typeof {namespace}.{hook}"))
            .collect::<Vec<_>>()
            .join(" | ");
        lines.push(format!(
            "   [QueryModule.{tag}]: MutationEffectsOf<{hooks}>;"
        ));
    }
    lines.push("}".into());
    lines.push(String::new());
    // Per-client rather than a global registration, so several generated clients can share one program.
    lines.push(
        "export type QueryModuleInvalidationMap = InvalidationMap<QueryModule, QueryModuleMutations>;"
            .into(),
    );
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
        // Without ACL rules the TypeScript renderer still emits an untyped ability.
        return Some(
            "import type { Ability, AbilityTuple, Subject } from \"@casl/ability\";\n\n\
             export type AppAbilities = AbilityTuple<string, Subject>;\n\n\
             export type AppAbility = Ability<AppAbilities>;"
                .into(),
        );
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
        format!("import type {{ Ability, AbilityTuple{forced} }} from \"@casl/ability\";"),
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
    lines.push("export type AppAbility = Ability<AppAbilities>;".into());
    Some(lines.join("\n"))
}

fn render_domain_errors(endpoints: &[Value], options: &GenerateOptions) -> Option<String> {
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
                    .filter(|_| options.generate_js_doc)
                    .map(|description| format!("  /** {} */\n  ", escape_js_doc(&description)))
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
                "import type {{ {models_namespace} }} from \"./{}.{}\";",
                decapitalize(tag),
                output_suffix(options, "models", "models")
            ));
        } else {
            let mut imports: IndexMap<String, Vec<String>> = IndexMap::default();
            for condition in endpoints
                .iter()
                .flat_map(|endpoint| acl_conditions(endpoint))
            {
                if let Some(schema) = condition.get("zodSchemaName").and_then(Value::as_str) {
                    let name = remove_suffix(schema, &options.schema_suffix);
                    let owner = if options.models_in_modules || options.models_in_common {
                        tag
                    } else {
                        schema_owners
                            .get(schema)
                            .and_then(Value::as_str)
                            .unwrap_or(tag)
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
                    format!(
                        "./{owner_tag}.{}",
                        output_suffix(options, "models", "models")
                    )
                } else {
                    format!(
                        "{}{owner_tag}/{owner_tag}.{}",
                        import_root(options),
                        output_suffix(options, "models", "models")
                    )
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
    if options.generate_js_doc {
        let doc_start = lines.len();
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
        escape_js_doc_lines(&mut lines[doc_start..]);
        lines.push(" */".into());
    }
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
    model_owners: &ModelOwners,
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
    if uses_native_rest_client(options) && has_media_upload {
        lines.push(format!(
            "import {{ AppRestClient }} from \"{}\";",
            rest_client_import_path(options)
        ));
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
                "import {{ {acl_namespace} }} from \"./{}.{}\";",
                decapitalize(tag),
                output_suffix(options, "acl", "acl")
            ));
        } else {
            let abilities = acl_endpoints
                .iter()
                .map(|endpoint| format!("canUse{}", query_names(endpoint).1))
                .collect::<Vec<_>>();
            lines.push(format!(
                "import {{ {} }} from \"./{}.{}\";",
                abilities.join(", "),
                decapitalize(tag),
                output_suffix(options, "acl", "acl")
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
    if options.infinite_queries
        && infinite
            .iter()
            .any(|endpoint| !is_cursor_paginated(endpoint))
    {
        query_types.push("type AppInfiniteQueryOptions".into());
    }
    if options.infinite_queries
        && infinite
            .iter()
            .any(|endpoint| is_cursor_paginated(endpoint))
    {
        query_types.push("type AppCursorInfiniteQueryOptions".into());
    }
    if !mutations.is_empty() {
        query_types.push("type AppMutationOptions".into());
    }
    lines.push(format!(
        "import {{ {} }} from \"{}\";",
        query_types.join(", "),
        query_types_import_path(options)
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
                "import {{ {models_namespace} }} from \"./{}.{}\";",
                decapitalize(tag),
                output_suffix(options, "models", "models")
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
                    let owner = if options.models_in_modules || options.models_in_common {
                        tag
                    } else {
                        schema_owners
                            .get(schema)
                            .and_then(Value::as_str)
                            .unwrap_or(tag)
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
                    format!(
                        "./{owner_tag}.{}",
                        output_suffix(options, "models", "models")
                    )
                } else {
                    format!(
                        "{}{owner_tag}/{owner_tag}.{}",
                        import_root(options),
                        output_suffix(options, "models", "models")
                    )
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
            "import {{ {api_namespace} }} from \"./{}.{}\";",
            decapitalize(tag),
            output_suffix(options, "endpoints", "api")
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
            "import {{ {} }} from \"./{}.{}\";",
            operations.join(", "),
            decapitalize(tag),
            output_suffix(options, "endpoints", "api")
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
    let schema_order: Vec<&str> = endpoints
        .iter()
        .flat_map(|endpoint| {
            endpoint
                .get("parameters")
                .and_then(Value::as_array)
                .into_iter()
                .flatten()
                .filter_map(|parameter| parameter.get("zodSchema").and_then(Value::as_str))
        })
        .collect();
    resolve_model_namespace_owners(content, tag, model_owners, &schema_order, options)
}

/// Model name (with and without the schema suffix) -> owning tags, in `schema_owners` order.
/// Built once per render; each tag's module looks names up through `for_tag`.
pub(crate) struct ModelOwners<'a> {
    owners: HashMap<String, Vec<&'a str>>,
}

impl<'a> ModelOwners<'a> {
    pub(crate) fn new(schema_owners: &'a Map<String, Value>, options: &GenerateOptions) -> Self {
        let mut owners: HashMap<String, Vec<&'a str>> = HashMap::default();
        for (schema, owner) in schema_owners {
            if let Some(owner) = owner.as_str() {
                owners.entry(schema.clone()).or_default().push(owner);
                owners
                    .entry(remove_suffix(schema, &options.schema_suffix))
                    .or_default()
                    .push(owner);
            }
        }
        Self { owners }
    }

    fn for_tag<'b>(&'b self, tag: &'b str) -> TagModelOwners<'a, 'b> {
        TagModelOwners { owners: self, tag }
    }
}

/// The owners of models referenced from `tag`'s module: tags other than `tag`.
struct TagModelOwners<'a, 'b> {
    owners: &'b ModelOwners<'a>,
    tag: &'b str,
}

impl<'a> TagModelOwners<'a, '_> {
    /// The last owner other than this tag, as the previous per-tag map (later inserts win) had it.
    fn get(&self, name: &str) -> Option<&'a str> {
        self.owners
            .owners
            .get(name)?
            .iter()
            .rev()
            .find(|owner| **owner != self.tag)
            .copied()
    }
}

// Namespace-based modules can reference models shared by several tags.
/// `schema_order` lists the schemas whose models the TypeScript renderer imports, in its order: the
/// imports follow the first use of each owner there.
fn resolve_model_namespace_owners(
    content: String,
    tag: &str,
    model_owners: &ModelOwners,
    schema_order: &[&str],
    options: &GenerateOptions,
) -> String {
    if !options.ts_namespaces || options.models_in_common || options.models_in_modules {
        return content;
    }
    let namespace_suffix = options
        .configs
        .get("models")
        .map(|config| config.namespace_suffix.as_str())
        .unwrap_or("Models");
    let local_namespace = format!("{}{namespace_suffix}", capitalize(tag));
    let prefix = format!("{local_namespace}.");
    let owners = model_owners.for_tag(tag);
    let mut imports = IndexSet::default();
    let mut has_local = false;
    let mut output = String::with_capacity(content.len());
    let mut remaining = content.as_str();
    while !remaining.is_empty() {
        // URLs, literal values and descriptions are data, not model references.
        if remaining.starts_with("/*") {
            let end = remaining
                .find("*/")
                .map(|index| index + 2)
                .unwrap_or(remaining.len());
            for (index, line) in remaining[..end].split('\n').enumerate() {
                if index > 0 {
                    output.push('\n');
                }
                let trimmed = line.trim_start();
                let typed_doc = ["* @param { ", "* @returns { ", "* @property { "]
                    .iter()
                    .any(|start| trimmed.starts_with(start));
                if typed_doc {
                    let start = line.find("{ ").unwrap() + 2;
                    let end = line[start..]
                        .find(" }")
                        .map(|end| start + end)
                        .unwrap_or(start);
                    output.push_str(&line[..start]);
                    output.push_str(&rename_owned_models(
                        &line[start..end],
                        &prefix,
                        &owners,
                        namespace_suffix,
                    ));
                    output.push_str(&line[end..]);
                } else {
                    output.push_str(line);
                }
            }
            remaining = &remaining[end..];
            continue;
        }
        if remaining.starts_with("//") {
            let end = remaining.find('\n').unwrap_or(remaining.len());
            output.push_str(&remaining[..end]);
            remaining = &remaining[end..];
            continue;
        }
        let first = remaining.chars().next().unwrap();
        if first == '/' && output.trim_end().ends_with(".regex(") {
            let mut escaped = false;
            let mut character_class = false;
            let mut end = remaining.len();
            for (index, ch) in remaining.char_indices().skip(1) {
                if escaped {
                    escaped = false;
                    continue;
                }
                if ch == '\\' {
                    escaped = true;
                    continue;
                }
                if ch == '[' {
                    character_class = true;
                }
                if ch == ']' {
                    character_class = false;
                }
                if ch == '/' && !character_class {
                    end = index + 1;
                    break;
                }
            }
            output.push_str(&remaining[..end]);
            remaining = &remaining[end..];
            continue;
        }
        if matches!(first, '\'' | '"' | '`') {
            // Native templates interpolate endpoint parameter names, never model expressions.
            let mut escaped = false;
            let mut end = remaining.len();
            for (index, ch) in remaining.char_indices().skip(1) {
                if escaped {
                    escaped = false;
                    continue;
                }
                if ch == '\\' {
                    escaped = true;
                    continue;
                }
                if ch == first {
                    end = index + ch.len_utf8();
                    break;
                }
            }
            output.push_str(&remaining[..end]);
            remaining = &remaining[end..];
            continue;
        }
        if remaining.starts_with(&prefix)
            && output
                .chars()
                .last()
                .is_none_or(|ch| !model_identifier_char(ch))
        {
            remaining = &remaining[prefix.len()..];
            let length = remaining
                .find(|ch: char| !model_identifier_char(ch))
                .unwrap_or(remaining.len());
            let name = &remaining[..length];
            if let Some(owner) = owners.get(name) {
                imports.insert(owner);
                output.push_str(&format!("{}{namespace_suffix}.", capitalize(owner)));
            } else {
                has_local = true;
                output.push_str(&prefix);
            }
            continue;
        }
        output.push(first);
        remaining = &remaining[first.len_utf8()..];
    }
    if imports.is_empty() {
        return output;
    }
    let local_import = format!("import {{ {local_namespace} }} from ");
    let mut lines = output.lines().map(str::to_string).collect::<Vec<_>>();
    let local_position = lines
        .iter()
        .position(|line| line.starts_with(&local_import));
    let insertion = local_position
        .unwrap_or_else(|| lines.iter().position(|line| line.is_empty()).unwrap_or(0));
    let local_line = local_position
        .map(|position| lines.remove(position))
        .filter(|_| has_local);
    let mut owner_order = IndexSet::default();
    for schema in schema_order.iter().filter(|schema| is_named_schema(schema)) {
        owner_order.insert(owners.get(base_schema_name(schema)).unwrap_or(tag));
    }
    let rank = |owner: &str| owner_order.get_index_of(owner).unwrap_or(usize::MAX);
    let suffix = output_suffix(options, "models", "models");
    let mut entries = imports
        .into_iter()
        .map(|owner| {
            let owner_tag = decapitalize(owner);
            (
                rank(owner),
                format!(
                    "import {{ {}{namespace_suffix} }} from \"{}{owner_tag}/{owner_tag}.{suffix}\";",
                    capitalize(owner),
                    import_root(options)
                ),
            )
        })
        .collect::<Vec<_>>();
    if let Some(line) = local_line {
        entries.push((rank(tag), line));
    }
    entries.sort_by_key(|(rank, _)| *rank);
    for (offset, (_, line)) in entries.into_iter().enumerate() {
        lines.insert(insertion + offset, line);
    }
    format!("{}\n", lines.join("\n"))
}

fn model_identifier_char(ch: char) -> bool {
    ch.is_ascii_alphanumeric() || ch == '_' || ch == '$'
}

/// Rewrites `{prefix}{name}` to `{Owner}{namespace_suffix}.{name}` for models owned by another tag.
/// One pass: a match needs identifier boundaries on both sides, so only the identifier right after
/// the prefix can match, and a rewritten reference never forms a new match.
fn rename_owned_models(
    value: &str,
    prefix: &str,
    owners: &TagModelOwners,
    namespace_suffix: &str,
) -> String {
    let mut output = String::with_capacity(value.len());
    let mut remaining = value;
    while let Some(index) = remaining.find(prefix) {
        output.push_str(&remaining[..index]);
        let after = &remaining[index + prefix.len()..];
        let length = after
            .find(|ch: char| !model_identifier_char(ch))
            .unwrap_or(after.len());
        let name = &after[..length];
        let boundary = output
            .chars()
            .last()
            .is_none_or(|ch| !model_identifier_char(ch));
        match owners.get(name).filter(|_| boundary) {
            Some(owner) => {
                output.push_str(&capitalize(owner));
                output.push_str(namespace_suffix);
                output.push('.');
            }
            None => output.push_str(prefix),
        }
        output.push_str(name);
        remaining = &after[length..];
    }
    output.push_str(remaining);
    output
}

fn rest_client_import_path(options: &GenerateOptions) -> String {
    if options.rest_client_import_path.is_empty() {
        format!("{}app-rest-client", import_root(options))
    } else {
        options.rest_client_import_path.clone()
    }
}

fn output_suffix<'a>(options: &'a GenerateOptions, kind: &str, default: &'a str) -> &'a str {
    options
        .configs
        .get(kind)
        .map(|config| config.output_file_name_suffix.as_str())
        .unwrap_or(default)
}

fn query_types_import_path(options: &GenerateOptions) -> &str {
    if options.query_types_import_path == "@povio/openapi-codegen-cli" {
        "@povio/openapi-codegen-cli/query"
    } else {
        &options.query_types_import_path
    }
}

/// Like `import_root`, for files at the output root (`queryModules.ts`).
fn root_import_root(options: &GenerateOptions) -> String {
    match options.import_path.as_str() {
        "relative" => "./".into(),
        _ => import_root(options),
    }
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
    is_cursor_paginated(endpoint)
        || endpoint
            .get("parameters")
            .and_then(Value::as_array)
            .is_some_and(|parameters| {
                parameters.iter().any(|param| {
                    param.get("name").and_then(Value::as_str) == Some(page)
                        && param.get("type").and_then(Value::as_str) == Some("Query")
                })
            })
}

/// Render-only key marking a cursor paginated GET endpoint (`isCursorPaginatedGetEndpoint`).
const CURSOR_PAGINATED: &str = "x-cursorPaginated";
/// `CURSOR_INFINITE_QUERY_KEY`: last query key element of cursor paginated infinite queries.
const CURSOR_INFINITE_QUERY_KEY: &str = "cursor-v1";
const CURSOR_PAGE_PARAM_TYPE: &str = "string | undefined";

fn is_cursor_paginated(endpoint: &Value) -> bool {
    endpoint
        .get(CURSOR_PAGINATED)
        .and_then(Value::as_bool)
        .unwrap_or(false)
}

fn page_param_type(endpoint: &Value) -> &'static str {
    if is_cursor_paginated(endpoint) {
        CURSOR_PAGE_PARAM_TYPE
    } else {
        "number"
    }
}

/// Copies of `endpoints` in which cursor paginated GET endpoints are marked with
/// `CURSOR_PAGINATED`. `None` when infinite queries are off or no endpoint is cursor paginated.
fn with_cursor_pagination<'e>(
    endpoints: &'e [Value],
    document: &Value,
    options: &GenerateOptions,
) -> Option<Vec<Cow<'e, Value>>> {
    if !options.infinite_queries {
        return None;
    }
    let marked: Vec<bool> = endpoints
        .iter()
        .map(|endpoint| detect_cursor_paginated(endpoint, document, options))
        .collect();
    if !marked.contains(&true) {
        return None;
    }
    // Copy only the endpoints that get the flag; the rest are borrowed.
    Some(
        endpoints
            .iter()
            .zip(marked)
            .map(|(endpoint, marked)| match (marked, endpoint.as_object()) {
                (true, Some(object)) => {
                    let mut object = object.clone();
                    object.insert(CURSOR_PAGINATED.into(), Value::Bool(true));
                    Cow::Owned(Value::Object(object))
                }
                _ => Cow::Borrowed(endpoint),
            })
            .collect(),
    )
}

/// `isCursorPaginatedGetEndpoint`: a GET endpoint with an optional string query parameter named
/// `infiniteQueryParamNames.cursor` and a response schema with a string property named
/// `infiniteQueryResponseParamNames.nextCursor` (directly or through `allOf`).
fn detect_cursor_paginated(endpoint: &Value, document: &Value, options: &GenerateOptions) -> bool {
    let cursor = options.infinite_query_param_names.cursor.as_str();
    let next_cursor = options
        .infinite_query_response_param_names
        .next_cursor
        .as_str();
    if cursor.is_empty()
        || next_cursor.is_empty()
        || endpoint.get("method").and_then(Value::as_str) != Some("get")
    {
        return false;
    }
    let find_query_parameter = |name: &str| {
        endpoint
            .get("parameters")
            .and_then(Value::as_array)
            .into_iter()
            .flatten()
            .find(|parameter| {
                parameter.get("name").and_then(Value::as_str) == Some(name)
                    && parameter.get("type").and_then(Value::as_str) == Some("Query")
            })
    };
    let Some(parameter) = find_query_parameter(cursor) else {
        return false;
    };
    let schema = parameter
        .get("zodSchema")
        .and_then(Value::as_str)
        .unwrap_or_default();
    // The first page is requested without a cursor (and a page-number parameter is left unset).
    if is_parameter_required(parameter)
        || is_named_schema(schema)
        || primitive_parameter_type(parameter) != "string"
    {
        return false;
    }
    if find_query_parameter(&options.infinite_query_param_names.page)
        .is_some_and(is_parameter_required)
    {
        return false;
    }
    endpoint
        .pointer("/responseObject/content")
        .and_then(Value::as_object)
        .is_some_and(|content| {
            content.values().any(|media| {
                media
                    .get("schema")
                    .is_some_and(|schema| has_string_property(document, schema, next_cursor, 0))
            })
        })
}

fn resolve_schema<'a>(document: &'a Value, schema: &'a Value) -> Option<&'a Value> {
    let mut resolved = Some(schema);
    let mut depth = 0;
    while let Some(reference) = resolved
        .and_then(|value| value.get("$ref"))
        .and_then(Value::as_str)
    {
        if depth >= 32 {
            break;
        }
        resolved = resolve_document_ref(document, reference);
        depth += 1;
    }
    resolved.filter(|value| value.is_object() && value.get("$ref").is_none())
}

fn has_string_property(document: &Value, schema: &Value, name: &str, depth: usize) -> bool {
    let Some(resolved) = resolve_schema(document, schema) else {
        return false;
    };
    if depth > 32 {
        return false;
    }
    if let Some(property) = resolved
        .get("properties")
        .and_then(|properties| properties.get(name))
    {
        return is_string_schema(document, property, 0);
    }
    resolved
        .get("allOf")
        .and_then(Value::as_array)
        .into_iter()
        .flatten()
        .any(|member| has_string_property(document, member, name, depth + 1))
}

/// A string schema, optionally nullable (`nullable`, a `"null"` type or a `null` union member).
fn is_string_schema(document: &Value, schema: &Value, depth: usize) -> bool {
    let Some(resolved) = resolve_schema(document, schema) else {
        return false;
    };
    if depth > 32 {
        return false;
    }
    match resolved.get("type") {
        Some(Value::String(schema_type)) => return schema_type == "string",
        Some(Value::Array(types)) => {
            return types.iter().any(|item| item == "string")
                && types.iter().all(|item| item == "string" || item == "null");
        }
        Some(_) => return false,
        None => {}
    }
    let Some(members) = resolved
        .get("anyOf")
        .or_else(|| resolved.get("oneOf"))
        .and_then(Value::as_array)
        .filter(|members| !members.is_empty())
    else {
        return false;
    };
    let is_null = |member: &Value| {
        resolve_schema(document, member)
            .and_then(|member| member.get("type"))
            .and_then(Value::as_str)
            == Some("null")
    };
    members
        .iter()
        .all(|member| is_null(member) || is_string_schema(document, member, depth + 1))
        && members.iter().any(|member| !is_null(member))
}

fn is_valid_identifier(name: &str) -> bool {
    let mut chars = name.chars();
    chars
        .next()
        .is_some_and(|first| first.is_ascii_alphabetic() || first == '_' || first == '$')
        && chars.all(|ch| ch.is_ascii_alphanumeric() || ch == '_' || ch == '$')
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
            let mut args = render_arg_list(&params);
            if is_cursor_paginated(endpoint) {
                args = if args.is_empty() {
                    format!("\"{CURSOR_INFINITE_QUERY_KEY}\"")
                } else {
                    format!("{args}, \"{CURSOR_INFINITE_QUERY_KEY}\"")
                };
            }
            lines.push(format!(
                "    {name}Infinite: ({}) => [...keys.all, \"{}\", \"infinite\", {args}] as const,",
                render_param_list(&params),
                endpoint
                    .get("path")
                    .and_then(Value::as_str)
                    .unwrap_or_default(),
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
    let cursor = is_cursor_paginated(endpoint);
    function_params(endpoint, options, models_namespace)
        .into_iter()
        .filter_map(|mut param| {
            if exclude_page
                && (param.name == options.infinite_query_param_names.page
                    || (cursor && param.name == options.infinite_query_param_names.cursor))
            {
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
    let cursor = is_cursor_paginated(endpoint);
    let endpoint_args = if infinite {
        let full = query_function_params(endpoint, options, models_namespace, false, false);
        let names = &options.infinite_query_param_names;
        full.iter()
            .map(|param| {
                if cursor && param.name == names.cursor {
                    "pageParam".to_string()
                } else if param.name == names.page {
                    if cursor { "undefined" } else { "pageParam" }.to_string()
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
        lines.push(format!("  queryFn: ({{ pageParam, signal }}: {{ pageParam: {}; signal: AbortSignal }}) => {api_namespace}.{api_operation}({endpoint_args}, {{ ...config, signal }}),", page_param_type(endpoint)));
    }
    if infinite && cursor {
        let next_cursor = &options.infinite_query_response_param_names.next_cursor;
        let (binding, variable) = if is_valid_identifier(next_cursor) {
            (next_cursor.clone(), next_cursor.as_str())
        } else {
            (
                format!(
                    "{}: nextCursor",
                    serde_json::to_string(next_cursor).unwrap_or_default()
                ),
                "nextCursor",
            )
        };
        lines.push(format!(
            "  initialPageParam: undefined as {CURSOR_PAGE_PARAM_TYPE},"
        ));
        lines.push(format!("  getNextPageParam: ({{ {binding} }}: Awaited<ReturnType<typeof {api_namespace}.{api_operation}>>) => {variable} ?? undefined,"));
    } else if infinite {
        lines.push("  initialPageParam: 1,".into());
        let names = &options.infinite_query_response_param_names;
        lines.push(format!("  getNextPageParam: ({{ {}, {}, {}: limitParam }}: Awaited<ReturnType<typeof {api_namespace}.{api_operation}>> & Partial<Record<\"{}\" | \"{}\" | \"{}\", number | null>>) => {{", names.page, names.total_items, names.limit, names.page, names.total_items, names.limit));
        lines.push(format!("    const pageParam = {} ?? 1;", names.page));
        lines.push("    const pageSize = limitParam ?? 0;".into());
        lines.push(format!(
            "    return pageParam * pageSize < ({} ?? 0) ? pageParam + 1 : null;",
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
    let option_type = if infinite && is_cursor_paginated(endpoint) {
        "AppCursorInfiniteQueryOptions"
    } else if infinite {
        "AppInfiniteQueryOptions"
    } else {
        "AppQueryOptions"
    };
    lines.push(format!("export const {hook} = <TData>({}options?: {option_type}<typeof {api_namespace}.{api_operation}, TData>{}) => {{", if params.is_empty() { "".into() } else { format!("{{ {args} }}: {{ {} }}, ", render_param_list(&params)) }, if options.axios_request_config { format!(", config?: {}", request_config_type(options)) } else { String::new() }));
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
        "{}{{ {}allowInvalidResponseData: queryConfig.allowInvalidResponseData }}",
        if params.is_empty() {
            "".into()
        } else {
            format!("{{ {args} }}, ")
        },
        if options.axios_request_config {
            "...config, "
        } else {
            ""
        }
    );
    lines.push(format!("    ...{options_name}({call_args}),"));
    if has_acl {
        lines.push(format!(
            "    queryFn: async ({{ {}signal }}: {{ {}signal: AbortSignal }}) => {{",
            if infinite { "pageParam, " } else { "" },
            if infinite {
                format!("pageParam: {}; ", page_param_type(endpoint))
            } else {
                String::new()
            }
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
    if !options.generate_js_doc {
        return;
    }
    let (_, cap) = query_names(endpoint);
    let doc_start = lines.len();
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
    lines.push(if infinite && is_cursor_paginated(endpoint) {
        " * @param { AppCursorInfiniteQueryOptions } options Infinite query options".into()
    } else if infinite {
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
    escape_js_doc_lines(&mut lines[doc_start..]);
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
        .filter(|description| !description.is_empty())
    {
        parts.push(description.to_string());
    }
    let media = parameter
        .pointer("/bodyObject/content")
        .and_then(Value::as_object)
        .and_then(|content| {
            content
                .iter()
                .find(|(name, _)| crate::endpoints::is_parameter_media(name))
        })
        .map(|(_, media)| media);
    let schema = media
        .and_then(|media| media.get("schema"))
        .or_else(|| parameter.pointer("/parameterObject/schema"))
        .filter(|schema| schema.get("$ref").is_none());
    if let Some(schema) = schema {
        for (key, label) in DESCRIPTION_KEYS {
            if let Some(value) = schema.get(*key) {
                parts.push(format!("{label}: `{}`", display_js_value(value)));
            }
        }
    }
    if let Some(example) = media.and_then(|media| media.get("example")) {
        parts.push(format!("Example: `{}`", display_js_value(example)));
    }
    if parts.is_empty() {
        String::new()
    } else {
        format!(". {}", parts.join(". "))
    }
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
        let types = scope_params
            .iter()
            .map(|param| format!("{}: {}", param.name, param.ty))
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
        "export const use{mutation_cap} = ({path_arg}options?: AppMutationOptions<typeof {api_namespace}.{api_operation}{variables_arg}>{}{}) => {{",
        if options.mutation_effects { " & MutationEffectsOptions" } else { "" },
        if options.axios_request_config { format!(", config?: {}", request_config_type(options)) } else { String::new() }
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
        let config_arg = if options.axios_request_config {
            if args.is_empty() {
                "config"
            } else {
                ", config"
            }
        } else {
            ""
        };
        lines.push(format!(
            "      return {api_namespace}.{api_operation}({args}{config_arg})"
        ));
        lines.push("    },".into());
    } else {
        let config_arg = if options.axios_request_config {
            if args.is_empty() {
                "config"
            } else {
                ", config"
            }
        } else {
            ""
        };
        lines.push(format!(
            "      {api_namespace}.{api_operation}({args}{config_arg})"
        ));
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
        // The response schema may not declare `method`; default to PUT.
        "        const method = (\"method\" in uploadInstructions && typeof uploadInstructions.method === \"string\" ? uploadInstructions.method.toLowerCase() : \"put\") as \"put\" | \"post\";"
            .into(),
    );
    lines.push("        let dataToSend: File | FormData = file;".into());
    lines.push("        if (method === \"post\") {".into());
    lines.push("          dataToSend = new FormData();".into());
    lines.push(
        "          if (\"fields\" in uploadInstructions && uploadInstructions.fields) {".into(),
    );
    lines.push(
        "            for (const [key, value] of Object.entries(uploadInstructions.fields)) {"
            .into(),
    );
    lines.push("              dataToSend.append(key, String(value));".into());
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
        lines.push(
            "          headers: method === \"put\" ? { \"Content-Type\": file.type } : undefined,"
                .into(),
        );
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
    if !options.generate_js_doc {
        return;
    }
    let (_, cap) = query_names(endpoint);
    let mutation_cap = if endpoint.get("method").and_then(Value::as_str) == Some("get") {
        format!("{cap}Mutation")
    } else {
        cap.clone()
    };
    let doc_start = lines.len();
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
    escape_js_doc_lines(&mut lines[doc_start..]);
    lines.push(" */".into());
}

#[cfg(test)]
mod namespace_owner_tests {
    use super::*;

    #[test]
    fn schema_render_batches_keep_input_order_and_skip_absent_parts() {
        let single_worker = rayon::ThreadPoolBuilder::new()
            .num_threads(1)
            .build()
            .unwrap();
        for count in [0, 1, 127, 128, 513] {
            let schemas: Map<String, Value> = (0..count)
                .rev()
                .map(|index| (format!("Schema{index}"), Value::from(index)))
                .collect();
            let actual = crate::render_pool::install(|| {
                render_schema_items(&schemas, |name, value| {
                    (value.as_u64().unwrap() % 3 != 0).then(|| name.to_string())
                })
            })
            .unwrap();
            let expected: Vec<_> = (0..count)
                .rev()
                .filter(|index| index % 3 != 0)
                .map(|index| format!("Schema{index}"))
                .collect();
            assert_eq!(actual, expected, "batch size {count}");
            let (nested, _) = single_worker.install(|| {
                rayon::join(
                    || {
                        render_schema_items(&schemas, |name, value| {
                            (value.as_u64().unwrap() % 3 != 0).then(|| name.to_string())
                        })
                    },
                    || 1,
                )
            });
            assert_eq!(nested, expected, "single-worker batch size {count}");
        }
    }

    #[test]
    fn shared_model_routing_preserves_literals_and_description_text() {
        let options: GenerateOptions = crate::json::from_value(crate::json!({})).unwrap();
        let owners = crate::json!({ "BaseLogLevelEnumSchema": "Common" })
            .as_object()
            .unwrap()
            .clone();
        let source = r#"import { EmailAdminModels } from "./emailAdmin.models";

/**
 * @returns { EmailAdminModels.BaseLogLevelEnum } EmailAdminModels.BaseLogLevelEnumSchema stays literal
 * @description EmailAdminModels.BaseLogLevelEnumSchema remains unchanged
 */
const value = EmailAdminModels.BaseLogLevelEnumSchema;
const path = `/EmailAdminModels.BaseLogLevelEnumSchema/${id}`;
const quoted = "EmailAdminModels.BaseLogLevelEnumSchema";
const single = 'EmailAdminModels.BaseLogLevelEnumSchema';
const regex = z.string().regex(/EmailAdminModels.BaseLogLevelEnumSchema/);
const escapedRegex = z.string().regex(/\/[/]EmailAdminModels.BaseLogLevelEnumSchema/);
// EmailAdminModels.BaseLogLevelEnumSchema remains unchanged
"#;
        let actual = resolve_model_namespace_owners(
            source.into(),
            "EmailAdmin",
            &ModelOwners::new(&owners, &options),
            &[],
            &options,
        );
        assert!(actual.contains("const value = CommonModels.BaseLogLevelEnumSchema;"));
        assert!(actual.contains("* @returns { CommonModels.BaseLogLevelEnum } EmailAdminModels.BaseLogLevelEnumSchema stays literal"));
        assert!(
            actual.contains(
                "* @description EmailAdminModels.BaseLogLevelEnumSchema remains unchanged"
            )
        );
        assert!(actual.contains("const path = `/EmailAdminModels.BaseLogLevelEnumSchema/${id}`;"));
        assert!(actual.contains("const quoted = \"EmailAdminModels.BaseLogLevelEnumSchema\";"));
        assert!(actual.contains("const single = 'EmailAdminModels.BaseLogLevelEnumSchema';"));
        assert!(actual.contains("// EmailAdminModels.BaseLogLevelEnumSchema remains unchanged"));
        assert!(actual.contains(
            "const regex = z.string().regex(/EmailAdminModels.BaseLogLevelEnumSchema/);"
        ));
        assert!(actual.contains(r"const escapedRegex = z.string().regex(/\/[/]EmailAdminModels.BaseLogLevelEnumSchema/);"));
        assert!(!actual.contains("import { EmailAdminModels }"));
        assert!(actual.contains("import { CommonModels }"));
    }
}

#[cfg(test)]
mod model_code_tests {
    /// The previous character-based `rewrite_code_identifiers`, kept to check the byte-based one.
    fn reference_rewrite(
        code: &str,
        mut replace: impl FnMut(&CodeIdentifier) -> (String, bool),
    ) -> String {
        let is_identifier_char = |ch: char| ch.is_ascii_alphanumeric() || ch == '_' || ch == '$';
        let chars: Vec<char> = code.chars().collect();
        let mut output = String::new();
        let mut index = 0;
        while index < chars.len() {
            let ch = chars[index];
            if ch == '"' || ch == '\'' || ch == '`' {
                let end = find_literal_end(&chars, index, ch);
                output.extend(&chars[index..end]);
                index = end;
                continue;
            }
            if ch == '/' && output.trim_end().ends_with(".regex(") {
                let end = find_regex_end(&chars, index);
                output.extend(&chars[index..end]);
                index = end;
                continue;
            }
            if is_identifier_char(ch) {
                let mut end = index + 1;
                while end < chars.len() && is_identifier_char(chars[end]) {
                    end += 1;
                }
                let identifier: String = chars[index..end].iter().collect();
                let (text, consume_next_char) = replace(&CodeIdentifier {
                    identifier: &identifier,
                    is_member_access: output.ends_with('.') && !output.ends_with("..."),
                    is_object_key: chars[end..]
                        .iter()
                        .find(|next| !next.is_whitespace())
                        .is_some_and(|next| *next == ':'),
                    next_char: chars.get(end).copied(),
                });
                output.push_str(&text);
                index = if consume_next_char { end + 1 } else { end };
                continue;
            }
            output.push(ch);
            index += 1;
        }
        output
    }

    #[test]
    fn byte_rewrite_matches_character_rewrite() {
        let samples = [
            r#"z.object({ a: CommonModels.PetSchema, b: z.enum(["ExamplesModels.ExampleSchema", 'CommonModels.x']), c: z.string().regex(/^CommonModels\.x[/]$/).default(`CommonModels.y`), CommonModels: z.string(), d: z.lazy(() => PetsModels.PetSchema.nullable()) })"#,
            "z.object({ é: CommonModels.Ünïcode, \"naïve\\\"é\": 1, ...BaseModels.BaseSchema.shape, k :Value })",
            "z.string().regex(/a\\/b[\\]/]c/u).describe('it\\'s') // CommonModels.Tail",
            "'unterminated CommonModels.X",
            "CommonModels.",
            "x.regex(  /[/]/g ) Ä.CommonModels.Y CommonModels.Z\u{2028}",
        ];
        for code in samples {
            let strip = |token: &CodeIdentifier| {
                if !token.is_member_access
                    && !token.is_object_key
                    && token.next_char == Some('.')
                    && is_model_namespace(token.identifier, "Models")
                {
                    (String::new(), true)
                } else {
                    (token.identifier.to_string(), false)
                }
            };
            assert_eq!(
                strip_model_namespace_references(code, "Models"),
                reference_rewrite(code, strip),
                "{code}"
            );
            let names: HashSet<&str> = ["PetSchema", "Value", "BaseSchema"].into_iter().collect();
            let call = |token: &CodeIdentifier| {
                let call = names.contains(token.identifier)
                    && !token.is_member_access
                    && !token.is_object_key;
                (
                    if call {
                        format!("{}()", token.identifier)
                    } else {
                        token.identifier.to_string()
                    },
                    false,
                )
            };
            assert_eq!(
                call_lazy_schema_references(code, &names),
                reference_rewrite(code, call),
                "{code}"
            );
        }
    }

    use super::*;

    #[test]
    fn strips_namespace_references_but_not_literals() {
        let code = r#"z.object({ a: CommonModels.PetSchema, b: z.enum(["ExamplesModels.ExampleSchema", 'CommonModels.x']), c: z.string().regex(/^CommonModels\.x$/).default(`CommonModels.y`), CommonModels: z.string(), d: z.lazy(() => PetsModels.PetSchema.nullable()) })"#;
        assert_eq!(
            strip_model_namespace_references(code, "Models"),
            r#"z.object({ a: PetSchema, b: z.enum(["ExamplesModels.ExampleSchema", 'CommonModels.x']), c: z.string().regex(/^CommonModels\.x$/).default(`CommonModels.y`), CommonModels: z.string(), d: z.lazy(() => PetSchema.nullable()) })"#
        );
    }

    #[test]
    fn collects_qualified_and_bare_schema_references() {
        let code = r#"z.object({ PetSchema: CommonModels.StatusEnumSchema, b: TagSchema, c: z.enum(["OwnerSchema"]), d: CommonModels.StatusEnumSchema })"#;
        let names = ["PetSchema", "StatusEnumSchema", "TagSchema", "OwnerSchema"];
        assert_eq!(
            code_schema_references(code, |name| names.contains(&name)),
            vec!["StatusEnumSchema".to_string(), "TagSchema".to_string()]
        );
    }

    #[test]
    fn detects_object_schema_code() {
        assert!(is_zod_object_code("z.object({ a: z.string() })"));
        assert!(is_zod_object_code(
            r#"z.object({ a: z.string().regex(/\)/) }).partial().catchall(z.string())"#
        ));
        assert!(!is_zod_object_code(
            "z.object({ a: z.string() }).readonly()"
        ));
        assert!(!is_zod_object_code("z.object({}).nullable()"));
        assert!(!is_zod_object_code("z.union([z.object({}), z.string()])"));
        assert!(!is_zod_object_code("z.object({}).or(z.string())"));
        let (annotation, code) =
            circular_schema_declaration("z.union([z.string(), z.array(ExampleSchema)])", "Example");
        assert_eq!(annotation, "z.ZodType<Example>");
        assert_eq!(
            code,
            "z.lazy(() => z.union([z.string(), z.array(ExampleSchema)]))"
        );
        let readonly_object =
            "z.object({ next: z.lazy(() => ExampleSchema) }).partial().readonly()";
        let (annotation, code) = circular_schema_declaration(readonly_object, "Example");
        assert_eq!(
            annotation,
            "z.ZodReadonly<z.ZodObject<z.ZodRawShape>> & z.ZodType<Example>"
        );
        assert_eq!(code, readonly_object);
    }

    #[test]
    fn spread_references_are_not_member_accesses() {
        let names = HashSet::from_iter(["PetSchema"]);
        assert_eq!(
            call_lazy_schema_references("z.object({ ...PetSchema.shape, a: x.PetSchema })", &names),
            "z.object({ ...PetSchema().shape, a: x.PetSchema })"
        );
        assert_eq!(
            strip_model_namespace_references(
                "z.object({ ...CommonModels.PetSchema.unwrap().shape })",
                "Models"
            ),
            "z.object({ ...PetSchema.unwrap().shape })"
        );
    }
}

#[cfg(test)]
mod cursor_pagination_tests {
    use super::*;
    use crate::json;

    #[test]
    fn enum_metadata_borrows_unique_objects_and_merges_duplicates_in_document_order() {
        let document = json!({"components":{"schemas":{
            "First":{"type":"string", "enum":["same"], "description":"first", "title":"kept"},
            "Unique":{"enum":["other"]},
            "Second":{"enum":["same"], "description":"last"}
        }}});
        let metadata = document_enum_objects(&document);
        assert!(matches!(metadata["z.enum([\"other\"])"], Cow::Borrowed(_)));
        let merged = metadata["z.enum([\"same\"])"].as_ref();
        assert_eq!(merged["description"], "last");
        assert_eq!(merged["title"], "kept");
        assert_eq!(merged["type"], "string");
        let schema = json!({"properties":{
            "first":{"enum":["a",null]},
            "repeat":{"enum":["a"]},
            "reference":{"$ref":"#/components/schemas/First", "enum":["ignored"]},
            "second":{"enum":["b"]}
        }});
        let mut codes = IndexSet::default();
        collect_inline_enum_codes(&schema, &mut codes);
        assert_eq!(
            codes.into_iter().collect::<Vec<_>>(),
            ["z.enum([\"a\"])", "z.enum([\"b\"])"]
        );
    }

    #[test]
    fn parameter_type_annotations_restore_exact_endpoint_metadata() {
        let document = json!({"components":{"schemas":{"Count":{"type":["integer","null"]}}}});
        let mut endpoints = vec![
            json!({"parameters":[
                {"parameterObject":{"schema":{"$ref":"#/components/schemas/Count"}}},
                {"parameterObject":{"schema":{"$ref":"#/components/schemas/Count"}}, "x-resolvedSchemaType":"original", "after":true},
                {"parameterObject":{"schema":{"$ref":"#/components/schemas/Missing"}}},
                {"parameterObject":{"schema":{"type":"boolean"}}}
            ]}),
            json!({}),
        ];
        let original = serde_json::to_string(&endpoints).unwrap();
        let previous = resolve_parameter_types(&mut endpoints, &document);
        assert_eq!(previous.len(), 2);
        assert_eq!(
            primitive_parameter_type(&endpoints[0]["parameters"][0]),
            "number | null"
        );
        assert_eq!(
            endpoints[0]["parameters"][1][RESOLVED_SCHEMA_TYPE],
            json!(["integer", "null"])
        );
        assert!(
            endpoints[0]["parameters"][2]
                .get(RESOLVED_SCHEMA_TYPE)
                .is_none()
        );
        assert_eq!(
            primitive_parameter_type(&endpoints[0]["parameters"][3]),
            "boolean"
        );
        restore_parameter_types(&mut endpoints, previous);
        assert_eq!(serde_json::to_string(&endpoints).unwrap(), original);
    }

    fn options(extra: Value) -> GenerateOptions {
        let mut base = json!({ "infiniteQueries": true });
        base.as_object_mut()
            .unwrap()
            .extend(extra.as_object().unwrap().clone());
        crate::json::from_value(base).unwrap()
    }

    fn query(name: &str, schema: Value) -> Value {
        json!({
            "name": name,
            "type": "Query",
            "zodSchema": "z.string()",
            "parameterObject": { "name": name, "in": "query", "required": false, "schema": schema },
        })
    }

    fn endpoint(parameters: Vec<Value>, response: Value) -> Value {
        json!({
            "method": "get",
            "path": "/items",
            "operationName": "list",
            "parameters": parameters,
            "responseObject": { "content": { "application/json": { "schema": response } } },
        })
    }

    fn page_response(next_cursor: Value) -> Value {
        json!({ "type": "object", "properties": { "items": { "type": "array" }, "nextCursor": next_cursor } })
    }

    #[test]
    fn detects_string_cursor_with_next_cursor_response() {
        let document = json!({ "components": { "schemas": {
            "Page": page_response(json!({ "type": "string", "nullable": true })),
            "Cursor": { "type": ["string", "null"] },
            "Wrapped": { "allOf": [{ "$ref": "#/components/schemas/Base" }, { "type": "object" }] },
            "Base": page_response(json!({ "$ref": "#/components/schemas/Cursor" })),
        } } });
        let options = options(json!({}));
        let cursor = query("cursor", json!({ "type": "string" }));
        for response in [
            json!({ "$ref": "#/components/schemas/Page" }),
            json!({ "$ref": "#/components/schemas/Wrapped" }),
            page_response(json!({ "anyOf": [{ "type": "string" }, { "type": "null" }] })),
        ] {
            assert!(detect_cursor_paginated(
                &endpoint(vec![cursor.clone()], response),
                &document,
                &options
            ));
        }
    }

    #[test]
    fn rejects_endpoints_that_cannot_be_typed_as_cursor_paginated() {
        let document = json!({});
        let options = options(json!({}));
        let cursor = query("cursor", json!({ "type": "string" }));
        let string = page_response(json!({ "type": "string" }));
        // No next cursor, a non-string next cursor, a non-string cursor, or a non-GET endpoint.
        assert!(!detect_cursor_paginated(
            &endpoint(
                vec![cursor.clone()],
                json!({ "type": "object", "properties": {} })
            ),
            &document,
            &options
        ));
        assert!(!detect_cursor_paginated(
            &endpoint(
                vec![cursor.clone()],
                page_response(json!({ "type": "integer" }))
            ),
            &document,
            &options
        ));
        assert!(!detect_cursor_paginated(
            &endpoint(
                vec![query("cursor", json!({ "type": "integer" }))],
                string.clone()
            ),
            &document,
            &options
        ));
        // A required cursor or page parameter cannot be left unset for the first page.
        let mut required_cursor = cursor.clone();
        required_cursor["parameterObject"]["required"] = json!(true);
        assert!(!detect_cursor_paginated(
            &endpoint(vec![required_cursor], string.clone()),
            &document,
            &options
        ));
        let mut required_page = query("page", json!({ "type": "integer" }));
        required_page["parameterObject"]["required"] = json!(true);
        assert!(!detect_cursor_paginated(
            &endpoint(vec![required_page, cursor.clone()], string.clone()),
            &document,
            &options
        ));
        let mut post = endpoint(vec![cursor.clone()], string.clone());
        post["method"] = json!("post");
        assert!(!detect_cursor_paginated(&post, &document, &options));
        // An empty cursor parameter name disables cursor pagination.
        let disabled = self::options(json!({ "infiniteQueryParamNames": { "cursor": "" } }));
        assert!(!detect_cursor_paginated(
            &endpoint(vec![cursor], string),
            &document,
            &disabled
        ));
    }

    #[test]
    fn renders_cursor_query_keys_and_options() {
        let options = options(json!({
            "infiniteQueryParamNames": { "cursor": "after" },
            "infiniteQueryResponseParamNames": { "nextCursor": "next-cursor" },
        }));
        let response =
            json!({ "type": "object", "properties": { "next-cursor": { "type": "string" } } });
        let endpoints = vec![endpoint(
            vec![
                query("page", json!({ "type": "integer" })),
                query("after", json!({ "type": "string" })),
            ],
            response,
        )];
        let annotated = with_cursor_pagination(&endpoints, &json!({}), &options).unwrap();
        let endpoint: &Value = &annotated[0];
        assert!(is_cursor_paginated(endpoint) && is_infinite(endpoint, &options));
        let mut lines = Vec::new();
        render_query_keys(&mut lines, &[endpoint], &options, "");
        assert!(lines.contains(
            &"    listInfinite: () => [...keys.all, \"/items\", \"infinite\", \"cursor-v1\"] as const,"
                .to_string()
        ));
        let mut lines = Vec::new();
        render_query_options_native(&mut lines, endpoint, &options, "", "ItemsApi", true);
        let code = lines.join("\n");
        assert!(code.contains("ItemsApi.list(undefined, pageParam, { ...config, signal })"));
        assert!(code.contains("pageParam: string | undefined;"));
        assert!(code.contains("initialPageParam: undefined as string | undefined,"));
        assert!(code.contains(
            "getNextPageParam: ({ \"next-cursor\": nextCursor }: Awaited<ReturnType<typeof ItemsApi.list>>) => nextCursor ?? undefined,"
        ));
        // Without infinite queries nothing is marked.
        let off: GenerateOptions = crate::json::from_value(json!({})).unwrap();
        assert!(with_cursor_pagination(&endpoints, &json!({}), &off).is_none());
    }
}
