mod config;
mod endpoints;
mod engine;
mod openapi;
mod render;
mod resolver;
mod zod;

use napi::bindgen_prelude::*;
use napi_derive::napi;
use serde_json::Value;

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
    pub data_json: Buffer,
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
pub fn compile_data(source: String, yaml: bool, options_json: String) -> Result<NativeDataResult> {
    let started = std::time::Instant::now();
    let document = openapi::parse_document(&source, yaml)
        .map_err(|error| Error::new(Status::InvalidArg, error.to_string()))?;
    let options: config::GenerateOptions = serde_json::from_str(&options_json)
        .map_err(|error| Error::new(Status::InvalidArg, error.to_string()))?;
    let resolver = resolver::Resolver::new(&document, &options)
        .map_err(|error| Error::new(Status::InvalidArg, error))?;
    let after_resolver = started.elapsed();
    let extractor = endpoints::EndpointExtractor::new(&document, &options, &resolver);
    let endpoints = extractor
        .extract()
        .map_err(|error| Error::new(Status::GenericFailure, error))?;
    let after_endpoints = started.elapsed();
    let compiler = zod::ZodCompiler::new_with_runtime_tags(
        &document,
        &options,
        &resolver,
        extractor.runtime_tags(),
    );
    let mut schema_owners = serde_json::Map::new();
    let mut schema_refs = serde_json::Map::new();
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
    for (name, tag) in compiler.extracted_schema_tags() {
        schema_owners.insert(name, Value::String(tag));
    }
    for (name, tags) in extractor.generated_tags() {
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
    let generated_objects = extractor.generated_objects();
    let generated_dependencies = extractor.generated_dependencies();
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
        .compile_components_with_tags(&extractor.first_tags())
        .map_err(|error| Error::new(Status::GenericFailure, error))?;
    let after_components = started.elapsed();
    let root_enums: Vec<(String, Value)> = components
        .iter()
        .filter(|(_, code)| code.as_str().is_some_and(|code| code.starts_with("z.enum")))
        .map(|(name, code)| (name.clone(), code.clone()))
        .collect();
    let mut sortable_schemas = serde_json::Map::new();
    for (name, code) in components {
        if !code.as_str().is_some_and(|code| code.starts_with("z.enum")) {
            sortable_schemas.insert(name, code);
        }
    }
    sortable_schemas.extend(extractor.generated_schemas());
    sortable_schemas.extend(root_enums);
    let mut schemas = serde_json::Map::new();
    for reference in &resolver.topology_order {
        let name = zod::schema_name(
            reference.rsplit('/').next().unwrap_or_default(),
            &options.schema_suffix,
        );
        if let Some(code) = sortable_schemas.shift_remove(&name) {
            schemas.insert(name, code);
        }
    }
    schemas.extend(sortable_schemas);
    let mut ordered_schemas = extracted_schemas;
    ordered_schemas.extend(schemas);
    let rendered_models = render::render_model_proxies(
        &document,
        &endpoints,
        &ordered_schemas,
        &schema_refs,
        &resolver.ordered_dependencies,
        &generated_objects,
        &generated_dependencies,
        &options,
    );
    let rendered_endpoints = render::render_endpoints(&endpoints, &ordered_schemas, &options);
    let rendered_queries = render::render_queries(&endpoints, &options);
    let rendered_acl = render::render_acl(&endpoints, &options);
    let rendered_shared = render::render_shared(&endpoints, &options);
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
        && options.models_in_common
        && options.split_by_tags
        && !options.inline_endpoints
        && !options.builder_configs
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
    let compact = || Value::Object(serde_json::Map::new());
    let data_json = serde_json::to_vec(&serde_json::json!({
        "endpoints": if rendered_complete { Value::Array(Vec::new()) } else { Value::Array(endpoints) },
        "schemas": if rendered_complete { compact() } else { Value::Object(ordered_schemas) },
        "schemaOwners": if rendered_complete { compact() } else { Value::Object(schema_owners) },
        "schemaRefs": if rendered_complete { compact() } else { Value::Object(schema_refs) },
        "circularSchemas": if rendered_complete { Value::Array(Vec::new()) } else { serde_json::to_value(circular_schemas).unwrap() },
        "topologyOrder": if rendered_complete { Value::Array(Vec::new()) } else { serde_json::to_value(topology_order).unwrap() },
        "baseUrl": base_url,
        "generatedObjects": if rendered_complete { compact() } else { Value::Object(generated_objects) },
        "generatedDependencies": if rendered_complete { compact() } else { Value::Object(generated_dependencies) },
        "dependencies": if rendered_complete { compact() } else { serde_json::to_value(resolver.ordered_dependencies).unwrap() },
        "renderedModels": rendered_models,
        "renderedEndpoints": rendered_endpoints,
        "renderedQueries": rendered_queries,
        "renderedAcl": rendered_acl,
        "renderedShared": rendered_shared,
        "renderedComplete": rendered_complete,
        "renderedTags": rendered_tags,
        "document": if rendered_complete { Value::Null } else { document.clone() },
    }))
    .map_err(|error| Error::new(Status::GenericFailure, error.to_string()))?;
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
    }
    Ok(NativeDataResult {
        data_json: data_json.into(),
        elapsed_micros: started.elapsed().as_micros() as i64,
    })
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
    let Ok(result) = compile_data(source.to_string(), yaml != 0, options.to_string()) else {
        return std::ptr::null_mut();
    };
    let mut bytes = result.data_json.to_vec();
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
