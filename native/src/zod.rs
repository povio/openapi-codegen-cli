use std::{cell::RefCell, rc::Rc};

use indexmap::IndexMap as BaseIndexMap;
use rustc_hash::{FxBuildHasher, FxHashMap as HashMap, FxHashSet as HashSet};
use serde_json::{Map, Value};

use crate::{config::GenerateOptions, resolver::Resolver};

type IndexMap<K, V> = BaseIndexMap<K, V, FxBuildHasher>;

#[derive(Clone, Copy, Default)]
struct Meta {
    required: bool,
    parent_partial: bool,
}

pub struct ZodCompiler<'a> {
    document: &'a Value,
    options: &'a GenerateOptions,
    resolver: &'a Resolver<'a>,
    root_enums: HashMap<String, String>,
    extracted_enums: IndexMap<String, (String, String)>,
    circular_getters: HashSet<String>,
    runtime_tags: Rc<RefCell<HashMap<String, HashSet<String>>>>,
}

impl<'a> ZodCompiler<'a> {
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
        let mut root_enums = HashMap::default();
        if let Some(schemas) = document
            .pointer("/components/schemas")
            .and_then(Value::as_object)
        {
            for (name, schema) in schemas {
                if let Some(code) = enum_code(schema) {
                    root_enums
                        .entry(code)
                        .or_insert_with(|| schema_name(name, &options.schema_suffix));
                }
            }
        }
        let extracted_enums = collect_extracted_enums(document, resolver, options, &root_enums);
        let circular_getters = collect_precompiled_circular_refs(document, resolver);
        Self {
            document,
            options,
            resolver,
            root_enums,
            extracted_enums,
            circular_getters,
            runtime_tags,
        }
    }

    pub fn compile_components(&self) -> Result<Map<String, Value>, String> {
        self.compile_components_with_tags(&HashMap::default())
    }

    pub fn compile_components_with_tags(
        &self,
        first_tags: &HashMap<String, String>,
    ) -> Result<Map<String, Value>, String> {
        let mut result = Map::new();
        let Some(schemas) = self
            .document
            .pointer("/components/schemas")
            .and_then(Value::as_object)
        else {
            return Ok(result);
        };
        for (name, schema) in schemas {
            let zod_name = schema_name(name, &self.options.schema_suffix);
            let reference = format!("#/components/schemas/{name}");
            if self.options.exclude_redundant_zod_schemas
                && !self.resolver.schema_tags.contains_key(&reference)
            {
                continue;
            }
            let tag = first_tags
                .get(&reference)
                .cloned()
                .unwrap_or_else(|| self.schema_tag(&reference));
            let code = if schema.get("enum").is_some() {
                enum_code(schema).unwrap_or_else(|| "z.enum([])".into())
            } else {
                self.compile(
                    schema,
                    Meta::default(),
                    &tag,
                    Some(&reference),
                    &mut Vec::new(),
                )?
            };
            result.insert(zod_name, Value::String(code));
        }
        Ok(result)
    }

    pub fn compile_endpoint_schema(
        &self,
        schema: &Value,
        required: bool,
        tag: &str,
    ) -> Result<(String, String), String> {
        let meta = Meta {
            required,
            parent_partial: false,
        };
        let code = self.compile(schema, meta, tag, None, &mut Vec::new())?;
        let actual = self.resolve_schema(schema).unwrap_or(schema);
        Ok((code, chain(actual, meta, self.options)))
    }

    pub fn extracted_schema_codes(&self) -> Map<String, Value> {
        self.extracted_enums
            .iter()
            .map(|(code, (name, _))| (name.clone(), Value::String(code.clone())))
            .collect()
    }

    pub fn extracted_schema_tags(&self) -> HashMap<String, String> {
        self.extracted_enums
            .values()
            .map(|(name, tag)| (name.clone(), tag.clone()))
            .collect()
    }

    pub fn schema_owner(&self, reference: &str) -> String {
        self.schema_tag(reference)
    }

    pub fn circular_schema_names(&self) -> Vec<String> {
        self.resolver
            .deep_dependencies
            .iter()
            .filter(|(reference, dependencies)| dependencies.contains(*reference))
            .map(|(reference, _)| {
                schema_name(
                    reference.rsplit('/').next().unwrap_or_default(),
                    &self.options.schema_suffix,
                )
            })
            .collect()
    }

    pub fn compile_reference_for_tag(
        &self,
        reference: &str,
        tag: &str,
    ) -> Result<(String, String), String> {
        let reference = autocorrect_ref(reference);
        let schema = self
            .document
            .pointer(
                reference
                    .strip_prefix('#')
                    .ok_or_else(|| format!("Invalid ref: {reference}"))?,
            )
            .ok_or_else(|| format!("Schema not found: {reference}"))?;
        let name = schema_name(
            reference.rsplit('/').next().unwrap_or_default(),
            &self.options.schema_suffix,
        );
        let code = self.compile(
            schema,
            Meta::default(),
            tag,
            Some(&reference),
            &mut vec![reference.clone()],
        )?;
        Ok((name, code))
    }

    fn compile(
        &self,
        schema: &Value,
        meta: Meta,
        tag: &str,
        root_ref: Option<&str>,
        stack: &mut Vec<String>,
    ) -> Result<String, String> {
        if let Some(reference) = schema.get("$ref").and_then(Value::as_str) {
            let reference = autocorrect_ref(reference);
            let name = reference
                .rsplit('/')
                .next()
                .ok_or_else(|| format!("Invalid ref: {reference}"))?;
            let zod_name = schema_name(name, &self.options.schema_suffix);
            let owner = self.schema_tag(&reference);
            let output = if self.options.ts_namespaces && owner != tag {
                format!("{}Models.{zod_name}", capitalize(&owner))
            } else {
                zod_name
            };
            return Ok(output);
        }

        let object = schema
            .as_object()
            .ok_or_else(|| "Schema must be an object".to_string())?;
        if let Some(types) = object.get("type").and_then(Value::as_array) {
            let mut compiled = Vec::with_capacity(types.len());
            for schema_type in types {
                let mut variant = object.clone();
                variant.insert("type".into(), schema_type.clone());
                compiled.push(self.compile(&Value::Object(variant), meta, tag, root_ref, stack)?);
            }
            return Ok(if compiled.len() == 1 {
                compiled.remove(0)
            } else {
                format!("z.union([{}])", compiled.join(", "))
            });
        }
        for keyword in ["oneOf", "anyOf"] {
            if let Some(items) = object.get(keyword).and_then(Value::as_array) {
                let compiled = items
                    .iter()
                    .map(|item| self.compile(item, meta, tag, root_ref, stack))
                    .collect::<Result<Vec<_>, _>>()?;
                if compiled.len() == 1 {
                    return Ok(compiled[0].clone());
                }
                if keyword == "oneOf"
                    && object.get("discriminator").is_some()
                    && !items.iter().any(has_multiple_all_of)
                {
                    let property = object
                        .get("discriminator")
                        .and_then(Value::as_object)
                        .and_then(|discriminator| discriminator.get("propertyName"))
                        .and_then(Value::as_str)
                        .unwrap_or_default();
                    return Ok(format!(
                        "\n      z.discriminatedUnion(\"{property}\", [{}])\n        ",
                        compiled.join(", ")
                    ));
                }
                return Ok(format!("z.union([{}])", compiled.join(", ")));
            }
        }
        if let Some(items) = object.get("allOf").and_then(Value::as_array) {
            return self.compile_all_of(items, meta, tag, root_ref, stack);
        }
        if let Some(primitive) = self.compile_primitive(object, tag, root_ref)? {
            return Ok(primitive);
        }
        let schema_type = object
            .get("type")
            .and_then(Value::as_str)
            .map(str::to_ascii_lowercase);
        if schema_type.as_deref() == Some("array") {
            let item = if let Some(items) = object.get("items") {
                let code = self.compile(
                    items,
                    Meta {
                        required: true,
                        parent_partial: false,
                    },
                    tag,
                    root_ref,
                    stack,
                )?;
                let actual = self.resolve_schema(items).unwrap_or(items);
                format!(
                    "{code}{}",
                    chain(
                        actual,
                        Meta {
                            required: true,
                            parent_partial: false
                        },
                        self.options
                    )
                )
            } else {
                "z.any()".into()
            };
            return Ok(format!(
                "z.array({item}){}",
                if self.options.all_readonly {
                    ".readonly()"
                } else {
                    ""
                }
            ));
        }
        if schema_type.as_deref() == Some("object")
            || object.contains_key("properties")
            || object.contains_key("additionalProperties")
        {
            return self.compile_object(object, meta, tag, root_ref, stack);
        }
        if schema_type.as_deref() == Some("any") {
            return Ok("z.any()".into());
        }
        if schema_type.as_deref() == Some("null") {
            return Ok("z.null()".into());
        }
        if schema_type.is_none() {
            return Ok("z.unknown()".into());
        }
        Err(format!(
            "Unsupported schema type: {}",
            schema_type.unwrap_or_default()
        ))
    }

    fn compile_primitive(
        &self,
        schema: &Map<String, Value>,
        tag: &str,
        root_ref: Option<&str>,
    ) -> Result<Option<String>, String> {
        let Some(schema_type) = schema
            .get("type")
            .and_then(Value::as_str)
            .map(str::to_ascii_lowercase)
        else {
            return Ok(None);
        };
        if !matches!(
            schema_type.as_str(),
            "string" | "number" | "integer" | "boolean"
        ) {
            return Ok(None);
        }
        if let Some(values) = schema.get("enum").and_then(Value::as_array) {
            if schema_type == "string" {
                let code = enum_code(&Value::Object(schema.clone()))
                    .unwrap_or_else(|| "z.enum([])".into());
                if self.options.extract_enums {
                    if let Some(name) = self.root_enums.get(&code) {
                        let enum_ref = format!(
                            "#/components/schemas/{}",
                            name.strip_suffix(&self.options.schema_suffix)
                                .unwrap_or(name)
                        );
                        if root_ref != Some(enum_ref.as_str()) {
                            let owner = self.schema_tag(&enum_ref);
                            return Ok(Some(if self.options.ts_namespaces && owner != tag {
                                format!("{}Models.{name}", capitalize(&owner))
                            } else {
                                name.clone()
                            }));
                        }
                    }
                    if let Some((name, owner)) = self.extracted_enums.get(&code) {
                        return Ok(Some(if self.options.ts_namespaces && owner != tag {
                            format!("{}Models.{name}", capitalize(owner))
                        } else {
                            name.clone()
                        }));
                    }
                }
                return Ok(Some(code));
            }
            if values.iter().any(Value::is_string) {
                return Ok(Some("z.never()".into()));
            }
            let literals: Vec<String> = values.iter().map(js_scalar).collect();
            return Ok(Some(if literals.len() == 1 {
                format!("z.literal({})", literals[0])
            } else {
                format!(
                    "z.union([{}])",
                    literals
                        .iter()
                        .map(|value| format!("z.literal({value})"))
                        .collect::<Vec<_>>()
                        .join(", ")
                )
            }));
        }
        Ok(Some(match schema_type.as_str() {
            "integer" => "z.int()".into(),
            "number" => "z.number()".into(),
            "boolean" => "z.boolean()".into(),
            "string" => match schema.get("format").and_then(Value::as_str) {
                Some("binary") => "z.instanceof(Blob)".into(),
                Some("email") => "z.email()".into(),
                Some("hostname" | "uri") => "z.url()".into(),
                Some("uuid") => "z.uuid()".into(),
                Some("date-time") => "z.iso.datetime({ offset: true })".into(),
                _ => "z.string()".into(),
            },
            _ => unreachable!(),
        }))
    }

    fn compile_object(
        &self,
        schema: &Map<String, Value>,
        _meta: Meta,
        tag: &str,
        root_ref: Option<&str>,
        stack: &mut Vec<String>,
    ) -> Result<String, String> {
        let required: HashSet<&str> = schema
            .get("required")
            .and_then(Value::as_array)
            .into_iter()
            .flatten()
            .filter_map(Value::as_str)
            .collect();
        let properties = schema.get("properties").and_then(Value::as_object);
        let partial = !self.options.with_implicit_required_props
            && properties.is_some()
            && required.is_empty();
        let mut rendered = Vec::new();
        if let Some(properties) = properties {
            for (name, property) in properties {
                let property_meta = Meta {
                    required: if partial {
                        true
                    } else if !required.is_empty() {
                        required.contains(name.as_str())
                    } else {
                        self.options.with_implicit_required_props
                    },
                    parent_partial: partial,
                };
                let mut code = self.compile(property, property_meta, tag, root_ref, stack)?;
                let actual = self.resolve_schema(property).unwrap_or(property);
                code.push_str(&chain(actual, property_meta, self.options));
                let property_name = quote_property(name);
                let circular = root_ref.is_some_and(|root| {
                    (!stack.is_empty() || self.circular_getters.contains(root))
                        && schema_reaches(property, root, self.resolver)
                });
                rendered.push(if circular {
                    format!("get {property_name}() {{ return {code} }}")
                } else {
                    format!("{property_name}: {code}")
                });
            }
        }
        let properties_code = if rendered.is_empty() {
            if properties.is_some() {
                "{  }".to_string()
            } else {
                "{}".to_string()
            }
        } else {
            format!("{{ {} }}", rendered.join(", "))
        };
        let partial_code = if partial { ".partial()" } else { "" };
        let additional = match schema.get("additionalProperties") {
            Some(Value::Object(object)) if !object.is_empty() => {
                let value = Value::Object(object.clone());
                let mut code = self.compile(
                    &value,
                    Meta {
                        required: true,
                        parent_partial: false,
                    },
                    tag,
                    root_ref,
                    stack,
                )?;
                code.push_str(&chain(
                    &value,
                    Meta {
                        required: true,
                        parent_partial: false,
                    },
                    self.options,
                ));
                format!(".catchall({code})")
            }
            Some(value) if value.as_bool() == Some(true) || value.as_object().is_some() => {
                ".catchall(z.any())".into()
            }
            _ => String::new(),
        };
        Ok(format!(
            "z.object({properties_code}){partial_code}{additional}{}",
            if self.options.all_readonly {
                ".readonly()"
            } else {
                ""
            }
        ))
    }

    fn compile_all_of(
        &self,
        items: &[Value],
        meta: Meta,
        tag: &str,
        root_ref: Option<&str>,
        stack: &mut Vec<String>,
    ) -> Result<String, String> {
        if items.len() == 1 {
            return self.compile(&items[0], meta, tag, root_ref, stack);
        }
        let mut standalone_required = Vec::new();
        let mut regular = Vec::new();
        for item in items {
            let broken = item.as_object().is_some_and(|object| {
                object.contains_key("required")
                    && !["type", "properties", "allOf", "anyOf", "oneOf"]
                        .iter()
                        .any(|key| object.contains_key(*key))
            });
            if broken {
                standalone_required.extend(
                    item.get("required")
                        .and_then(Value::as_array)
                        .into_iter()
                        .flatten()
                        .filter_map(Value::as_str)
                        .map(str::to_string),
                );
            } else {
                regular.push(item);
            }
        }
        let mut compiled = regular
            .iter()
            .map(|item| self.compile(item, meta, tag, root_ref, stack))
            .collect::<Result<Vec<_>, _>>()?;
        if !standalone_required.is_empty() {
            let mut properties = Map::new();
            for required in &standalone_required {
                let found = regular
                    .iter()
                    .find_map(|item| {
                        self.resolve_schema(item)
                            .and_then(|schema| schema.pointer(&format!("/properties/{required}")))
                    })
                    .cloned()
                    .unwrap_or_else(|| Value::Object(Map::new()));
                properties.insert(required.clone(), found);
            }
            let required_schema = serde_json::json!({"type":"object","properties":properties,"required":standalone_required});
            compiled.push(self.compile(&required_schema, meta, tag, root_ref, stack)?);
        }
        let Some(first) = compiled.first() else {
            return Ok("z.object({})".into());
        };
        let rest = compiled
            .iter()
            .skip(1)
            .map(|code| format!("...{code}.shape"))
            .collect::<Vec<_>>()
            .join(", ");
        Ok(format!("z.object({{ ...{first}.shape, {rest} }})"))
    }

    fn resolve_schema<'b>(&'b self, schema: &'b Value) -> Option<&'b Value> {
        let reference = schema.get("$ref")?.as_str()?;
        self.document.pointer(reference.strip_prefix('#')?)
    }

    fn schema_tag(&self, reference: &str) -> String {
        if !self.options.split_by_tags || self.options.models_in_common {
            return self.options.default_tag.clone();
        }
        let mut tags = self
            .resolver
            .schema_tags
            .get(reference)
            .cloned()
            .unwrap_or_default();
        if let Some(runtime) = self.runtime_tags.borrow().get(reference) {
            tags.extend(runtime.iter().cloned());
        }
        if tags.len() == 1 {
            tags.into_iter()
                .next()
                .unwrap_or_else(|| self.options.default_tag.clone())
        } else {
            self.options.default_tag.clone()
        }
    }
}

fn chain(schema: &Value, meta: Meta, options: &GenerateOptions) -> String {
    let mut chains = Vec::new();
    match schema.get("type").and_then(Value::as_str) {
        Some("string") if schema.get("enum").is_none() => {
            if let Some(value) = schema.get("minLength") {
                chains.push(format!("min({value})"));
            }
            if let Some(value) = schema.get("maxLength") {
                chains.push(format!("max({value})"));
            }
            if let Some(pattern) = schema.get("pattern").and_then(Value::as_str) {
                chains.push(format!(
                    "regex(/{}/)",
                    escape_pattern(pattern.trim_matches('/'))
                ));
            }
        }
        Some("number" | "integer") if schema.get("enum").is_none() => {
            if let Some(value) = schema.get("minimum") {
                chains.push(format!(
                    "{}({value})",
                    if schema.get("exclusiveMinimum").and_then(Value::as_bool) == Some(true) {
                        "gt"
                    } else {
                        "gte"
                    }
                ));
            } else if let Some(value) = schema
                .get("exclusiveMinimum")
                .filter(|value| value.is_number())
            {
                chains.push(format!("gt({value})"));
            }
            if let Some(value) = schema.get("maximum") {
                chains.push(format!(
                    "{}({value})",
                    if schema.get("exclusiveMaximum").and_then(Value::as_bool) == Some(true) {
                        "lt"
                    } else {
                        "lte"
                    }
                ));
            } else if let Some(value) = schema
                .get("exclusiveMaximum")
                .filter(|value| value.is_number())
            {
                chains.push(format!("lt({value})"));
            }
            if let Some(value) = schema
                .get("multipleOf")
                .filter(|value| value.as_f64() != Some(0.0))
            {
                chains.push(format!("multipleOf({value})"));
            }
        }
        Some("array") => {
            if let Some(value) = schema
                .get("minItems")
                .and_then(Value::as_u64)
                .filter(|value| *value > 0)
            {
                chains.push(format!("min({value})"));
            }
            if let Some(value) = schema
                .get("maxItems")
                .and_then(Value::as_u64)
                .filter(|value| *value > 0)
            {
                chains.push(format!("max({value})"));
            }
        }
        _ => {}
    }
    if options.with_description {
        if let Some(description) = schema
            .get("description")
            .and_then(Value::as_str)
            .filter(|value| !value.is_empty())
        {
            chains.push(format!(
                "describe({})",
                serde_json::to_string(description).unwrap_or_default()
            ));
        }
    }
    let nullable = schema
        .get("nullable")
        .and_then(Value::as_bool)
        .unwrap_or(false);
    if nullable && !meta.required {
        chains.push("nullish()".into());
    } else if nullable || (options.replace_optional_with_nullish && meta.parent_partial) {
        chains.push("nullable()".into());
    } else if !meta.required {
        chains.push(if options.replace_optional_with_nullish {
            "nullish()".into()
        } else {
            "optional()".into()
        });
    }
    if options.with_default_values {
        if let Some(value) = schema.get("default") {
            chains.push(format!(
                "default({})",
                if matches!(
                    schema.get("type").and_then(Value::as_str),
                    Some("number" | "integer")
                ) {
                    js_scalar(value)
                } else {
                    serde_json::to_string(value).unwrap_or_default()
                }
            ));
        }
    }
    if chains.is_empty() {
        String::new()
    } else {
        format!(".{}", chains.join("."))
    }
}

fn enum_code(schema: &Value) -> Option<String> {
    Some(format!(
        "z.enum([{}])",
        schema
            .get("enum")?
            .as_array()?
            .iter()
            .map(|value| if value.is_null() {
                "null".into()
            } else {
                format!(
                    "\"{}\"",
                    value
                        .as_str()
                        .map(str::to_string)
                        .unwrap_or_else(|| value.to_string())
                )
            })
            .collect::<Vec<String>>()
            .join(", ")
    ))
}
pub(crate) fn schema_name(name: &str, suffix: &str) -> String {
    let normalized = normalize_name(name);
    let capitalized = capitalize(&normalized);
    if capitalized.ends_with(suffix) {
        capitalized
    } else {
        format!("{capitalized}{suffix}")
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
    let mut result = String::new();
    let mut index = 0;
    while index < chars.len() {
        if chars[index] == '_'
            && index + 1 < chars.len()
            && (chars[index + 1].is_ascii_alphanumeric() || chars[index + 1] == '_')
        {
            result.extend(chars[index + 1].to_uppercase());
            index += 2;
        } else {
            result.push(chars[index]);
            index += 1;
        }
    }
    result
}
fn capitalize(value: &str) -> String {
    let mut chars = value.chars();
    chars
        .next()
        .map(|first| first.to_uppercase().chain(chars).collect())
        .unwrap_or_default()
}
fn autocorrect_ref(reference: &str) -> String {
    if reference.starts_with("#/") {
        reference.into()
    } else if let Some(rest) = reference.strip_prefix('#') {
        format!("#/{rest}")
    } else {
        reference.into()
    }
}
fn has_multiple_all_of(value: &Value) -> bool {
    value
        .get("allOf")
        .and_then(Value::as_array)
        .is_some_and(|items| items.len() > 1)
}
fn js_scalar(value: &Value) -> String {
    if let Some(value) = value.as_str() {
        value.trim_matches('"').to_string()
    } else {
        value.to_string()
    }
}
fn quote_property(value: &str) -> String {
    if value
        .chars()
        .next()
        .is_some_and(|first| first.is_ascii_alphabetic())
        && value
            .chars()
            .all(|character| character.is_ascii_alphanumeric() || character == '_')
    {
        value.into()
    } else {
        format!("\"{value}\"")
    }
}
fn escape_pattern(value: &str) -> String {
    value
        .replace('\t', "\\t")
        .replace('\n', "\\n")
        .replace('\r', "\\r")
        .replace('/', "\\/")
}

#[derive(Default)]
struct ExtractedEnumCandidate {
    last_segments: Vec<String>,
    tags: HashSet<String>,
}

fn collect_extracted_enums(
    document: &Value,
    resolver: &Resolver<'_>,
    options: &GenerateOptions,
    root_enums: &HashMap<String, String>,
) -> IndexMap<String, (String, String)> {
    if !options.extract_enums {
        return IndexMap::default();
    }
    let mut candidates: IndexMap<String, ExtractedEnumCandidate> = IndexMap::default();
    if let Some(schemas) = document
        .pointer("/components/schemas")
        .and_then(Value::as_object)
    {
        for (component_name, schema) in schemas {
            if schema.get("enum").is_some() {
                continue;
            }
            let reference = format!("#/components/schemas/{component_name}");
            let tags = resolver
                .schema_tags
                .get(&reference)
                .cloned()
                .unwrap_or_default();
            collect_inline_enum_candidates(schema, component_name, &tags, &mut candidates);
        }
    }
    // Codes backed by a canonical component enum never become separately extracted schemas.
    candidates.retain(|code, _| !root_enums.contains_key(code));

    let mut preliminary: IndexMap<String, (String, String)> = IndexMap::default();
    for (code, candidate) in candidates {
        let Some(common) = most_common_adjacent(&candidate.last_segments) else {
            continue;
        };
        let name = enum_schema_name(&common, &options.enum_suffix, &options.schema_suffix);
        let tag = if candidate.tags.len() == 1 {
            candidate
                .tags
                .iter()
                .next()
                .cloned()
                .unwrap_or_else(|| options.default_tag.clone())
        } else {
            options.default_tag.clone()
        };
        preliminary.insert(code, (name, tag));
    }
    preliminary
}

fn collect_inline_enum_candidates(
    schema: &Value,
    component_name: &str,
    tags: &HashSet<String>,
    candidates: &mut IndexMap<String, ExtractedEnumCandidate>,
) {
    let Some(object) = schema.as_object() else {
        return;
    };
    if object.contains_key("$ref") {
        return;
    }
    if let Some(properties) = object.get("properties").and_then(Value::as_object) {
        for (property_name, property) in properties {
            if let Some(code) = enum_code(property) {
                let candidate = candidates.entry(code).or_default();
                candidate.last_segments.push(property_name.clone());
                candidate.tags.extend(tags.iter().cloned());
            }
            collect_inline_enum_candidates(property, component_name, tags, candidates);
        }
    }
    for keyword in ["allOf", "anyOf", "oneOf"] {
        if let Some(items) = object.get(keyword).and_then(Value::as_array) {
            for item in items {
                if let Some(code) = enum_code(item) {
                    let candidate = candidates.entry(code).or_default();
                    candidate.last_segments.push(component_name.to_string());
                    candidate.tags.extend(tags.iter().cloned());
                }
                collect_inline_enum_candidates(item, component_name, tags, candidates);
            }
        }
    }
    if object.get("type").and_then(Value::as_str) == Some("array") {
        if let Some(item) = object.get("items") {
            if let Some(code) = enum_code(item) {
                let candidate = candidates.entry(code).or_default();
                candidate.last_segments.push(component_name.to_string());
                candidate.tags.extend(tags.iter().cloned());
            }
            collect_inline_enum_candidates(item, component_name, tags, candidates);
        }
    }
    if let Some(additional) = object
        .get("additionalProperties")
        .filter(|value| value.is_object())
    {
        collect_inline_enum_candidates(additional, component_name, tags, candidates);
    }
}

fn enum_schema_name(name: &str, enum_suffix: &str, schema_suffix: &str) -> String {
    let normalized = capitalize(&normalize_name(name));
    let suffix = format!("{enum_suffix}{schema_suffix}");
    if normalized.ends_with(&suffix) {
        normalized
    } else {
        format!("{normalized}{suffix}")
    }
}

fn most_common_adjacent(values: &[String]) -> Option<String> {
    const IGNORED: [&str; 8] = ["dto", "by", "for", "of", "in", "to", "and", "with"];
    let mut counts: HashMap<String, (usize, usize)> = HashMap::default();
    let mut order = 0usize;
    for value in values {
        let words = split_by_uppercase(&capitalize(value));
        for start in 0..words.len() {
            if IGNORED.contains(&words[start].to_ascii_lowercase().as_str()) {
                continue;
            }
            for end in start + 1..=words.len() {
                if IGNORED.contains(&words[end - 1].to_ascii_lowercase().as_str()) {
                    continue;
                }
                let combination = words[start..end].join("");
                let entry = counts.entry(combination).or_insert_with(|| {
                    order += 1;
                    (0, order)
                });
                entry.0 += 1;
            }
        }
    }
    counts
        .into_iter()
        .max_by(
            |(left, (left_count, left_order)), (right, (right_count, right_order))| {
                left_count
                    .cmp(right_count)
                    .then_with(|| left.len().cmp(&right.len()))
                    .then_with(|| right_order.cmp(left_order))
            },
        )
        .map(|(value, _)| value)
}

fn split_by_uppercase(value: &str) -> Vec<String> {
    let chars: Vec<char> = value.chars().collect();
    let mut words = Vec::new();
    let mut start = 0;
    for index in 1..chars.len() {
        if chars[index].is_ascii_uppercase() && !chars[index - 1].is_ascii_uppercase() {
            words.push(chars[start..index].iter().collect());
            start = index;
        }
    }
    if start < chars.len() {
        words.push(chars[start..].iter().collect());
    }
    words
        .into_iter()
        .filter(|word: &String| !word.is_empty())
        .collect()
}

fn collect_precompiled_circular_refs(document: &Value, resolver: &Resolver<'_>) -> HashSet<String> {
    let Some(schemas) = document
        .pointer("/components/schemas")
        .and_then(Value::as_object)
    else {
        return HashSet::default();
    };
    let indexes: HashMap<String, usize> = schemas
        .keys()
        .enumerate()
        .map(|(index, name)| (format!("#/components/schemas/{name}"), index))
        .collect();
    let mut result = HashSet::default();
    for (source_index, schema) in schemas.values().enumerate() {
        let mut refs = HashSet::default();
        collect_schema_refs(schema, &mut refs);
        for reference in refs {
            if indexes
                .get(&reference)
                .is_some_and(|target_index| *target_index > source_index)
                && resolver
                    .deep_dependencies
                    .get(&reference)
                    .is_some_and(|dependencies| dependencies.contains(&reference))
            {
                result.insert(reference);
            }
        }
    }
    result
}

fn collect_schema_refs(value: &Value, refs: &mut HashSet<String>) {
    match value {
        Value::Object(object) => {
            if let Some(reference) = object.get("$ref").and_then(Value::as_str) {
                refs.insert(autocorrect_ref(reference));
            }
            for child in object.values() {
                collect_schema_refs(child, refs);
            }
        }
        Value::Array(array) => {
            for child in array {
                collect_schema_refs(child, refs);
            }
        }
        _ => {}
    }
}

fn schema_reaches(schema: &Value, root: &str, resolver: &Resolver<'_>) -> bool {
    let mut refs = HashSet::default();
    collect_schema_refs(schema, &mut refs);
    refs.iter().any(|reference| {
        reference == root
            || resolver
                .deep_dependencies
                .get(reference)
                .is_some_and(|dependencies| dependencies.contains(root))
    })
}
