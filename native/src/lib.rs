mod cache;
mod config;
mod endpoints;
mod engine;
mod files;
mod json;
mod openapi;
mod render;
mod render_pool;
mod resolver;
mod zod;

use crate::json::Value;
use napi::Env;
use napi::bindgen_prelude::*;
use napi_derive::napi;

// Use the system allocator: this addon can unload with its last Node worker and
// later reload. An embedded allocator's thread-local state can outlive that load.

#[napi(module_exports)]
pub fn initialize_render_environment(env: Env) -> Result<()> {
    render_pool::register_environment(env)?;
    cache::register_environment(env)
}

#[napi(object)]
pub struct NativeParseResult {
    pub document_json: String,
    pub parse_micros: i64,
}

#[napi(object)]
pub struct NativeAnalyzeResult {
    pub stats_json: String,
    pub elapsed_micros: i64,
}

#[napi(object)]
pub struct NativeResolverResult {
    pub stats_json: String,
    pub operation_names_json: String,
    pub schema_tags_json: String,
    pub elapsed_micros: i64,
}

#[napi(object)]
pub struct NativeSchemasResult {
    pub schemas_json: String,
    pub elapsed_micros: i64,
}

#[napi(object)]
pub struct NativeEndpointsResult {
    pub endpoints_json: String,
    pub elapsed_micros: i64,
}

#[napi(object)]
pub struct NativeDataResult {
    pub cache_hit: bool,
    pub data: Value,
    pub elapsed_micros: i64,
}

#[napi]
pub fn parse_openapi(source: String, yaml: bool) -> Result<NativeParseResult> {
    let started = std::time::Instant::now();
    let document = openapi::parse_document(&source, yaml)
        .map_err(|error| Error::new(Status::InvalidArg, error.to_string()))?;
    let document_json = serde_json::to_string(&document)
        .map_err(|error| Error::new(Status::GenericFailure, error.to_string()))?;

    Ok(NativeParseResult {
        document_json,
        parse_micros: started.elapsed().as_micros() as i64,
    })
}

#[napi]
pub fn analyze_openapi(source: String, yaml: bool) -> Result<NativeAnalyzeResult> {
    let started = std::time::Instant::now();
    let document = openapi::parse_document(&source, yaml)
        .map_err(|error| Error::new(Status::InvalidArg, error.to_string()))?;
    let stats = engine::analyze(&document);
    let stats_json = serde_json::to_string(&stats)
        .map_err(|error| Error::new(Status::GenericFailure, error.to_string()))?;

    Ok(NativeAnalyzeResult {
        stats_json,
        elapsed_micros: started.elapsed().as_micros() as i64,
    })
}

#[napi]
pub fn analyze_generation(
    source: String,
    yaml: bool,
    options_json: String,
) -> Result<NativeResolverResult> {
    let started = std::time::Instant::now();
    let document = openapi::parse_document(&source, yaml)
        .map_err(|error| Error::new(Status::InvalidArg, error.to_string()))?;
    let options: config::GenerateOptions = serde_json::from_str(&options_json)
        .map_err(|error| Error::new(Status::InvalidArg, error.to_string()))?;
    let resolver = resolver::Resolver::new(&document, &options)
        .map_err(|error| Error::new(Status::InvalidArg, error))?;
    let stats_json = serde_json::to_string(&resolver.stats(&document))
        .map_err(|error| Error::new(Status::GenericFailure, error.to_string()))?;
    let names: Vec<&str> = resolver
        .operations
        .iter()
        .map(|operation| operation.name.as_str())
        .collect();
    let operation_names_json = serde_json::to_string(&names)
        .map_err(|error| Error::new(Status::GenericFailure, error.to_string()))?;
    let schema_tags_json = serde_json::to_string(&resolver.schema_tags)
        .map_err(|error| Error::new(Status::GenericFailure, error.to_string()))?;
    Ok(NativeResolverResult {
        stats_json,
        operation_names_json,
        schema_tags_json,
        elapsed_micros: started.elapsed().as_micros() as i64,
    })
}

#[napi]
pub fn compile_schemas(
    source: String,
    yaml: bool,
    options_json: String,
) -> Result<NativeSchemasResult> {
    let started = std::time::Instant::now();
    let document = openapi::parse_document(&source, yaml)
        .map_err(|error| Error::new(Status::InvalidArg, error.to_string()))?;
    let options: config::GenerateOptions = serde_json::from_str(&options_json)
        .map_err(|error| Error::new(Status::InvalidArg, error.to_string()))?;
    let resolver = resolver::Resolver::new(&document, &options)
        .map_err(|error| Error::new(Status::InvalidArg, error))?;
    let schemas = zod::ZodCompiler::new(&document, &options, &resolver)
        .compile_components()
        .map_err(|error| Error::new(Status::GenericFailure, error))?;
    let schemas_json = serde_json::to_string(&schemas)
        .map_err(|error| Error::new(Status::GenericFailure, error.to_string()))?;
    Ok(NativeSchemasResult {
        schemas_json,
        elapsed_micros: started.elapsed().as_micros() as i64,
    })
}

#[napi]
pub fn compile_endpoints(
    source: String,
    yaml: bool,
    options_json: String,
) -> Result<NativeEndpointsResult> {
    let started = std::time::Instant::now();
    let document = openapi::parse_document(&source, yaml)
        .map_err(|error| Error::new(Status::InvalidArg, error.to_string()))?;
    let options: config::GenerateOptions = serde_json::from_str(&options_json)
        .map_err(|error| Error::new(Status::InvalidArg, error.to_string()))?;
    let resolver = resolver::Resolver::new(&document, &options)
        .map_err(|error| Error::new(Status::InvalidArg, error))?;
    let endpoints = endpoints::EndpointExtractor::new(&document, &options, &resolver)
        .extract()
        .map_err(|error| Error::new(Status::GenericFailure, error))?;
    let endpoints_json = serde_json::to_string(&endpoints)
        .map_err(|error| Error::new(Status::GenericFailure, error.to_string()))?;
    Ok(NativeEndpointsResult {
        endpoints_json,
        elapsed_micros: started.elapsed().as_micros() as i64,
    })
}

#[napi]
pub fn compile_data(
    env: Env,
    source: String,
    yaml: bool,
    options_json: String,
) -> Result<NativeDataResult> {
    // Bun's process.env updates need not update the OS environment visible to
    // Rust. Read the invoking JS environment, including worker-local settings.
    let process: Object = env.get_global()?.get_named_property("process")?;
    let environment: Object = process.get_named_property("env")?;
    let setting: Option<String> = environment.get("OPENAPI_CODEGEN_NATIVE_CACHE")?;
    compile_data_impl(source, yaml, options_json, setting.as_deref() != Some("0"))
}

#[napi(object)]
pub struct NativeFilesResult {
    /// False when the options need the TypeScript renderer; nothing else is set then.
    pub complete: bool,
    pub names: Vec<String>,
    pub hashes: Vec<String>,
    pub changed_names: Vec<String>,
    pub changed_contents: Vec<String>,
    pub written: u32,
    pub elapsed_micros: i64,
}

/// Compiles, renders and assembles the output files, and writes the changed ones unless the
/// caller formats them first. Only file names, hashes and files left to format reach JavaScript.
#[napi]
pub fn generate_files(
    env: Env,
    source: String,
    yaml: bool,
    options_json: String,
    write_json: String,
) -> Result<NativeFilesResult> {
    let process: Object = env.get_global()?.get_named_property("process")?;
    let environment: Object = process.get_named_property("env")?;
    let setting: Option<String> = environment.get("OPENAPI_CODEGEN_NATIVE_CACHE")?;
    let started = std::time::Instant::now();
    let options: config::GenerateOptions = serde_json::from_str(&options_json)
        .map_err(|error| Error::new(Status::InvalidArg, error.to_string()))?;
    let write: files::WriteOptions = serde_json::from_str(&write_json)
        .map_err(|error| Error::new(Status::InvalidArg, error.to_string()))?;
    let compiled = compile_data_impl(source, yaml, options_json, setting.as_deref() != Some("0"))?;
    let after_compile = started.elapsed();
    let generated = files::generate_files(compiled.data, &options, &write)
        .map_err(|error| Error::new(Status::GenericFailure, error))?;
    if std::env::var_os("OPENAPI_NATIVE_PROFILE").is_some() {
        eprintln!(
            "native files compile={:.3}ms files={:.3}ms",
            after_compile.as_secs_f64() * 1000.0,
            (started.elapsed() - after_compile).as_secs_f64() * 1000.0,
        );
    }
    let elapsed_micros = started.elapsed().as_micros() as i64;
    Ok(match generated {
        Some(generated) => NativeFilesResult {
            complete: true,
            names: generated.names,
            hashes: generated.hashes,
            changed_names: generated.changed_names,
            changed_contents: generated.changed_contents,
            written: generated.written,
            elapsed_micros,
        },
        None => NativeFilesResult {
            complete: false,
            names: Vec::new(),
            hashes: Vec::new(),
            changed_names: Vec::new(),
            changed_contents: Vec::new(),
            written: 0,
            elapsed_micros,
        },
    })
}

fn compile_data_impl(
    source: String,
    yaml: bool,
    options_json: String,
    cache_enabled: bool,
) -> Result<NativeDataResult> {
    let started = std::time::Instant::now();
    let (cache_epoch, cached) = if cache_enabled {
        cache::lookup(&source, yaml, &options_json)
    } else {
        (None, None)
    };
    if let Some(data) = cached {
        return Ok(NativeDataResult {
            data: (*data).clone(),
            cache_hit: true,
            elapsed_micros: started.elapsed().as_micros() as i64,
        });
    }
    let document = openapi::parse_document(&source, yaml)
        .map_err(|error| Error::new(Status::InvalidArg, error.to_string()))?;
    let options: config::GenerateOptions = serde_json::from_str(&options_json)
        .map_err(|error| Error::new(Status::InvalidArg, error.to_string()))?;
    let resolver = resolver::Resolver::new(&document, &options)
        .map_err(|error| Error::new(Status::InvalidArg, error))?;
    let after_resolver = started.elapsed();
    let extractor = endpoints::EndpointExtractor::new(&document, &options, &resolver);
    let mut endpoints = extractor
        .extract()
        .map_err(|error| Error::new(Status::GenericFailure, error))?;
    let after_endpoints = started.elapsed();
    let (generated, compiler) = extractor.into_generated_data();
    let mut schema_owners = crate::json::Map::new();
    let mut schema_refs = crate::json::Map::new();
    if let Some(document_schemas) = document
        .pointer("/components/schemas")
        .and_then(Value::as_object)
    {
        for name in document_schemas.keys() {
            let reference = format!("#/components/schemas/{name}");
            let zod_name = zod::schema_name(name, &options.schema_suffix);
            schema_owners.insert(
                zod_name.clone(),
                Value::String(compiler.schema_owner(&reference)),
            );
            schema_refs.insert(zod_name, Value::String(reference));
        }
    }
    let extracted_tags = compiler.extracted_schema_tags();
    for (name, tag) in &extracted_tags {
        schema_owners.insert(name.clone(), Value::String(tag.clone()));
    }
    for (name, tags) in generated.tags {
        // The TypeScript resolver looks extracted enums up by name before anything else, so an
        // extracted enum keeps its tag even when a component schema renders under the same name.
        if extracted_tags.contains_key(&name) {
            continue;
        }
        let tag = if tags.len() == 1 {
            tags.into_iter()
                .next()
                .unwrap_or_else(|| options.default_tag.clone())
        } else {
            options.default_tag.clone()
        };
        schema_owners.insert(name, Value::String(tag));
    }
    let circular_schemas = compiler.circular_schema_names();
    let mut generated_objects = compiler.extracted_schema_objects();
    generated_objects.extend(generated.objects);
    let generated_dependencies = generated.dependencies;
    let topology_order: Vec<String> = resolver
        .topology_order
        .iter()
        .map(|reference| {
            zod::schema_name(
                reference.rsplit('/').next().unwrap_or_default(),
                &options.schema_suffix,
            )
        })
        .collect();
    let base_url = if options.base_url.is_empty() {
        document
            .pointer("/servers/0/url")
            .and_then(Value::as_str)
            .unwrap_or_default()
    } else {
        &options.base_url
    };
    let extracted_schemas = compiler.extracted_schema_codes();
    let components = compiler
        .compile_components_with_tags(&generated.first_tags)
        .map_err(|error| Error::new(Status::GenericFailure, error))?;
    let after_components = started.elapsed();
    let schemas = order_compiled_schemas(components, generated.schemas, &topology_order);
    let mut ordered_schemas = extracted_schemas;
    ordered_schemas.extend(schemas);
    let mut usage_tags: rustc_hash::FxHashMap<String, rustc_hash::FxHashSet<String>> =
        rustc_hash::FxHashMap::default();
    // Direct inline responses need not produce a named generated schema. Keep
    // the resolver's reference usage too, so those endpoints still contribute
    // to ownership when the rendered-schema graph is propagated below.
    for (reference, tags) in &resolver.schema_tags {
        let name = zod::schema_name(
            reference.rsplit('/').next().unwrap_or_default(),
            &options.schema_suffix,
        );
        if ordered_schemas.contains_key(&name) {
            usage_tags
                .entry(name)
                .or_default()
                .extend(tags.iter().cloned());
        }
    }
    for endpoint in &endpoints {
        let tag = endpoint
            .get("tags")
            .and_then(Value::as_array)
            .and_then(|tags| tags.first())
            .and_then(Value::as_str)
            .unwrap_or(&options.default_tag);
        let mut direct = Vec::new();
        if let Some(name) = endpoint.get("response").and_then(Value::as_str) {
            direct.push(name);
        }
        direct.extend(
            endpoint
                .get("errors")
                .and_then(Value::as_array)
                .into_iter()
                .flatten()
                .filter_map(|error| error.get("zodSchema").and_then(Value::as_str)),
        );
        direct.extend(
            endpoint
                .get("parameters")
                .and_then(Value::as_array)
                .into_iter()
                .flatten()
                .flat_map(|parameter| {
                    ["zodSchema", "parameterSortingEnumSchemaName"]
                        .into_iter()
                        .filter_map(|key| parameter.get(key).and_then(Value::as_str))
                }),
        );
        for name in direct {
            // Drop a use-site validation chain (`ExampleSchema.min(3)`) from referenced schemas.
            let name = render::base_schema_name(name);
            if ordered_schemas.contains_key(name) {
                usage_tags
                    .entry(name.to_string())
                    .or_default()
                    .insert(tag.to_string());
            }
        }
    }
    propagate_schema_usage_tags(&ordered_schemas, &mut usage_tags);
    // Like the TypeScript renderer, extracted enums keep the owner their component usages gave them,
    // and with `modelsInModules` go to the modules of all those usages.
    if options.models_in_modules {
        for (name, tags) in compiler.extracted_schema_usage_tags() {
            let tags = if tags.is_empty() {
                extracted_tags.get(name).cloned().into_iter().collect()
            } else {
                tags.iter().cloned().collect()
            };
            usage_tags.insert(name.clone(), tags);
        }
    }
    for (name, tags) in &usage_tags {
        if extracted_tags.contains_key(name) {
            continue;
        }
        let owner = if tags.len() == 1 {
            tags.iter()
                .next()
                .cloned()
                .unwrap_or_else(|| options.default_tag.clone())
        } else {
            options.default_tag.clone()
        };
        schema_owners.insert(name.clone(), Value::String(owner));
    }
    let render_started = std::time::Instant::now();
    let parameter_types = render::resolve_parameter_types(&mut endpoints, &document);
    let render_endpoints = &endpoints;
    let (rendered_models, rendered_endpoints, rendered_queries, rendered_acl, rendered_shared) =
        render_pool::install(|| {
            let (models, (endpoints, (queries, (acl, shared)))) = rayon::join(
                || {
                    render::render_model_proxies(
                        &document,
                        &endpoints,
                        &ordered_schemas,
                        &schema_owners,
                        &usage_tags,
                        &schema_refs,
                        &resolver.ordered_dependencies,
                        &generated_objects,
                        &generated_dependencies,
                        &circular_schemas,
                        &options,
                    )
                },
                || {
                    rayon::join(
                        || {
                            render::render_endpoints(
                                render_endpoints,
                                &ordered_schemas,
                                &schema_owners,
                                &options,
                            )
                        },
                        || {
                            rayon::join(
                                || {
                                    render::render_queries(
                                        render_endpoints,
                                        &document,
                                        &schema_owners,
                                        &options,
                                    )
                                },
                                || {
                                    rayon::join(
                                        || {
                                            render::render_acl(
                                                render_endpoints,
                                                &schema_owners,
                                                &options,
                                            )
                                        },
                                        || render::render_shared(render_endpoints, &options),
                                    )
                                },
                            )
                        },
                    )
                },
            );
            (models, endpoints, queries, acl, shared)
        })
        .map_err(|error| Error::new(Status::GenericFailure, error))?;
    render::restore_parameter_types(&mut endpoints, parameter_types);
    let render_elapsed = render_started.elapsed();
    let after_render = started.elapsed();
    let acl_tag_count = endpoints
        .iter()
        .filter(|endpoint| {
            endpoint
                .get("acl")
                .and_then(Value::as_array)
                .is_some_and(|acl| !acl.is_empty())
        })
        .filter_map(|endpoint| {
            endpoint
                .get("tags")
                .and_then(Value::as_array)
                .and_then(|tags| tags.first())
                .and_then(Value::as_str)
        })
        .collect::<std::collections::HashSet<_>>()
        .len();
    let rendered_complete = options.native_compact
        && options.split_by_tags
        && !options.inline_endpoints
        && options.workspace_context.is_empty()
        && (!options.acl
            || (rendered_acl.len() == acl_tag_count && rendered_shared.contains_key("appAcl")));
    let mut rendered_tags = indexmap::IndexSet::new();
    for endpoint in &endpoints {
        let tag = endpoint
            .get("tags")
            .and_then(Value::as_array)
            .and_then(|tags| tags.first())
            .and_then(Value::as_str)
            .unwrap_or(&options.default_tag);
        rendered_tags.insert(tag.to_string());
    }
    rendered_tags.insert(options.default_tag.clone());
    let rendered_tags = rendered_tags.into_iter().collect::<Vec<_>>();
    let compact = || Value::Object(crate::json::Map::new());
    let mut data = crate::json::Map::new();
    data.insert(
        "endpoints".into(),
        if rendered_complete {
            Value::Array(Vec::new())
        } else {
            Value::Array(std::mem::take(&mut endpoints))
        },
    );
    data.insert(
        "schemas".into(),
        if rendered_complete {
            compact()
        } else {
            Value::Object(ordered_schemas)
        },
    );
    data.insert(
        "schemaOwners".into(),
        if rendered_complete {
            compact()
        } else {
            Value::Object(schema_owners)
        },
    );
    data.insert(
        "schemaUsageTags".into(),
        if rendered_complete {
            compact()
        } else {
            crate::json::to_value(usage_tags).unwrap()
        },
    );
    data.insert(
        "schemaRefs".into(),
        if rendered_complete {
            compact()
        } else {
            Value::Object(schema_refs)
        },
    );
    data.insert(
        "circularSchemas".into(),
        if rendered_complete {
            Value::Array(Vec::new())
        } else {
            crate::json::to_value(circular_schemas).unwrap()
        },
    );
    data.insert(
        "topologyOrder".into(),
        if rendered_complete {
            Value::Array(Vec::new())
        } else {
            crate::json::to_value(topology_order).unwrap()
        },
    );
    data.insert("baseUrl".into(), Value::String(base_url.to_owned()));
    data.insert(
        "generatedObjects".into(),
        if rendered_complete {
            compact()
        } else {
            Value::Object(generated_objects)
        },
    );
    data.insert(
        "generatedDependencies".into(),
        if rendered_complete {
            compact()
        } else {
            Value::Object(generated_dependencies)
        },
    );
    data.insert(
        "dependencies".into(),
        if rendered_complete {
            compact()
        } else {
            crate::json::to_value(&resolver.ordered_dependencies).unwrap()
        },
    );
    data.insert("renderedModels".into(), Value::Object(rendered_models));
    data.insert(
        "renderedEndpoints".into(),
        Value::Object(rendered_endpoints),
    );
    data.insert("renderedQueries".into(), Value::Object(rendered_queries));
    data.insert("renderedAcl".into(), Value::Object(rendered_acl));
    data.insert("renderedShared".into(), Value::Object(rendered_shared));
    data.insert("renderedComplete".into(), Value::Bool(rendered_complete));
    data.insert(
        "renderedTags".into(),
        crate::json::to_value(rendered_tags).unwrap(),
    );
    // Borrowers of `document` must go before it can move to the release thread.
    drop(compiler);
    drop(resolver);
    let document = if rendered_complete {
        // Freeing the parsed document is a sizeable share of a compile.
        render_pool::release_in_background((document, endpoints));
        Value::Null
    } else {
        document
    };
    data.insert("document".into(), document);
    let data = Value::Object(data);
    if std::env::var_os("OPENAPI_NATIVE_PROFILE").is_some() {
        let finished = started.elapsed();
        eprintln!(
            "native profile resolver={:.3}ms endpoints={:.3}ms components={:.3}ms finalize={:.3}ms total={:.3}ms",
            after_resolver.as_secs_f64() * 1000.0,
            (after_endpoints - after_resolver).as_secs_f64() * 1000.0,
            (after_components - after_endpoints).as_secs_f64() * 1000.0,
            (finished - after_components).as_secs_f64() * 1000.0,
            finished.as_secs_f64() * 1000.0,
        );
        eprintln!(
            "native render parallel={:.3}ms assemble+json={:.3}ms",
            render_elapsed.as_secs_f64() * 1000.0,
            (finished - after_render).as_secs_f64() * 1000.0,
        );
    }
    cache::insert(cache_epoch, source, yaml, options_json, &data);
    Ok(NativeDataResult {
        cache_hit: false,
        data,
        elapsed_micros: started.elapsed().as_micros() as i64,
    })
}

// Preserve component/generated/enum precedence and stable leftover order without
// shifting the remaining insertion-ordered map for each topology entry.
fn order_compiled_schemas(
    components: crate::json::Map<String, Value>,
    generated: crate::json::Map<String, Value>,
    topology_order: &[String],
) -> crate::json::Map<String, Value> {
    let mut root_enums = Vec::new();
    let mut remaining = crate::json::Map::new();
    for (name, code) in components {
        if code.as_str().is_some_and(|code| code.starts_with("z.enum")) {
            root_enums.push((name, code));
        } else {
            remaining.insert(name, code);
        }
    }
    remaining.extend(generated);
    remaining.extend(root_enums);
    let mut ordered = crate::json::Map::new();
    for name in topology_order {
        // Distinct component references can normalize to the same schema name.
        if !ordered.contains_key(name) {
            if let Some(code) = remaining.get_mut(name) {
                ordered.insert(name.clone(), std::mem::take(code));
            }
        }
    }
    for (name, code) in remaining {
        if !ordered.contains_key(&name) {
            ordered.insert(name, code);
        }
    }
    ordered
}

// Build the rendered-schema graph once, then revisit only schemas whose usage changed.
// Token recognition deliberately matches the existing ownership propagation semantics.
fn propagate_schema_usage_tags(
    schemas: &crate::json::Map<String, Value>,
    usage_tags: &mut rustc_hash::FxHashMap<String, rustc_hash::FxHashSet<String>>,
) {
    use rustc_hash::FxHashMap;
    let names: Vec<&str> = schemas.keys().map(String::as_str).collect();
    let ids: FxHashMap<&str, usize> = names
        .iter()
        .enumerate()
        .map(|(id, &name)| (name, id))
        .collect();
    // Move existing sets into dense slots, retaining their iteration order and
    // capacity. Rendered module order depends on the original set traversal.
    let mut tags: Vec<_> = names.iter().map(|name| usage_tags.remove(*name)).collect();
    let mut queued = vec![false; names.len()];
    let mut pending = std::collections::VecDeque::new();
    for (id, initial) in tags.iter().enumerate() {
        if initial.is_some() {
            queued[id] = true;
            pending.push_back(id);
        }
    }
    let dependencies: Vec<Vec<usize>> = schemas
        .iter()
        .enumerate()
        .map(|(id, (_, code))| {
            let mut seen = rustc_hash::FxHashSet::default();
            code.as_str()
                .into_iter()
                .flat_map(|code| {
                    code.split(|c: char| !c.is_ascii_alphanumeric() && c != '_' && c != '$')
                })
                .filter_map(|name| ids.get(name).copied())
                .filter(|&dependency| dependency != id && seen.insert(dependency))
                .collect()
        })
        .collect();
    while let Some(id) = pending.pop_front() {
        queued[id] = false;
        let source = tags[id].as_ref().unwrap().clone();
        for &dependency in &dependencies[id] {
            let target = tags[dependency].get_or_insert_with(Default::default);
            let previous = target.len();
            target.extend(source.iter().cloned());
            if target.len() != previous && !queued[dependency] {
                queued[dependency] = true;
                pending.push_back(dependency);
            }
        }
    }
    for (name, tags) in names.into_iter().zip(tags) {
        if let Some(tags) = tags {
            usage_tags.insert(name.to_string(), tags);
        }
    }
}

#[cfg(test)]
mod usage_tests {
    use super::*;

    #[test]
    fn indexed_ownership_preserves_tag_iteration_order_used_by_module_rendering() {
        use rustc_hash::{FxHashMap, FxHashSet};
        let schemas =
            crate::json!({"First":"Shared", "Second":"Shared", "Shared":"Leaf", "Leaf":"Shared"});
        let mut actual = FxHashMap::default();
        actual.insert(
            "First".to_string(),
            (0..20)
                .map(|i| format!("First{i}"))
                .collect::<FxHashSet<_>>(),
        );
        actual.insert(
            "Second".to_string(),
            (0..25)
                .map(|i| format!("Second{i}"))
                .collect::<FxHashSet<_>>(),
        );
        let mut expected = actual.clone();
        let mut pending = std::collections::VecDeque::from(["First", "Second"]);
        while let Some(name) = pending.pop_front() {
            let source = expected[name].clone();
            let child = if name == "Shared" { "Leaf" } else { "Shared" };
            let target = expected.entry(child.to_string()).or_default();
            let old = target.len();
            target.extend(source.iter().cloned());
            if target.len() != old && !pending.contains(&child) {
                pending.push_back(child);
            }
        }
        propagate_schema_usage_tags(schemas.as_object().unwrap(), &mut actual);
        for name in ["First", "Second", "Shared", "Leaf"] {
            assert_eq!(
                actual[name].iter().collect::<Vec<_>>(),
                expected[name].iter().collect::<Vec<_>>()
            );
        }
    }

    #[test]
    fn indexed_ownership_preserves_large_tag_sets_empty_and_external_entries() {
        use rustc_hash::{FxHashMap, FxHashSet};
        let schemas = crate::json!({"Root":"Middle", "Middle":"Leaf", "Leaf":"Root", "Empty":"EmptyChild", "EmptyChild":"Far", "Far":"z.string()"});
        let all: FxHashSet<String> = (0..130).map(|i| format!("Tag{i}")).collect();
        let mut usages = FxHashMap::default();
        usages.insert("Root".to_string(), all.clone());
        usages.insert(
            "Leaf".to_string(),
            ["Extra".to_string()].into_iter().collect(),
        );
        usages.insert("Empty".to_string(), FxHashSet::default());
        usages.insert(
            "External".to_string(),
            ["ExternalTag".to_string()].into_iter().collect(),
        );
        propagate_schema_usage_tags(schemas.as_object().unwrap(), &mut usages);
        let mut expected = all;
        expected.insert("Extra".to_string());
        for name in ["Root", "Middle", "Leaf"] {
            assert_eq!(usages[name], expected);
        }
        assert!(usages["EmptyChild"].is_empty());
        assert!(!usages.contains_key("Far")); // empty propagation does not enqueue unchanged children
        assert!(usages["External"].contains("ExternalTag"));
        let mut empty = FxHashMap::default();
        empty.insert("Empty".to_string(), FxHashSet::default());
        propagate_schema_usage_tags(schemas.as_object().unwrap(), &mut empty);
        assert!(empty["EmptyChild"].is_empty());
        assert!(!empty.contains_key("Far"));
    }

    #[test]
    fn schema_order_preserves_normalized_collisions_and_leftover_enum_precedence() {
        let components = crate::json!({
            "UnusedSchema": "z.string()",
            "ChoiceSchema": "z.enum([\"first\", \"second\"])",
            "ThingItemSchema": "z.object({ value: z.string() })",
            "LastEnumSchema": "z.enum([\"last\"])"
        })
        .as_object()
        .unwrap()
        .clone();
        let generated = crate::json!({
            "GeneratedSchema": "z.number()",
            "ChoiceSchema": "z.boolean()",
            "UnusedSchema": "z.string().optional()"
        })
        .as_object()
        .unwrap()
        .clone();
        let topology =
            ["thing-item", "Absent", "ThingItem"].map(|name| zod::schema_name(name, "Schema"));
        assert_eq!(topology[0], topology[2]);
        let ordered = order_compiled_schemas(components, generated, &topology);
        assert_eq!(
            ordered.keys().map(String::as_str).collect::<Vec<_>>(),
            [
                "ThingItemSchema",
                "UnusedSchema",
                "GeneratedSchema",
                "ChoiceSchema",
                "LastEnumSchema"
            ]
        );
        assert_eq!(
            ordered["ThingItemSchema"],
            "z.object({ value: z.string() })"
        );
        assert_eq!(ordered["UnusedSchema"], "z.string().optional()");
        assert_eq!(ordered["ChoiceSchema"], "z.enum([\"first\", \"second\"])");
        assert_eq!(ordered["LastEnumSchema"], "z.enum([\"last\"])");
        assert!(!ordered.contains_key("AbsentSchema"));
    }

    #[test]
    fn propagates_usage_through_reversed_chains_and_cycles() {
        let schemas = crate::json!({
            "Leaf": "z.string()",
            "CycleA": "z.object({ next: CycleB, leaf: Leaf })",
            "CycleB": "z.object({ next: CycleA })",
            "Root": "z.object({ child: CycleA, again: CycleA })",
            "OtherRoot": "z.object({ child: CycleB })",
            "Unused": "z.object({ child: Leaf })"
        });
        let mut usages = rustc_hash::FxHashMap::default();
        usages.insert(
            "Root".to_string(),
            ["first".to_string()].into_iter().collect(),
        );
        usages.insert(
            "OtherRoot".to_string(),
            ["second".to_string()].into_iter().collect(),
        );
        propagate_schema_usage_tags(schemas.as_object().unwrap(), &mut usages);
        let both: rustc_hash::FxHashSet<String> = ["first".to_string(), "second".to_string()]
            .into_iter()
            .collect();
        for name in ["Leaf", "CycleA", "CycleB"] {
            assert_eq!(usages[name], both);
        }
        assert_eq!(usages["Root"].len(), 1);
        assert_eq!(usages["OtherRoot"].len(), 1);
        assert!(!usages.contains_key("Unused"));
    }
}

#[napi]
pub fn native_version() -> &'static str {
    env!("CARGO_PKG_VERSION")
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn openapi_codegen_compile_data(
    source_ptr: *const u8,
    source_len: usize,
    yaml: u8,
    options_ptr: *const u8,
    options_len: usize,
    output_len: *mut usize,
) -> *mut u8 {
    if source_ptr.is_null() || options_ptr.is_null() || output_len.is_null() {
        return std::ptr::null_mut();
    }
    let source = unsafe { std::slice::from_raw_parts(source_ptr, source_len) };
    let options = unsafe { std::slice::from_raw_parts(options_ptr, options_len) };
    let Ok(source) = std::str::from_utf8(source) else {
        return std::ptr::null_mut();
    };
    let Ok(options) = std::str::from_utf8(options) else {
        return std::ptr::null_mut();
    };
    let Ok(result) = compile_data_impl(source.to_string(), yaml != 0, options.to_string(), false)
    else {
        return std::ptr::null_mut();
    };
    let Ok(mut bytes) = serde_json::to_vec(&result.data) else {
        return std::ptr::null_mut();
    };
    let pointer = bytes.as_mut_ptr();
    unsafe { *output_len = bytes.len() };
    std::mem::forget(bytes);
    pointer
}

#[unsafe(no_mangle)]
pub unsafe extern "C" fn openapi_codegen_free(pointer: *mut u8, length: usize) {
    if !pointer.is_null() && length > 0 {
        unsafe { drop(Vec::from_raw_parts(pointer, length, length)) };
    }
}
