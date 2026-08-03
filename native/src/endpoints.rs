use std::{cell::RefCell, rc::Rc};

use rustc_hash::{FxHashMap as HashMap, FxHashSet as HashSet};
use serde_json::{Map, Number, Value};

use crate::{
    config::GenerateOptions,
    resolver::{IndexedOperation, Resolver, format_tag},
    zod::ZodCompiler,
};

pub struct EndpointExtractor<'a> {
    document: &'a Value,
    options: &'a GenerateOptions,
    resolver: &'a Resolver<'a>,
    compiler: ZodCompiler<'a>,
    generated_schemas: RefCell<Map<String, Value>>,
    generated_tags: RefCell<HashMap<String, HashSet<String>>>,
    generated_objects: RefCell<Map<String, Value>>,
    generated_dependencies: RefCell<Map<String, Value>>,
    canonical_enum_refs: HashMap<String, String>,
    runtime_tags: Rc<RefCell<HashMap<String, HashSet<String>>>>,
    first_tags: RefCell<HashMap<String, String>>,
    registering: RefCell<HashSet<String>>,
}

pub struct GeneratedEndpointData {
    pub schemas: Map<String, Value>,
    pub tags: HashMap<String, HashSet<String>>,
    pub objects: Map<String, Value>,
    pub dependencies: Map<String, Value>,
    pub first_tags: HashMap<String, String>,
}

impl<'a> EndpointExtractor<'a> {
    pub fn new(
        document: &'a Value,
        options: &'a GenerateOptions,
        resolver: &'a Resolver<'a>,
    ) -> Self {
        Self::new_with_runtime_tags(
            document,
            options,
            resolver,
            Rc::new(RefCell::new(HashMap::default())),
        )
    }

    pub fn new_with_runtime_tags(
        document: &'a Value,
        options: &'a GenerateOptions,
        resolver: &'a Resolver<'a>,
        runtime_tags: Rc<RefCell<HashMap<String, HashSet<String>>>>,
    ) -> Self {
        let canonical_enum_refs = canonical_enum_refs(document);
        Self {
            document,
            options,
            resolver,
            compiler: ZodCompiler::new_with_runtime_tags(
                document,
                options,
                resolver,
                runtime_tags.clone(),
            ),
            generated_schemas: RefCell::new(Map::new()),
            generated_tags: RefCell::new(HashMap::default()),
            generated_objects: RefCell::new(Map::new()),
            generated_dependencies: RefCell::new(Map::new()),
            canonical_enum_refs,
            runtime_tags,
            first_tags: RefCell::new(HashMap::default()),
            registering: RefCell::new(HashSet::default()),
        }
    }

    pub fn extract(&self) -> Result<Vec<Value>, String> {
        let mut name_counts = HashMap::default();
        for operation in &self.resolver.operations {
            *name_counts.entry(operation.name.as_str()).or_insert(0usize) += 1;
        }
        self.resolver
            .operations
            .iter()
            .map(|operation| {
                self.extract_operation(operation, name_counts[operation.name.as_str()] == 1)
            })
            .collect()
    }

    pub fn into_generated_data(self) -> (GeneratedEndpointData, ZodCompiler<'a>) {
        (
            GeneratedEndpointData {
                schemas: self.generated_schemas.into_inner(),
                tags: self.generated_tags.into_inner(),
                objects: self.generated_objects.into_inner(),
                dependencies: self.generated_dependencies.into_inner(),
                first_tags: self.first_tags.into_inner(),
            },
            self.compiler,
        )
    }

    fn generated_dependency_names_from_references(&self, references: &[String]) -> Vec<String> {
        let registered = self.first_tags.borrow();
        let mut names = Vec::new();
        let mut expanded = HashSet::default();
        for reference in references {
            self.add_generated_dependency(reference, &registered, &mut expanded, &mut names);
        }
        names
    }

    fn register_inline_dependencies(
        &self,
        schema: &Value,
        tag: &str,
    ) -> Result<Vec<String>, String> {
        let mut references = Vec::new();
        collect_compiled_reference_order(schema, &mut references, &mut HashSet::default());
        let dependencies = self.generated_dependency_names_from_references(&references);
        if schema.get("$ref").is_none() {
            for reference in references {
                self.register_reference(&reference, tag)?;
            }
        }
        Ok(dependencies)
    }

    fn add_generated_dependency(
        &self,
        reference: &str,
        registered: &HashMap<String, String>,
        expanded: &mut HashSet<String>,
        names: &mut Vec<String>,
    ) {
        let name = schema_name(
            reference.rsplit('/').next().unwrap_or_default(),
            &self.options.schema_suffix,
        );
        if !names.contains(&name) {
            names.push(name);
        }
        if registered.contains_key(reference) || !expanded.insert(reference.to_string()) {
            return;
        }
        if let Some(canonical) = self.canonical_enum_refs.get(reference) {
            let canonical_name = schema_name(
                canonical.rsplit('/').next().unwrap_or_default(),
                &self.options.schema_suffix,
            );
            if !names.contains(&canonical_name) {
                names.push(canonical_name);
            }
        }
        if let Some(children) = self.resolver.ordered_dependencies.get(reference) {
            for child in children {
                self.add_generated_dependency(child, registered, expanded, names);
            }
        }
    }

    fn set_generated_dependencies(&self, name: &str, dependencies: Vec<String>) {
        self.generated_dependencies.borrow_mut().insert(
            name.to_string(),
            Value::Array(dependencies.into_iter().map(Value::String).collect()),
        );
    }

    fn set_generated_object(&self, name: &str, schema: &Value) {
        self.generated_objects
            .borrow_mut()
            .entry(name.to_string())
            .or_insert_with(|| schema.clone());
    }

    fn set_generated_schema(&self, name: String, code: String, tag: &str) {
        self.generated_schemas
            .borrow_mut()
            .insert(name.clone(), Value::String(code));
        self.generated_tags
            .borrow_mut()
            .entry(name)
            .or_default()
            .insert(tag.to_string());
    }

    fn extract_operation(
        &self,
        indexed: &IndexedOperation<'a>,
        unique_name: bool,
    ) -> Result<Value, String> {
        let operation = indexed.operation;
        let mut endpoint = Map::new();
        endpoint.insert("method".into(), Value::String(indexed.method.into()));
        endpoint.insert("path".into(), Value::String(replace_path(indexed.path)));
        endpoint.insert("operationName".into(), Value::String(indexed.name.clone()));
        copy_optional_string(operation, &mut endpoint, "description");
        copy_optional_string(operation, &mut endpoint, "summary");
        if let Some(tags) = operation.get("tags").and_then(Value::as_array) {
            endpoint.insert(
                "tags".into(),
                Value::Array(
                    tags.iter()
                        .filter_map(Value::as_str)
                        .map(|tag| Value::String(format_tag(tag)))
                        .collect(),
                ),
            );
        }
        endpoint.insert(
            "requestFormat".into(),
            Value::String("application/json".into()),
        );
        let mut parameters = Vec::new();

        if let Some(request_body) = operation.get("requestBody") {
            if let Some((parameter, format)) =
                self.body_parameter(request_body, indexed, unique_name)?
            {
                parameters.push(parameter);
                endpoint.insert("requestFormat".into(), Value::String(format));
            }
        }
        for parameter in self.merged_parameters(indexed) {
            if let Some(parameter) = self.parameter(parameter, indexed, unique_name)? {
                parameters.push(parameter);
            }
        }
        add_missing_path_parameters(
            endpoint
                .get("path")
                .and_then(Value::as_str)
                .unwrap_or_default(),
            &mut parameters,
        );
        endpoint.insert("parameters".into(), Value::Array(parameters));
        endpoint.insert("response".into(), Value::String(String::new()));
        endpoint.insert("errors".into(), Value::Array(Vec::new()));
        endpoint.insert("responseStatusCodes".into(), Value::Array(Vec::new()));
        endpoint.insert(
            "mediaUpload".into(),
            Value::Bool(
                operation
                    .get("x-media-upload")
                    .and_then(Value::as_bool)
                    .unwrap_or(false),
            ),
        );
        endpoint.insert(
            "mediaDownload".into(),
            Value::Bool(
                operation
                    .get("x-media-download")
                    .and_then(Value::as_bool)
                    .unwrap_or(false),
            ),
        );

        if let Some(responses) = operation.get("responses").and_then(Value::as_object) {
            for (status_code, raw_response) in responses {
                let response = self.resolve(raw_response).unwrap_or(raw_response);
                let Some(response_obj) = response.as_object() else {
                    continue;
                };
                endpoint
                    .get_mut("responseStatusCodes")
                    .and_then(Value::as_array_mut)
                    .unwrap()
                    .push(Value::String(status_code.clone()));
                let content = response_obj.get("content").and_then(Value::as_object);
                let matching = content.and_then(|content| {
                    content
                        .iter()
                        .find(|(_, media)| media.pointer("/schema").is_some())
                        .or_else(|| {
                            content
                                .iter()
                                .find(|(name, _)| name.starts_with("application/"))
                        })
                });
                if let Some((media_type, _)) = matching {
                    let status = status_code.parse::<u16>().ok();
                    if status.is_some_and(is_success)
                        || (status_code == "default" && !endpoint.contains_key("responseFormat"))
                    {
                        endpoint.insert("responseFormat".into(), Value::String(media_type.clone()));
                    }
                }
                let schema = matching.and_then(|(_, media)| media.get("schema"));
                if let Some(schema) = schema {
                    self.register_reference_schema(schema, &indexed.tag)?;
                    let schema_object = self.resolve(schema).unwrap_or(schema);
                    let dependencies = self.register_inline_dependencies(schema, &indexed.tag)?;
                    let (code, chain) =
                        self.compiler
                            .compile_endpoint_schema(schema, true, &indexed.tag)?;
                    let fallback =
                        response_schema_name(status_code, &indexed.name, unique_name, &indexed.tag);
                    let resolved = resolve_schema_name(
                        schema,
                        schema_object,
                        code.clone(),
                        Some(&fallback),
                        self.options,
                    );
                    if schema.get("$ref").is_none() && complexity(schema_object) >= 2 {
                        self.set_generated_schema(resolved.clone(), code, &indexed.tag);
                        self.set_generated_object(&resolved, schema_object);
                        self.set_generated_dependencies(&resolved, dependencies);
                    }
                    let response_zod = format!("{resolved}{chain}");
                    let status = status_code.parse::<u16>().ok();
                    let current_empty = endpoint
                        .get("response")
                        .and_then(Value::as_str)
                        .is_some_and(str::is_empty);
                    if (status.is_some_and(is_success) || status_code == "default") && current_empty
                    {
                        endpoint.insert("response".into(), Value::String(response_zod));
                        endpoint.insert("responseObject".into(), response.clone());
                        if let Some(description) = response_obj.get("description") {
                            endpoint.insert("responseDescription".into(), description.clone());
                        }
                    } else if status_code != "default"
                        && status.is_some_and(|status| !is_success(status))
                    {
                        let mut error = Map::new();
                        error.insert("zodSchema".into(), Value::String(response_zod));
                        error.insert(
                            "status".into(),
                            Value::Number(Number::from(status.unwrap())),
                        );
                        if let Some(description) = response_obj.get("description") {
                            error.insert("description".into(), description.clone());
                        }
                        if let (Some(domain), Some(code)) = (
                            schema_object
                                .get("x-domain-error-domain")
                                .and_then(Value::as_str),
                            schema_object
                                .pointer("/properties/code/enum/0")
                                .filter(|value| value.is_number() || value.is_string()),
                        ) {
                            if schema_object
                                .pointer("/properties/code/enum")
                                .and_then(Value::as_array)
                                .is_some_and(|values| values.len() == 1)
                            {
                                let mut domain_error = Map::new();
                                domain_error.insert("domain".into(), Value::String(domain.into()));
                                domain_error.insert("code".into(), code.clone());
                                if let Some(name) = schema_object
                                    .get("x-domain-error-name")
                                    .and_then(Value::as_str)
                                {
                                    domain_error.insert("name".into(), Value::String(name.into()));
                                }
                                error.insert("domainError".into(), Value::Object(domain_error));
                            }
                        }
                        endpoint
                            .get_mut("errors")
                            .and_then(Value::as_array_mut)
                            .unwrap()
                            .push(Value::Object(error));
                    }
                } else if status_code != "default"
                    && status_code
                        .parse::<u16>()
                        .ok()
                        .is_some_and(|status| !is_success(status))
                {
                    let mut error = Map::new();
                    error.insert("zodSchema".into(), Value::String("z.void()".into()));
                    error.insert(
                        "status".into(),
                        Value::Number(Number::from(status_code.parse::<u16>().unwrap())),
                    );
                    if let Some(description) = response_obj.get("description") {
                        error.insert("description".into(), description.clone());
                    }
                    endpoint
                        .get_mut("errors")
                        .and_then(Value::as_array_mut)
                        .unwrap()
                        .push(Value::Object(error));
                }
            }
        }
        if endpoint
            .get("response")
            .and_then(Value::as_str)
            .is_some_and(str::is_empty)
        {
            endpoint.insert("response".into(), Value::String("z.void()".into()));
        }
        if let Some(acl) = self.endpoint_acl(operation, &endpoint) {
            endpoint.insert("acl".into(), Value::Array(acl));
        }
        Ok(Value::Object(endpoint))
    }

    fn endpoint_acl(
        &self,
        operation: &Map<String, Value>,
        endpoint: &Map<String, Value>,
    ) -> Option<Vec<Value>> {
        let acl = operation.get("x-acl")?.as_array()?;
        if acl.is_empty() {
            return None;
        }
        Some(
            acl.iter()
                .map(|item| {
                    let mut output = item.as_object().cloned().unwrap_or_default();
                    let mut condition_types = Vec::new();
                    if let Some(conditions) = item.get("conditions").and_then(Value::as_object) {
                        for name in conditions.keys() {
                            if let Some(info) = self.acl_condition(name, acl, endpoint) {
                                condition_types.push(info);
                            }
                        }
                    }
                    output.insert("conditionsTypes".into(), Value::Array(condition_types));
                    Value::Object(output)
                })
                .collect(),
        )
    }

    fn acl_condition(
        &self,
        name: &str,
        acl: &[Value],
        endpoint: &Map<String, Value>,
    ) -> Option<Value> {
        let condition_path = acl
            .first()?
            .pointer(&format!("/conditions/{name}"))?
            .as_str()?;
        let stripped = condition_path
            .strip_prefix('$')
            .and_then(|path| path.split_once('.').map(|(_, rest)| rest))
            .unwrap_or(condition_path);
        let segments: Vec<&str> = stripped.split('.').collect();
        let parameters = endpoint.get("parameters")?.as_array()?;
        let mut schema: Option<&Value> = None;
        let mut required = None;
        let mut info = None;
        let mut index = 0;
        if let Some(parameter) = parameters.iter().find(|parameter| {
            parameter.get("name").and_then(Value::as_str) == segments.first().copied()
        }) {
            let parameter_object = parameter.get("parameterObject");
            required = parameter_object
                .and_then(|object| object.get("required"))
                .and_then(Value::as_bool);
            schema = parameter_object.and_then(|object| object.get("schema"));
            let kind = parameter
                .get("type")
                .and_then(Value::as_str)
                .unwrap_or_default();
            let decapitalized = kind
                .chars()
                .next()
                .map(|first| {
                    first
                        .to_lowercase()
                        .chain(kind.chars().skip(1))
                        .collect::<String>()
                })
                .unwrap_or_default();
            info = Some(format!(
                "{} {decapitalized} parameter",
                parameter
                    .get("name")
                    .and_then(Value::as_str)
                    .unwrap_or_default()
            ));
            index += 1;
        } else if let Some(body) = parameters
            .iter()
            .find(|parameter| parameter.get("bodyObject").is_some())
        {
            let body_object = body.get("bodyObject")?;
            let content = body_object.get("content")?.as_object()?;
            let (_, media) = content.iter().find(|(name, _)| is_parameter_media(name))?;
            schema = media.get("schema");
            required = body_object.get("required").and_then(Value::as_bool);
            info = Some(format!(
                "{} data",
                if endpoint.get("method").and_then(Value::as_str) == Some("get") {
                    "query"
                } else {
                    "mutation"
                }
            ));
            if segments
                .first()
                .is_some_and(|segment| segment.starts_with('$'))
            {
                index += 1;
            }
        }
        while let Some(current) = schema {
            if index >= segments.len() {
                break;
            }
            let resolved = self.resolve(current).unwrap_or(current);
            let object = resolved.as_object()?;
            let property = object.get("properties")?.get(segments[index])?;
            required = Some(
                object
                    .get("required")
                    .and_then(Value::as_array)
                    .is_some_and(|items| {
                        items
                            .iter()
                            .any(|item| item.as_str() == Some(segments[index]))
                    }),
            );
            schema = Some(property);
            index += 1;
        }
        let schema = schema?;
        let mut result = Map::new();
        result.insert("name".into(), Value::String(name.into()));
        if let Some(reference) = schema.get("$ref").and_then(Value::as_str) {
            result.insert(
                "zodSchemaName".into(),
                Value::String(schema_name(
                    reference.rsplit('/').next().unwrap_or_default(),
                    &self.options.schema_suffix,
                )),
            );
        } else if let Some(schema_type) = schema.get("type") {
            result.insert("type".into(), schema_type.clone());
        }
        if let Some(required) = required {
            result.insert("required".into(), Value::Bool(required));
        }
        if let Some(info) = info {
            result.insert("info".into(), Value::String(info));
        }
        Some(Value::Object(result))
    }

    fn body_parameter(
        &self,
        raw_body: &Value,
        indexed: &IndexedOperation<'_>,
        unique_name: bool,
    ) -> Result<Option<(Value, String)>, String> {
        let body = self.resolve(raw_body).unwrap_or(raw_body);
        let Some(body_obj) = body.as_object() else {
            return Ok(None);
        };
        let Some(content) = body_obj.get("content").and_then(Value::as_object) else {
            return Ok(None);
        };
        let Some((media_type, media)) = content.iter().find(|(name, _)| is_parameter_media(name))
        else {
            return Ok(None);
        };
        let Some(schema) = media.get("schema") else {
            return Ok(None);
        };
        self.register_reference_schema(schema, &indexed.tag)?;
        let required = body_obj
            .get("required")
            .and_then(Value::as_bool)
            .unwrap_or(true);
        let dependencies = self.register_inline_dependencies(schema, &indexed.tag)?;
        let (code, chain) =
            self.compiler
                .compile_endpoint_schema(schema, required, &indexed.tag)?;
        let operation_name = if unique_name {
            indexed.name.clone()
        } else {
            format!("{}_{}", indexed.tag, indexed.name)
        };
        let fallback = snake_to_camel(&format!("{operation_name}_Body"));
        let actual = self.resolve(schema).unwrap_or(schema);
        let resolved =
            resolve_schema_name(schema, actual, code.clone(), Some(&fallback), self.options);
        if schema.get("$ref").is_none() && complexity(actual) >= 2 {
            self.set_generated_schema(resolved.clone(), code, &indexed.tag);
            self.set_generated_object(&resolved, actual);
            self.set_generated_dependencies(&resolved, dependencies);
        }
        let zod = if is_named(&resolved) {
            resolved
        } else {
            format!("{resolved}{chain}")
        };
        let mut parameter = Map::new();
        parameter.insert("name".into(), Value::String("data".into()));
        parameter.insert("type".into(), Value::String("Body".into()));
        if let Some(description) = body_obj.get("description") {
            parameter.insert("description".into(), description.clone());
        }
        parameter.insert("zodSchema".into(), Value::String(zod));
        parameter.insert("bodyObject".into(), body.clone());
        Ok(Some((Value::Object(parameter), media_type.clone())))
    }

    fn merged_parameters(&self, indexed: &IndexedOperation<'a>) -> Vec<&'a Value> {
        let mut values: Vec<(String, &Value)> = Vec::new();
        for source in [indexed.path_parameters, indexed.operation.get("parameters")]
            .into_iter()
            .flatten()
        {
            if let Some(params) = source.as_array() {
                for param in params {
                    let key = param
                        .get("$ref")
                        .and_then(Value::as_str)
                        .or_else(|| param.get("name").and_then(Value::as_str))
                        .unwrap_or_default()
                        .to_string();
                    if let Some(existing) = values.iter_mut().find(|(name, _)| name == &key) {
                        existing.1 = param;
                    } else {
                        values.push((key, param));
                    }
                }
            }
        }
        values.into_iter().map(|(_, value)| value).collect()
    }

    fn parameter(
        &self,
        raw: &Value,
        indexed: &IndexedOperation<'_>,
        unique_name: bool,
    ) -> Result<Option<Value>, String> {
        let param = self.resolve(raw).unwrap_or(raw);
        let Some(obj) = param.as_object() else {
            return Ok(None);
        };
        let location = obj.get("in").and_then(Value::as_str).unwrap_or_default();
        if !matches!(location, "query" | "header" | "path") {
            return Ok(None);
        };
        let name = obj.get("name").and_then(Value::as_str).unwrap_or_default();
        let schema = if let Some(content) = obj.get("content").and_then(Value::as_object) {
            let (_, media) = content
                .iter()
                .find(|(key, _)| is_parameter_media(key))
                .ok_or_else(|| format!("Unsupported media type for param {name}"))?;
            media.get("schema").unwrap_or(media)
        } else {
            obj.get("schema").unwrap_or(&Value::Null)
        };
        let required = location == "path"
            || obj
                .get("required")
                .and_then(Value::as_bool)
                .unwrap_or(false);
        self.register_reference_schema(schema, &indexed.tag)?;
        let dependencies = self.register_inline_dependencies(schema, &indexed.tag)?;
        let (code, chain) =
            self.compiler
                .compile_endpoint_schema(schema, required, &indexed.tag)?;
        let op = if unique_name {
            indexed.name.clone()
        } else {
            format!("{}_{}", indexed.tag, indexed.name)
        };
        let fallback = snake_to_camel(&format!("{op}_{name}Param"));
        let actual = self.resolve(schema).unwrap_or(schema);
        let root_optional_object = matches!(location, "query" | "header")
            && !required
            && (actual.get("type").and_then(Value::as_str) == Some("object")
                || actual
                    .get("properties")
                    .and_then(Value::as_object)
                    .is_some_and(|p| !p.is_empty()));
        let effective_chain = if root_optional_object {
            self.compiler.endpoint_chain(schema, true)
        } else {
            chain
        };
        let composed_code = format!("{code}{effective_chain}");
        let zod = resolve_schema_name(
            schema,
            actual,
            composed_code.clone(),
            Some(&fallback),
            self.options,
        );
        if schema.get("$ref").is_none() && complexity(actual) >= 2 {
            self.set_generated_schema(zod.clone(), composed_code, &indexed.tag);
            self.set_generated_object(&zod, actual);
            self.set_generated_dependencies(&zod, dependencies);
        }
        let mut result = Map::new();
        result.insert(
            "name".into(),
            Value::String(if location == "path" {
                path_param_name(name)
            } else {
                name.into()
            }),
        );
        result.insert(
            "type".into(),
            Value::String(
                match location {
                    "header" => "Header",
                    "query" => "Query",
                    _ => "Path",
                }
                .into(),
            ),
        );
        result.insert("zodSchema".into(), Value::String(zod));
        result.insert("parameterObject".into(), param.clone());
        if let Some(enum_names) = obj
            .get("x-enumNames")
            .or_else(|| schema.get("x-enumNames"))
            .and_then(Value::as_array)
            .filter(|_| is_string_like(actual))
        {
            let enum_name = schema_name(
                &fallback,
                &format!("{}{}", self.options.enum_suffix, self.options.schema_suffix),
            );
            result.insert(
                "parameterSortingEnumSchemaName".into(),
                Value::String(enum_name.clone()),
            );
            let enum_code = format!(
                "z.enum([{}])",
                enum_names
                    .iter()
                    .filter_map(Value::as_str)
                    .map(|value| format!("\"{value}\""))
                    .collect::<Vec<_>>()
                    .join(", ")
            );
            self.set_generated_schema(enum_name, enum_code, &indexed.tag);
        }
        Ok(Some(Value::Object(result)))
    }

    fn resolve<'b>(&'b self, value: &'b Value) -> Option<&'b Value> {
        let reference = value.get("$ref")?.as_str()?;
        self.document.pointer(reference.strip_prefix('#')?)
    }

    fn register_reference_schema(&self, schema: &Value, tag: &str) -> Result<(), String> {
        let Some(reference) = schema.get("$ref").and_then(Value::as_str) else {
            return Ok(());
        };
        self.register_reference(reference, tag)
    }

    fn register_reference(&self, reference: &str, tag: &str) -> Result<(), String> {
        let reference = if reference.starts_with("#/") {
            reference.to_string()
        } else {
            format!(
                "#/{}",
                reference.trim_start_matches('#').trim_start_matches('/')
            )
        };
        let effective_tag = tag;
        self.runtime_tags
            .borrow_mut()
            .entry(reference.clone())
            .or_default()
            .insert(effective_tag.to_string());
        let first_use = {
            let mut first_tags = self.first_tags.borrow_mut();
            if first_tags.contains_key(&reference) {
                false
            } else {
                first_tags.insert(reference.clone(), effective_tag.to_string());
                true
            }
        };
        if !first_use || !self.registering.borrow_mut().insert(reference.clone()) {
            return Ok(());
        }
        if let Some(actual) = self
            .document
            .pointer(reference.strip_prefix('#').unwrap_or_default())
        {
            let mut refs = Vec::new();
            let mut seen = HashSet::default();
            collect_compiled_reference_order(actual, &mut refs, &mut seen);
            for child in refs {
                self.register_reference(&child, effective_tag)?;
            }
            if actual.get("enum").is_some() {
                let name = schema_name(
                    reference.rsplit('/').next().unwrap_or_default(),
                    &self.options.schema_suffix,
                );
                let (_, code) = self
                    .compiler
                    .compile_reference_for_tag(&reference, effective_tag)?;
                self.set_generated_schema(name, code, effective_tag);
            }
        }
        if self
            .resolver
            .deep_dependencies
            .get(&reference)
            .is_some_and(|dependencies| dependencies.contains(&reference))
        {
            let name = schema_name(
                reference.rsplit('/').next().unwrap_or_default(),
                &self.options.schema_suffix,
            );
            let (_, code) = self
                .compiler
                .compile_reference_for_tag(&reference, effective_tag)?;
            self.set_generated_schema(name, code, effective_tag);
        }
        self.registering.borrow_mut().remove(&reference);
        Ok(())
    }
}

fn collect_compiled_reference_order(
    value: &Value,
    refs: &mut Vec<String>,
    seen: &mut HashSet<String>,
) {
    match value {
        Value::Object(object) => {
            if let Some(reference) = object.get("$ref").and_then(Value::as_str) {
                if seen.insert(reference.to_string()) {
                    refs.push(reference.to_string());
                }
                return;
            }
            for keyword in ["allOf", "anyOf", "oneOf"] {
                if let Some(items) = object.get(keyword).and_then(Value::as_array) {
                    for child in items {
                        collect_compiled_reference_order(child, refs, seen);
                    }
                    return;
                }
            }
            if let Some(properties) = object.get("properties").and_then(Value::as_object) {
                for child in properties.values() {
                    collect_compiled_reference_order(child, refs, seen);
                }
            }
            if let Some(child) = object
                .get("additionalProperties")
                .filter(|value| value.is_object())
            {
                collect_compiled_reference_order(child, refs, seen);
            }
            if object.get("type").and_then(Value::as_str) == Some("array") {
                if let Some(child) = object.get("items") {
                    collect_compiled_reference_order(child, refs, seen);
                }
            }
        }
        Value::Array(array) => {
            for child in array {
                collect_compiled_reference_order(child, refs, seen);
            }
        }
        _ => {}
    }
}

fn canonical_enum_refs(document: &Value) -> HashMap<String, String> {
    let mut canonical_by_code = HashMap::default();
    let mut result = HashMap::default();
    let Some(schemas) = document
        .pointer("/components/schemas")
        .and_then(Value::as_object)
    else {
        return result;
    };
    for (name, schema) in schemas {
        let Some(values) = schema.get("enum").and_then(Value::as_array) else {
            continue;
        };
        let Ok(code) = serde_json::to_string(values) else {
            continue;
        };
        let reference = format!("#/components/schemas/{name}");
        let canonical = canonical_by_code
            .entry(code)
            .or_insert_with(|| reference.clone());
        if canonical != &reference {
            result.insert(reference, canonical.clone());
        }
    }
    result
}

fn resolve_schema_name(
    original: &Value,
    actual: &Value,
    code: String,
    fallback: Option<&str>,
    options: &GenerateOptions,
) -> String {
    if let Some(reference) = original.get("$ref").and_then(Value::as_str) {
        let name = reference.rsplit('/').next().unwrap_or_default();
        return schema_name(name, &options.schema_suffix);
    }
    if complexity(actual) < 2 {
        return code;
    }
    fallback
        .map(|name| schema_name(name, &options.schema_suffix))
        .unwrap_or(code)
}
fn complexity(schema: &Value) -> u32 {
    if schema.get("$ref").is_some() {
        return 2;
    }
    if let Some(types) = schema.get("type").and_then(Value::as_array) {
        return 3 + types.iter().map(complexity).sum::<u32>();
    }
    for key in ["oneOf", "anyOf", "allOf"] {
        if let Some(items) = schema.get(key).and_then(Value::as_array) {
            let composite = if key == "anyOf" { 3 } else { 2 };
            return composite
                + if items.len() == 1 {
                    complexity(&items[0])
                } else {
                    items.iter().map(complexity).sum()
                };
        }
    }
    match schema.get("type").and_then(Value::as_str) {
        Some("string" | "number" | "integer" | "boolean") => {
            1 + u32::from(schema.get("enum").is_some())
        }
        Some("array") => 1 + schema.get("items").map(complexity).unwrap_or(0),
        Some("object") => {
            2 + schema
                .get("properties")
                .and_then(Value::as_object)
                .map(|properties| properties.values().map(complexity).sum())
                .unwrap_or(0)
        }
        _ if schema.get("properties").is_some() => {
            2 + schema
                .get("properties")
                .and_then(Value::as_object)
                .map(|properties| properties.values().map(complexity).sum())
                .unwrap_or(0)
        }
        _ => 0,
    }
}
fn response_schema_name(status: &str, operation: &str, unique: bool, tag: &str) -> String {
    let op = if unique {
        operation.into()
    } else {
        format!("{tag}_{operation}")
    };
    if status != "default" && status.parse::<u16>().ok().is_some_and(|s| !is_success(s)) {
        snake_to_camel(&format!("{op}_{status}_ErrorResponse"))
    } else {
        snake_to_camel(&format!("{op}Response"))
    }
}
fn schema_name(name: &str, suffix: &str) -> String {
    let name = capitalize(&normalize_name(name));
    if name.ends_with(suffix) {
        name
    } else {
        format!("{name}{suffix}")
    }
}
fn normalize_name(value: &str) -> String {
    let mut sanitized = String::new();
    let mut separator = false;
    for ch in value.trim().chars() {
        if ch.is_ascii_alphanumeric() || ch == '_' {
            sanitized.push(ch);
            separator = false;
        } else if !separator {
            sanitized.push('_');
            separator = true;
        }
    }
    if sanitized
        .chars()
        .next()
        .is_some_and(|ch| ch.is_ascii_digit())
    {
        sanitized.insert(0, '_');
    }
    let chars: Vec<char> = sanitized.chars().collect();
    let mut output = String::new();
    let mut index = 0;
    while index < chars.len() {
        if chars[index] == '_'
            && index + 1 < chars.len()
            && (chars[index + 1].is_ascii_alphanumeric() || chars[index + 1] == '_')
        {
            output.extend(chars[index + 1].to_uppercase());
            index += 2;
        } else {
            output.push(chars[index]);
            index += 1;
        }
    }
    output
}
fn snake_to_camel(value: &str) -> String {
    let mut out = String::new();
    let mut upper = false;
    for ch in value.chars() {
        if ch == '_' {
            upper = true
        } else if upper {
            out.extend(ch.to_uppercase());
            upper = false
        } else {
            out.push(ch)
        }
    }
    out
}
fn capitalize(value: &str) -> String {
    let mut chars = value.chars();
    chars
        .next()
        .map(|first| first.to_uppercase().chain(chars).collect())
        .unwrap_or_default()
}
fn is_success(status: u16) -> bool {
    (200..300).contains(&status)
}
fn is_parameter_media(name: &str) -> bool {
    (name.contains("application/") && name.contains("json"))
        || name.contains("text/")
        || matches!(
            name,
            "application/octet-stream"
                | "multipart/form-data"
                | "application/x-www-form-urlencoded"
                | "*/*"
        )
}
fn is_named(value: &str) -> bool {
    !value.starts_with("z.") && !value.starts_with("ZodExtended.")
}
fn is_string_like(schema: &Value) -> bool {
    if schema.get("$ref").is_some() {
        return true;
    }
    if schema.get("type").and_then(Value::as_str) == Some("string") {
        return true;
    }
    if schema
        .get("type")
        .and_then(Value::as_array)
        .is_some_and(|types| types.iter().any(|t| t.as_str() == Some("string")))
    {
        return true;
    }
    ["allOf", "oneOf", "anyOf"].iter().any(|key| {
        schema
            .get(*key)
            .and_then(Value::as_array)
            .is_some_and(|items| items.iter().any(is_string_like))
    })
}
fn copy_optional_string(from: &Map<String, Value>, to: &mut Map<String, Value>, key: &str) {
    if let Some(value) = from.get(key) {
        to.insert(key.into(), value.clone());
    }
}
fn replace_path(path: &str) -> String {
    let mut output = String::with_capacity(path.len());
    let mut remaining = path;
    while let Some(open) = remaining.find('{') {
        output.push_str(&remaining[..open]);
        let after_open = &remaining[open + 1..];
        let Some(close) = after_open.find('}') else {
            output.push_str(&remaining[open..]);
            return output;
        };
        let name = &after_open[..close];
        if !name.is_empty()
            && name
                .bytes()
                .all(|byte| byte.is_ascii_alphanumeric() || matches!(byte, b'_' | b'-'))
        {
            output.push(':');
            output.push_str(&path_param_name(name));
        } else {
            output.push('{');
            output.push_str(name);
            output.push('}');
        }
        remaining = &after_open[close + 1..];
    }
    output.push_str(remaining);
    output
}
fn path_param_name(name: &str) -> String {
    name.replace('_', "#")
        .split('-')
        .enumerate()
        .map(|(index, part)| {
            if index == 0 {
                part.into()
            } else {
                capitalize(part)
            }
        })
        .collect::<String>()
        .replace('#', "_")
}
fn add_missing_path_parameters(path: &str, parameters: &mut Vec<Value>) {
    let names: HashSet<String> = parameters
        .iter()
        .filter_map(|p| p.get("name").and_then(Value::as_str).map(str::to_string))
        .collect();
    let bytes = path.as_bytes();
    let mut index = 0;
    while index < bytes.len() {
        if bytes[index] != b':' {
            index += 1;
            continue;
        }
        let start = index + 1;
        let mut end = start;
        while end < bytes.len() && (bytes[end].is_ascii_alphanumeric() || bytes[end] == b'_') {
            end += 1;
        }
        if end == start {
            index += 1;
            continue;
        }
        let name = &path[start..end];
        if !names.contains(name) {
            parameters.push(serde_json::json!({"name":name,"type":"Path","zodSchema":"z.string()","parameterObject":{"name":name,"required":true,"in":"path","schema":{"type":"string"}}}));
        }
        index = end;
    }
}
