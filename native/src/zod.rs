use std::{borrow::Cow, cell::RefCell, collections::BTreeSet, rc::Rc};

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

/// Borrowed schema fields shared by primitive and composite compilation.
/// A type-array variant overrides only its type; the JSON tree is never copied.
#[derive(Clone, Copy)]
struct SchemaView<'a> {
    object: &'a Map<String, Value>,
    schema_type: Option<&'a Value>,
}
impl<'a> SchemaView<'a> {
    fn new(object: &'a Map<String, Value>) -> Self {
        Self {
            object,
            schema_type: object.get("type"),
        }
    }
    fn normalized_type(self) -> Option<Cow<'a, str>> {
        self.schema_type.and_then(Value::as_str).map(|value| {
            if value.bytes().any(|byte| byte.is_ascii_uppercase()) {
                Cow::Owned(value.to_ascii_lowercase())
            } else {
                Cow::Borrowed(value)
            }
        })
    }
}

pub struct ZodCompiler<'a> {
    document: &'a Value,
    options: &'a GenerateOptions,
    resolver: &'a Resolver<'a>,
    root_enums: HashMap<String, String>,
    extracted_enums: IndexMap<String, (String, String)>,
    extracted_enum_tags_by_name: HashMap<String, String>,
    extracted_enum_objects: Map<String, Value>,
    extracted_enum_usage_tags: HashMap<String, Vec<String>>,
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
        let (extracted_enums, extracted_enum_objects, extracted_enum_usage_tags) =
            collect_extracted_enums(document, resolver, options, &root_enums);
        let extracted_enum_tags_by_name = first_extracted_enum_tags(&extracted_enums);
        let circular_getters = collect_precompiled_circular_refs(document, resolver);
        Self {
            document,
            options,
            resolver,
            root_enums,
            extracted_enums,
            extracted_enum_tags_by_name,
            extracted_enum_objects,
            extracted_enum_usage_tags,
            circular_getters,
            runtime_tags,
        }
    }

    pub fn compile_components(&self) -> Result<Map<String, Value>, String> {
        self.compile_components_with_tags(&HashMap::default())
    }

    /// The `includeSchemas` components and every schema they depend on.
    fn included_schema_refs(&self) -> HashSet<String> {
        let mut refs = HashSet::default();
        for name in &self.options.include_schemas {
            let reference = format!("#/components/schemas/{name}");
            if let Some(dependencies) = self.resolver.deep_dependencies.get(&reference) {
                refs.extend(dependencies.iter().cloned());
            }
            refs.insert(reference);
        }
        refs
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
        let included = self.included_schema_refs();
        for (name, schema) in schemas {
            let zod_name = schema_name(name, &self.options.schema_suffix);
            let reference = format!("#/components/schemas/{name}");
            // Endpoints can use a component enum without referencing it (see `matching_component_enum_ref`).
            if self.options.exclude_redundant_zod_schemas
                && !self.resolver.schema_tags.contains_key(&reference)
                && !first_tags.contains_key(&reference)
                && !included.contains(&reference)
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

    /// The `#/components/schemas/…` ref of the component enum an inline string enum has the values of.
    /// The compiler renders such a schema by that enum's name, as the TypeScript renderer turns it into
    /// a `$ref`; endpoint schemas are then named like that `$ref` instead of getting a `…Param`/`…Body`
    /// alias.
    pub fn matching_component_enum_ref(&self, schema: &Value) -> Option<String> {
        let object = schema.as_object()?;
        if object.contains_key("$ref") || !self.options.extract_enums {
            return None;
        }
        let values = object.get("enum")?.as_array()?;
        let is_string = object
            .get("type")
            .and_then(Value::as_str)
            .is_some_and(|schema_type| schema_type.eq_ignore_ascii_case("string"));
        if !is_string || (self.options.models_in_modules && values.len() == 1) {
            return None;
        }
        let name = self.root_enums.get(&enum_code(schema)?)?;
        Some(format!(
            "#/components/schemas/{}",
            name.strip_suffix(&self.options.schema_suffix)
                .unwrap_or(name)
        ))
    }

    pub fn endpoint_chain(&self, schema: &Value, required: bool) -> String {
        let actual = self.resolve_schema(schema).unwrap_or(schema);
        chain(
            actual,
            Meta {
                required,
                parent_partial: false,
            },
            self.options,
        )
    }

    pub fn extracted_schema_codes(&self) -> Map<String, Value> {
        self.extracted_enums
            .iter()
            .map(|(code, (name, _))| (name.clone(), Value::String(code.clone())))
            .collect()
    }

    pub fn extracted_schema_objects(&self) -> Map<String, Value> {
        self.extracted_enum_objects.clone()
    }

    pub fn extracted_schema_tags(&self) -> HashMap<String, String> {
        self.extracted_enums
            .values()
            .map(|(name, tag)| (name.clone(), tag.clone()))
            .collect()
    }

    /// Every tag whose schemas use each extracted enum: its modules with `modelsInModules`.
    pub fn extracted_schema_usage_tags(&self) -> &HashMap<String, Vec<String>> {
        &self.extracted_enum_usage_tags
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
        if !reference.starts_with('#') {
            return Err(format!("Invalid ref: {reference}"));
        }
        let schema = self
            .resolver
            .resolve_ref(&reference)
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
                format!("{}.{zod_name}", self.models_namespace(&owner))
            } else {
                zod_name
            };
            return Ok(output);
        }

        let object = schema
            .as_object()
            .ok_or_else(|| "Schema must be an object".to_string())?;
        self.compile_view(SchemaView::new(object), meta, tag, root_ref, stack)
    }

    fn compile_view(
        &self,
        view: SchemaView<'_>,
        meta: Meta,
        tag: &str,
        root_ref: Option<&str>,
        stack: &mut Vec<String>,
    ) -> Result<String, String> {
        let object = view.object;
        if let Some(types) = view.schema_type.and_then(Value::as_array) {
            // A `null` member makes the schema of the other members nullable (`type: ["object",
            // "null"]`); its other keywords (`properties`, `items`, ...) only describe the
            // non-null members, so a null-only type array (`type: ["null"]`) is `z.null()`
            // whatever keywords it has.
            let non_null = types
                .iter()
                .filter(|schema_type| schema_type.as_str() != Some("null"))
                .collect::<Vec<_>>();
            if non_null.is_empty() {
                return Ok("z.null()".into());
            }
            let mut compiled = Vec::with_capacity(non_null.len());
            for schema_type in &non_null {
                let variant = SchemaView {
                    object,
                    schema_type: Some(schema_type),
                };
                compiled.push(self.compile_view(variant, meta, tag, root_ref, stack)?);
            }
            let code = if compiled.len() == 1 {
                compiled.remove(0)
            } else {
                format!("z.union([{}])", compiled.join(", "))
            };
            let nullable = if non_null.len() < types.len() {
                ".nullable()"
            } else {
                ""
            };
            return Ok(format!("{code}{nullable}"));
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
        if let Some(primitive) = self.compile_primitive(view, tag, root_ref)? {
            return Ok(primitive);
        }
        let schema_type = view.normalized_type();
        if schema_type.as_deref() == Some("array") {
            if let Some((items, rest)) = tuple_parts(object) {
                let required = object.get("minItems").and_then(Value::as_u64).unwrap_or(0) as usize;
                let item_meta = Meta {
                    required: true,
                    parent_partial: false,
                };
                // Like object properties, a referenced member gets the referenced schema's chain
                // (validation, nullability, default): the exported component omits its own chain.
                // Recursive members are deferred with `z.lazy`, like object properties.
                let mut member = |item: &Value| -> Result<String, String> {
                    let code = self.compile(item, item_meta, tag, root_ref, stack)?;
                    let actual = self.tuple_member_schema(item)?;
                    // The chain is applied to the deferred member: checks clone a `z.lazy` schema,
                    // and a clone created inside the declaration's own getter would recreate the
                    // declaration endlessly.
                    let code = if self.is_circular_member(item, root_ref, stack) {
                        format!("z.lazy(() => {code})")
                    } else {
                        code
                    };
                    Ok(format!("{code}{}", chain(actual, item_meta, self.options)))
                };
                let members = items
                    .iter()
                    .enumerate()
                    .map(|(index, item)| {
                        Ok(format!(
                            "{}{}",
                            member(item)?,
                            if index >= required { ".optional()" } else { "" }
                        ))
                    })
                    .collect::<Result<Vec<_>, String>>()?;
                let rest = match rest {
                    Some(Value::Bool(false)) => String::new(),
                    Some(value @ Value::Object(_)) => format!(".rest({})", member(value)?),
                    _ => ".rest(z.unknown())".into(),
                };
                return Ok(format!(
                    "z.tuple([{}]){rest}{}",
                    members.join(", "),
                    if self.options.all_readonly {
                        ".readonly()"
                    } else {
                        ""
                    }
                ));
            }
            let item = if let Some(items) = object.get("items").filter(|items| items.is_object()) {
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
                format!(
                    "{code}{}",
                    chain(
                        items,
                        Meta {
                            required: true,
                            parent_partial: false
                        },
                        self.options
                    )
                )
            } else {
                "z.unknown()".into()
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
        // An explicit `null` type ignores object keywords (`properties`, ...), which do not apply
        // to null.
        if schema_type.as_deref() == Some("null") {
            return Ok("z.null()".into());
        }
        if schema_type.as_deref() == Some("object")
            || object.contains_key("properties")
            || object.contains_key("additionalProperties")
        {
            return self.compile_object(object, meta, tag, root_ref, stack);
        }
        if schema_type.as_deref() == Some("any") {
            return Ok("z.unknown()".into());
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
        view: SchemaView<'_>,
        tag: &str,
        root_ref: Option<&str>,
    ) -> Result<Option<String>, String> {
        let schema = view.object;
        let Some(schema_type) = view.normalized_type() else {
            return Ok(None);
        };
        if !matches!(
            schema_type.as_ref(),
            "string" | "number" | "integer" | "boolean"
        ) {
            return Ok(None);
        }
        if let Some(values) = schema.get("enum").and_then(Value::as_array) {
            if schema_type == "string" {
                let code = enum_values_code(values);
                // Match the TypeScript renderer: module-local singleton uses do not
                // need a dependency on an enum declaration owned by another module.
                let inline_module_singleton = self.options.models_in_modules && values.len() == 1;
                if self.options.extract_enums && !inline_module_singleton {
                    if let Some(name) = self.root_enums.get(&code) {
                        let enum_ref = format!(
                            "#/components/schemas/{}",
                            name.strip_suffix(&self.options.schema_suffix)
                                .unwrap_or(name)
                        );
                        if root_ref != Some(enum_ref.as_str()) {
                            let owner = self.schema_tag(&enum_ref);
                            return Ok(Some(if self.options.ts_namespaces && owner != tag {
                                format!("{}.{name}", self.models_namespace(&owner))
                            } else {
                                name.clone()
                            }));
                        }
                    }
                    if let Some((name, owner)) = self.extracted_enums.get(&code) {
                        return Ok(Some(if self.options.ts_namespaces && owner != tag {
                            format!("{}.{name}", self.models_namespace(owner))
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
        Ok(Some(match schema_type.as_ref() {
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
                let circular = self.is_circular_member(property, root_ref, stack);
                rendered.push(if circular {
                    format!("{property_name}: z.lazy(() => {code})")
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
            Some(value @ Value::Object(object)) if !object.is_empty() => {
                let mut code = self.compile(
                    value,
                    Meta {
                        required: true,
                        parent_partial: false,
                    },
                    tag,
                    root_ref,
                    stack,
                )?;
                code.push_str(&chain(
                    value,
                    Meta {
                        required: true,
                        parent_partial: false,
                    },
                    self.options,
                ));
                if self.is_circular_member(value, root_ref, stack) {
                    format!(".catchall(z.lazy(() => {code}))")
                } else {
                    format!(".catchall({code})")
                }
            }
            Some(value) if value.as_bool() == Some(true) || value.as_object().is_some() => {
                ".catchall(z.unknown())".into()
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

    /// Whether an object member schema (property or additional properties) or a tuple member
    /// references the schema being declared, so it must be deferred with `z.lazy` to avoid reading
    /// the declaration while it is initialized.
    fn is_circular_member(&self, member: &Value, root_ref: Option<&str>, stack: &[String]) -> bool {
        root_ref.is_some_and(|root| {
            (!stack.is_empty() || self.circular_getters.contains(root))
                && schema_reaches(member, root, self.resolver)
        })
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
        let all_readonly = self.options.all_readonly;
        let rest = compiled
            .iter()
            .skip(1)
            .map(|code| format!("...{}", object_shape_code(code, all_readonly)))
            .collect::<Vec<_>>()
            .join(", ");
        Ok(format!(
            "z.object({{ ...{}, {rest} }}){}",
            object_shape_code(first, all_readonly),
            if all_readonly { ".readonly()" } else { "" }
        ))
    }

    /// The schema a tuple member's chain is built from: the referenced schema for a `$ref` member
    /// (`getTupleMemberSchemaObject`).
    fn tuple_member_schema<'b>(&'b self, member: &'b Value) -> Result<&'b Value, String> {
        let Some(reference) = member.get("$ref").and_then(Value::as_str) else {
            return Ok(member);
        };
        let reference = autocorrect_ref(reference);
        reference
            .starts_with('#')
            .then(|| self.resolver.resolve_ref(&reference))
            .flatten()
            .ok_or_else(|| format!("Schema {reference} not found"))
    }

    fn resolve_schema<'b>(&'b self, schema: &'b Value) -> Option<&'b Value> {
        let reference = schema.get("$ref")?.as_str()?;
        reference.strip_prefix('#')?;
        self.resolver.resolve_ref(reference)
    }

    fn models_namespace(&self, tag: &str) -> String {
        let suffix = self
            .options
            .configs
            .get("models")
            .map(|config| config.namespace_suffix.as_str())
            .unwrap_or("Models");
        format!("{}{suffix}", capitalize(tag))
    }

    fn schema_tag(&self, reference: &str) -> String {
        if !self.options.split_by_tags || self.options.models_in_common {
            return self.options.default_tag.clone();
        }
        // The TypeScript resolver looks extracted enums up by name first, so a component whose
        // schema name collides with an extracted enum takes that enum's tag.
        let name = schema_name(
            reference.rsplit('/').next().unwrap_or_default(),
            &self.options.schema_suffix,
        );
        if let Some(tag) = self.extracted_enum_tags_by_name.get(&name) {
            return tag.clone();
        }
        // Ownership depends on the union's cardinality, not on an allocated copy
        // of that union. Runtime tags remain live as endpoint registration proceeds.
        let runtime_tags = self.runtime_tags.borrow();
        let mut tags = self
            .resolver
            .schema_tags
            .get(reference)
            .into_iter()
            .flatten()
            .chain(runtime_tags.get(reference).into_iter().flatten());
        match tags.next() {
            Some(tag) if tags.all(|other| other == tag) => tag.clone(),
            _ => self.options.default_tag.clone(),
        }
    }
}

fn first_extracted_enum_tags(
    enums: &IndexMap<String, (String, String)>,
) -> HashMap<String, String> {
    let mut tags = HashMap::default();
    for (name, tag) in enums.values() {
        tags.entry(name.clone()).or_insert_with(|| tag.clone());
    }
    tags
}

/// The `shape` of an allOf member object schema. With `allReadonly` object schemas are wrapped in
/// `.readonly()`, which has no `shape`: inline members are merged before being made readonly, and
/// referenced members are unwrapped. The merged object is made readonly instead. Mirrors
/// `getObjectShapeCode` in src/generators/core/zod/getZodSchema.ts.
fn object_shape_code(code: &str, all_readonly: bool) -> String {
    if !all_readonly {
        return format!("{code}.shape");
    }
    match code.strip_suffix(".readonly()") {
        Some(object) => format!("{object}.shape"),
        None => format!("{code}.unwrap().shape"),
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
                let pattern = if pattern.starts_with('/') && pattern.ends_with('/') {
                    &pattern[1..pattern.len().saturating_sub(1).max(1)]
                } else {
                    pattern
                };
                chains.push(format!("regex(/{}/)", escape_pattern(pattern)));
            }
        }
        Some("number" | "integer") if schema.get("enum").is_none() => {
            if let Some(value) = schema.get("minimum") {
                chains.push(format!(
                    "{}({})",
                    if schema.get("exclusiveMinimum").and_then(Value::as_bool) == Some(true) {
                        "gt"
                    } else {
                        "gte"
                    },
                    js_number(value)
                ));
            } else if let Some(value) = schema
                .get("exclusiveMinimum")
                .filter(|value| value.is_number())
            {
                chains.push(format!("gt({})", js_number(value)));
            }
            if let Some(value) = schema.get("maximum") {
                chains.push(format!(
                    "{}({})",
                    if schema.get("exclusiveMaximum").and_then(Value::as_bool) == Some(true) {
                        "lt"
                    } else {
                        "lte"
                    },
                    js_number(value)
                ));
            } else if let Some(value) = schema
                .get("exclusiveMaximum")
                .filter(|value| value.is_number())
            {
                chains.push(format!("lt({})", js_number(value)));
            }
            if let Some(value) = schema
                .get("multipleOf")
                .filter(|value| value.as_f64() != Some(0.0))
            {
                chains.push(format!("multipleOf({})", js_number(value)));
            }
        }
        Some("array") => {
            // Tuples have no `min`/`max`; neither do arrays wrapped in `.readonly()` (`allReadonly`),
            // so their length checks are refinements. Mirrors `getZodChainableArrayValidations`.
            let refine = is_tuple(schema) || options.all_readonly;
            if let Some(value) = schema
                .get("minItems")
                .and_then(Value::as_u64)
                .filter(|value| *value > 0)
            {
                chains.push(if refine {
                    format!("refine((value) => value.length >= {value})")
                } else {
                    format!("min({value})")
                });
            }
            if let Some(value) = schema
                .get("maxItems")
                .and_then(Value::as_u64)
                .filter(|value| *value > 0)
            {
                chains.push(if refine {
                    format!("refine((value) => value.length <= {value})")
                } else {
                    format!("max({value})")
                });
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

pub(crate) fn enum_code(schema: &Value) -> Option<String> {
    Some(enum_values_code(schema.get("enum")?.as_array()?))
}

fn enum_values_code(values: &[Value]) -> String {
    let mut code = String::from("z.enum([");
    let mut first = true;
    for value in values.iter().filter(|value| !value.is_null()) {
        if !first {
            code.push_str(", ");
        }
        first = false;
        match value.as_str() {
            Some(text) => code.push_str(&string_literal(text)),
            None => code.push_str(&string_literal(&value.to_string())),
        }
    }
    code.push_str("])");
    code
}

/// A double-quoted, escaped TypeScript string literal; byte-identical to JavaScript's `JSON.stringify`.
pub(crate) fn string_literal(value: &str) -> String {
    serde_json::to_string(value).unwrap_or_else(|_| "\"\"".into())
}

/// Positional array items and the schema for the elements after them, mirroring the TypeScript
/// `getTupleSchemaParts`: OpenAPI 3.1 `prefixItems` (rest from `items`), the older `items: [...]`
/// form (rest from `additionalItems`), or `items: false` (an empty tuple). A missing rest allows
/// unknown elements; `false` closes the tuple.
pub(crate) fn tuple_parts(schema: &Map<String, Value>) -> Option<(&[Value], Option<&Value>)> {
    if let Some(items) = schema.get("prefixItems").and_then(Value::as_array) {
        let rest = schema.get("items").filter(|rest| !rest.is_array());
        return Some((items.as_slice(), rest));
    }
    if let Some(items) = schema.get("items").and_then(Value::as_array) {
        return Some((items.as_slice(), schema.get("additionalItems")));
    }
    if schema.get("items") == Some(&Value::Bool(false)) {
        return Some((&[], Some(&Value::Bool(false))));
    }
    None
}

/// The element schemas of an array, in the order the TypeScript `iterateSchema` visits them:
/// tuple members and then a rest schema, or the single `items` schema.
pub(crate) fn array_item_schemas(schema: &Map<String, Value>) -> Vec<&Value> {
    match tuple_parts(schema) {
        Some((items, rest)) => items
            .iter()
            .chain(rest.filter(|rest| rest.is_object()))
            .collect(),
        None => schema.get("items").into_iter().collect(),
    }
}

/// Whether `key` is an array keyword (`items`, `prefixItems`, `additionalItems`) on a schema whose
/// declared `type` does not permit arrays. The TypeScript `iterateSchema` only follows array members
/// when `hasSchemaType(schema, "array")`, so generic JSON walkers skip such stray keywords. Objects
/// without a string (or string array) `type` are left alone, since a walker cannot tell a schema
/// from e.g. a `properties` map with a property named `items`.
pub(crate) fn is_stray_array_keyword(object: &Map<String, Value>, key: &str) -> bool {
    matches!(key, "items" | "prefixItems" | "additionalItems")
        && matches!(
            object.get("type"),
            Some(Value::String(_)) | Some(Value::Array(_))
        )
        && !object_has_schema_type(object, "array")
}

/// `hasSchemaType`: whether `type` permits `schema_type`, also for OpenAPI 3.1 type arrays
/// (`type: ["array", "null"]`).
pub(crate) fn has_schema_type(schema: &Value, schema_type: &str) -> bool {
    schema
        .as_object()
        .is_some_and(|object| object_has_schema_type(object, schema_type))
}

pub(crate) fn object_has_schema_type(object: &Map<String, Value>, schema_type: &str) -> bool {
    match object.get("type") {
        Some(Value::String(value)) => value == schema_type,
        Some(Value::Array(types)) => types
            .iter()
            .any(|value| value.as_str() == Some(schema_type)),
        _ => false,
    }
}

fn is_tuple(schema: &Value) -> bool {
    schema
        .as_object()
        .is_some_and(|object| tuple_parts(object).is_some())
}
pub(crate) fn schema_name(name: &str, suffix: &str) -> String {
    // Most references already have simple ASCII names. Keep them in one buffer
    // instead of allocating sanitized text, a character vector, and capitalized text.
    let trimmed = name.trim();
    if !trimmed.is_empty() && trimmed.bytes().all(|byte| byte.is_ascii_alphanumeric()) {
        let mut result = String::with_capacity(trimmed.len() + suffix.len());
        result.push_str(trimmed);
        result[..1].make_ascii_uppercase();
        if !result.ends_with(suffix) {
            result.push_str(suffix);
        }
        return result;
    }
    let mut capitalized = capitalize(&normalize_name(name));
    if !capitalized.ends_with(suffix) {
        capitalized.push_str(suffix);
    }
    capitalized
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
/// A JSON number as JavaScript's `Number.prototype.toString` prints it (`0.000001`, `1e-7`,
/// `1e+21`), which the TypeScript generator interpolates into validation chains.
pub(crate) fn js_number(value: &Value) -> String {
    let Some(number) = value.as_number() else {
        return value.to_string();
    };
    if number.is_i64() || number.is_u64() {
        return number.to_string();
    }
    let Some(float) = number.as_f64().filter(|float| float.is_finite()) else {
        return number.to_string();
    };
    if float == 0.0 {
        return "0".into();
    }
    let sign = if float < 0.0 { "-" } else { "" };
    // `{:e}` prints the shortest round-tripping digits, e.g. `1.5e-7`.
    let scientific = format!("{:e}", float.abs());
    let (mantissa, exponent) = scientific.split_once('e').unwrap_or((&scientific, "0"));
    let digits = mantissa.replace('.', "");
    let k = digits.len() as i32;
    let n = exponent.parse::<i32>().unwrap_or(0) + 1;
    let body = if k <= n && n <= 21 {
        format!("{digits}{}", "0".repeat((n - k) as usize))
    } else if 0 < n && n <= 21 {
        format!("{}.{}", &digits[..n as usize], &digits[n as usize..])
    } else if -6 < n && n <= 0 {
        format!("0.{}{digits}", "0".repeat((-n) as usize))
    } else {
        let exponent = n - 1;
        let exponent_sign = if exponent < 0 { "-" } else { "+" };
        let mantissa = if k == 1 {
            digits.clone()
        } else {
            format!("{}.{}", &digits[..1], &digits[1..])
        };
        format!("{mantissa}e{exponent_sign}{}", exponent.abs())
    };
    format!("{sign}{body}")
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
    let mut result = String::with_capacity(value.len());
    let mut escaped = false;
    for character in value.chars() {
        match character {
            '\t' => result.push_str("\\t"),
            '\n' => result.push_str("\\n"),
            '\r' => result.push_str("\\r"),
            '/' if !escaped => result.push_str("\\/"),
            _ => result.push(character),
        }
        // Only an odd number of consecutive backslashes escapes the next slash.
        escaped = character == '\\' && !escaped;
    }
    result
}

#[derive(Default)]
struct ExtractedEnumCandidate {
    name_segments: Vec<Vec<String>>,
    tags: HashSet<String>,
    schema_object: Map<String, Value>,
}

fn collect_extracted_enums(
    document: &Value,
    resolver: &Resolver<'_>,
    options: &GenerateOptions,
    root_enums: &HashMap<String, String>,
) -> (
    IndexMap<String, (String, String)>,
    Map<String, Value>,
    HashMap<String, Vec<String>>,
) {
    if !options.extract_enums {
        return (IndexMap::default(), Map::new(), HashMap::default());
    }
    let mut candidates: IndexMap<String, ExtractedEnumCandidate> = IndexMap::default();
    collect_operation_enum_candidates(document, resolver, &mut candidates);
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
            collect_inline_enum_candidates(
                schema,
                &[component_name.clone()],
                &tags,
                &mut candidates,
            );
        }
    }
    // Codes backed by a canonical component enum never become separately extracted schemas.
    candidates.retain(|code, _| !root_enums.contains_key(code));

    let mut preliminary: IndexMap<String, (String, String)> = IndexMap::default();
    for (code, candidate) in &candidates {
        let last_segments = candidate
            .name_segments
            .iter()
            .filter_map(|segments| segments.last().cloned())
            .collect::<Vec<_>>();
        let Some(common) = most_common_adjacent(&last_segments) else {
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
        preliminary.insert(code.clone(), (name, tag));
    }
    disambiguate_enum_names(&mut preliminary, &candidates, options);
    let objects = preliminary
        .iter()
        .map(|(code, (name, _))| {
            (
                name.clone(),
                Value::Object(candidates[code].schema_object.clone()),
            )
        })
        .collect();
    let usage_tags = preliminary
        .iter()
        .map(|(code, (name, _))| {
            let mut tags = candidates[code].tags.iter().cloned().collect::<Vec<_>>();
            tags.sort();
            (name.clone(), tags)
        })
        .collect();
    (preliminary, objects, usage_tags)
}

fn disambiguate_enum_names(
    preliminary: &mut IndexMap<String, (String, String)>,
    candidates: &IndexMap<String, ExtractedEnumCandidate>,
    options: &GenerateOptions,
) {
    let mut by_name: HashMap<String, BTreeSet<usize>> = HashMap::default();
    for (index, (name, _)) in preliminary.values().enumerate() {
        by_name.entry(name.clone()).or_default().insert(index);
    }
    // Match JavaScript's progressive disambiguation. Renames update the index immediately:
    // a later candidate can collide with a name produced earlier in the same depth pass.
    for depth in 2..=6 {
        if by_name.values().all(|indices| indices.len() < 2) {
            break;
        }
        for index in 0..preliminary.len() {
            let indices = &by_name[&preliminary[index].0];
            if indices.len() < 2 {
                continue;
            }
            // Snapshot in original candidate order, even while this group's names change.
            let duplicates: Vec<usize> = indices.iter().copied().collect();
            for other in duplicates {
                let (code, (name, _)) = preliminary.get_index_mut(other).unwrap();
                let preceding: Vec<String> = candidates[code]
                    .name_segments
                    .iter()
                    .filter_map(|segments| {
                        segments
                            .len()
                            .checked_sub(depth)
                            .map(|i| segments[i].clone())
                    })
                    .collect();
                let prefix = if preceding.len() == 1 {
                    preceding.first().cloned()
                } else {
                    most_common_adjacent(&preceding)
                };
                if let Some(prefix) = prefix {
                    let next = format!("{}{name}", sanitize_enum_segment(&prefix));
                    if next != *name {
                        let indices = by_name.get_mut(name).unwrap();
                        indices.remove(&other);
                        if indices.is_empty() {
                            by_name.remove(name);
                        }
                        by_name.entry(next.clone()).or_default().insert(other);
                        *name = next;
                    }
                }
            }
        }
    }
    let duplicates: Vec<usize> = (0..preliminary.len())
        .filter(|&index| by_name[&preliminary[index].0].len() > 1)
        .collect();
    for index in duplicates {
        let (code, (name, _)) = preliminary.get_index_mut(index).unwrap();
        let full_name = candidates[code].name_segments[0]
            .iter()
            .map(|segment| sanitize_enum_segment(segment))
            .collect::<String>();
        *name = enum_schema_name(&full_name, &options.enum_suffix, &options.schema_suffix);
    }
}

fn sanitize_enum_segment(segment: &str) -> String {
    capitalize(segment)
        .replace("Dto", "")
        .replace("DTO", "")
        .replace("Response", "")
        .replace("Request", "")
}

fn collect_operation_enum_candidates(
    document: &Value,
    resolver: &Resolver<'_>,
    candidates: &mut IndexMap<String, ExtractedEnumCandidate>,
) {
    fn resolve<'a>(document: &'a Value, value: &'a Value) -> &'a Value {
        value
            .get("$ref")
            .and_then(Value::as_str)
            .and_then(|reference| document.pointer(reference.trim_start_matches('#')))
            .unwrap_or(value)
    }
    let mut name_counts = HashMap::default();
    for operation in &resolver.operations {
        *name_counts.entry(operation.name.as_str()).or_insert(0usize) += 1;
    }
    for operation in &resolver.operations {
        let unique = name_counts[operation.name.as_str()] == 1;
        let operation_name = normalize_name(&if unique {
            operation.name.clone()
        } else {
            format!("{}_{}", operation.tag, operation.name)
        });
        let tags = HashSet::from_iter([operation.tag.clone()]);
        let mut parameters: IndexMap<String, &Value> = IndexMap::default();
        for source in [
            operation.path_parameters,
            operation.operation.get("parameters"),
        ]
        .into_iter()
        .flatten()
        {
            for parameter in source.as_array().into_iter().flatten() {
                let key = parameter
                    .get("$ref")
                    .or_else(|| parameter.get("name"))
                    .and_then(Value::as_str)
                    .unwrap_or_default();
                parameters.insert(key.to_string(), parameter);
            }
        }
        for parameter in parameters.values() {
            let parameter = resolve(document, parameter);
            if let Some(schema) = parameter.get("schema") {
                let segments = vec![
                    operation_name.clone(),
                    parameter
                        .get("name")
                        .and_then(Value::as_str)
                        .unwrap_or_default()
                        .to_string(),
                ];
                add_enum_candidate(schema, &segments, &tags, candidates);
                collect_inline_enum_candidates(schema, &segments, &tags, candidates);
            }
        }
        if let Some(body) = operation.operation.get("requestBody") {
            let body = resolve(document, body);
            if let Some(content) = body.get("content").and_then(Value::as_object) {
                if let Some((_, media)) = content.iter().find(|(media, _)| {
                    (media.contains("application/") && media.contains("json"))
                        || media.contains("text/")
                        || matches!(
                            media.as_str(),
                            "application/x-www-form-urlencoded"
                                | "multipart/form-data"
                                | "application/octet-stream"
                                | "*/*"
                        )
                }) {
                    if let Some(schema) = media.get("schema") {
                        collect_inline_enum_candidates(
                            schema,
                            &[format!("{operation_name}Body")],
                            &tags,
                            candidates,
                        );
                    }
                }
            }
        }
        if let Some(responses) = operation
            .operation
            .get("responses")
            .and_then(Value::as_object)
        {
            for (status, response) in responses {
                let response = resolve(document, response);
                if let Some(content) = response.get("content").and_then(Value::as_object) {
                    if let Some((_, media)) = content
                        .iter()
                        .find(|(_, media)| media.get("schema").is_some())
                        .or_else(|| {
                            content
                                .iter()
                                .find(|(media, _)| media.starts_with("application/"))
                        })
                    {
                        if let Some(schema) = media.get("schema") {
                            let name = if status == "default"
                                || status
                                    .parse::<u16>()
                                    .is_ok_and(|status| (200..300).contains(&status))
                            {
                                format!("{operation_name}Response")
                            } else {
                                format!("{operation_name}{status}ErrorResponse")
                            };
                            collect_inline_enum_candidates(schema, &[name], &tags, candidates);
                        }
                    }
                }
            }
        }
    }
}

fn add_enum_candidate(
    schema: &Value,
    segments: &[String],
    tags: &HashSet<String>,
    candidates: &mut IndexMap<String, ExtractedEnumCandidate>,
) {
    if let Some(code) = enum_code(schema) {
        let candidate = candidates.entry(code).or_default();
        candidate.name_segments.push(segments.to_vec());
        if let Some(object) = schema.as_object() {
            candidate.schema_object.extend(object.clone());
        }
        candidate.tags.extend(tags.iter().cloned());
    }
}

fn collect_inline_enum_candidates(
    schema: &Value,
    segments: &[String],
    tags: &HashSet<String>,
    candidates: &mut IndexMap<String, ExtractedEnumCandidate>,
) {
    let Some(object) = schema.as_object() else {
        return;
    };
    if object.contains_key("$ref") || object.contains_key("x-domain-error-domain") {
        return;
    }
    if let Some(items) = object
        .get("allOf")
        .or_else(|| object.get("anyOf"))
        .or_else(|| object.get("oneOf"))
        .and_then(Value::as_array)
    {
        for item in items {
            add_enum_candidate(item, segments, tags, candidates);
            collect_inline_enum_candidates(item, segments, tags, candidates);
        }
    }
    if let Some(properties) = object.get("properties").and_then(Value::as_object) {
        for (property_name, property) in properties {
            let mut property_segments = segments.to_vec();
            property_segments.push(property_name.clone());
            add_enum_candidate(property, &property_segments, tags, candidates);
            // The JS schema iterator carries the original context into nested schemas.
            collect_inline_enum_candidates(property, segments, tags, candidates);
        }
    }
    if let Some(additional) = object
        .get("additionalProperties")
        .filter(|value| value.is_object())
    {
        add_enum_candidate(additional, segments, tags, candidates);
        collect_inline_enum_candidates(additional, segments, tags, candidates);
    }
    if object_has_schema_type(object, "array") {
        for item in array_item_schemas(object) {
            add_enum_candidate(item, segments, tags, candidates);
            collect_inline_enum_candidates(item, segments, tags, candidates);
        }
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
                .is_some_and(|target_index| *target_index >= source_index)
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
            for (key, child) in object {
                if !is_stray_array_keyword(object, key) {
                    collect_schema_refs(child, refs);
                }
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
    match schema {
        Value::Object(object) => {
            if let Some(reference) = object.get("$ref").and_then(Value::as_str) {
                let reference = autocorrect_ref(reference);
                if reference == root
                    || resolver
                        .deep_dependencies
                        .get(&reference)
                        .is_some_and(|dependencies| dependencies.contains(root))
                {
                    return true;
                }
            }
            object.iter().any(|(key, value)| {
                !is_stray_array_keyword(object, key) && schema_reaches(value, root, resolver)
            })
        }
        Value::Array(values) => values
            .iter()
            .any(|value| schema_reaches(value, root, resolver)),
        _ => false,
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    fn disambiguated_names(cases: &[(&str, &[&str])]) -> Vec<String> {
        let options: GenerateOptions = serde_json::from_value(json!({})).unwrap();
        let mut names = IndexMap::default();
        let mut candidates = IndexMap::default();
        for (index, (name, segments)) in cases.iter().enumerate() {
            let code = format!("z.enum([\"{index}\"])");
            names.insert(code.clone(), (name.to_string(), "Tag".to_string()));
            candidates.insert(
                code,
                ExtractedEnumCandidate {
                    name_segments: vec![
                        segments.iter().map(|segment| segment.to_string()).collect(),
                    ],
                    ..Default::default()
                },
            );
        }
        disambiguate_enum_names(&mut names, &candidates, &options);
        names.into_values().map(|(name, _)| name).collect()
    }

    #[test]
    fn borrowed_type_variants_preserve_original_schema_and_case_rules() {
        let document = json!({});
        let options: GenerateOptions = serde_json::from_value(json!({})).unwrap();
        let resolver = Resolver::new(&document, &options).unwrap();
        let compiler = ZodCompiler::new(&document, &options, &resolver);
        let schema = json!({"type":["STRING","null"], "format":"email", "description":"literal STRING null"});
        let original = schema.clone();
        assert_eq!(
            compiler
                .compile_endpoint_schema(&schema, true, "Tag")
                .unwrap()
                .0,
            "z.email().nullable()"
        );
        assert_eq!(schema, original);
        let schema =
            json!({"type":["string","number"], "properties":{"ignored":{"type":"boolean"}}});
        assert_eq!(
            compiler
                .compile_endpoint_schema(&schema, true, "Tag")
                .unwrap()
                .0,
            "z.union([z.string(), z.number()])"
        );
    }

    #[test]
    fn schema_names_preserve_normalization_and_suffix_boundaries() {
        for (name, suffix, expected) in [
            ("pet", "Schema", "PetSchema"),
            (" PetSchema ", "Schema", "PetSchema"),
            ("1pet", "Schema", "1petSchema"),
            ("pet", "", "Pet"),
            ("", "Schema", "Schema"),
            ("pet", "Pet", "Pet"),
            ("pet", "pet", "Petpet"),
            ("a__b", "Schema", "A_bSchema"),
            ("a---b", "Schema", "ABSchema"),
            ("éclair", "Schema", "ClairSchema"),
        ] {
            assert_eq!(schema_name(name, suffix), expected);
        }
    }

    #[test]
    fn borrowed_enum_values_preserve_null_filtering_and_literal_escaping() {
        assert_eq!(
            enum_code(&json!({"enum": [null, "a\\b", "c\"d", 2, true]})),
            Some(r#"z.enum(["a\\b", "c\"d", "2", "true"])"#.to_string())
        );
        assert_eq!(
            enum_code(&json!({"enum": [null]})),
            Some("z.enum([])".to_string())
        );
        assert_eq!(enum_code(&json!({"enum": "invalid"})), None);
    }

    #[test]
    fn enum_renaming_handles_new_collisions_in_the_same_pass_in_candidate_order() {
        let names = disambiguated_names(&[
            ("FooEnumSchema", &["Bar", "x"]),
            ("FooEnumSchema", &["Baz", "x"]),
            ("BarFooEnumSchema", &["Qux", "x"]),
        ]);
        // The third candidate collides with the first candidate's newly prefixed name,
        // and both are renamed again during depth two, despite index zero having passed.
        assert_eq!(
            names,
            [
                "BarBarFooEnumSchema",
                "BazFooEnumSchema",
                "QuxBarFooEnumSchema"
            ]
        );
    }

    #[test]
    fn enum_fallback_snapshots_persistent_collisions_before_replacing_names() {
        let names = disambiguated_names(&[
            ("FooEnumSchema", &["Root", "x"]),
            ("FooEnumSchema", &["Root", "x"]),
            ("RootXEnumSchema", &["Solo"]),
        ]);
        // Fallback can create another collision; the previously unique third candidate
        // must not be reclassified and renamed to SoloEnumSchema during this final pass.
        assert_eq!(
            names,
            ["RootXEnumSchema", "RootXEnumSchema", "RootXEnumSchema"]
        );
    }

    #[test]
    fn unique_enum_names_and_first_canonical_component_are_preserved() {
        assert_eq!(
            disambiguated_names(&[("UniqueEnumSchema", &["Unused", "x"])]),
            ["UniqueEnumSchema"]
        );
        let document = json!({"components": {"schemas": {
            "FirstStatus": {"type": "string", "enum": ["a", "b"]},
            "SecondStatus": {"type": "string", "enum": ["a", "b"]},
            "Container": {"type": "object", "properties": {
                "status": {"type": "string", "enum": ["a", "b"]}
            }}
        }}});
        let options: GenerateOptions = serde_json::from_value(json!({})).unwrap();
        let resolver = Resolver::new(&document, &options).unwrap();
        let compiler = ZodCompiler::new(&document, &options, &resolver);
        assert_eq!(
            compiler.matching_component_enum_ref(&json!({"type": "string", "enum": ["a", "b"]})),
            Some("#/components/schemas/FirstStatus".to_string())
        );
        assert!(compiler.extracted_enums.is_empty());
    }

    #[test]
    fn schema_ownership_reads_current_runtime_tags_without_caching() {
        let document = json!({});
        let options: GenerateOptions = serde_json::from_value(json!({})).unwrap();
        let reference = "#/components/schemas/Item";
        for initial in [vec![], vec!["First"], vec!["First", "Second"]] {
            let mut resolver = Resolver::new(&document, &options).unwrap();
            resolver.schema_tags.insert(
                reference.to_string(),
                initial.iter().map(|tag| tag.to_string()).collect(),
            );
            let runtime_tags = Rc::new(RefCell::new(HashMap::default()));
            let compiler = ZodCompiler::new_with_runtime_tags(
                &document,
                &options,
                &resolver,
                runtime_tags.clone(),
            );
            assert_eq!(
                compiler.schema_tag(reference),
                if initial.len() == 1 {
                    "First"
                } else {
                    &options.default_tag
                }
            );
            runtime_tags.borrow_mut().insert(
                reference.to_string(),
                HashSet::from_iter(["First".to_string()]),
            );
            assert_eq!(
                compiler.schema_tag(reference),
                if initial.len() < 2 {
                    "First"
                } else {
                    &options.default_tag
                }
            );
            runtime_tags
                .borrow_mut()
                .get_mut(reference)
                .unwrap()
                .insert("Second".to_string());
            assert_eq!(compiler.schema_tag(reference), options.default_tag);
        }
    }

    #[test]
    fn extracted_enum_name_collisions_keep_first_owner_before_component_tags() {
        let document = json!({});
        let options: GenerateOptions = serde_json::from_value(json!({})).unwrap();
        let reference = "#/components/schemas/StatusEnum";
        let mut resolver = Resolver::new(&document, &options).unwrap();
        resolver.schema_tags.insert(
            reference.to_string(),
            HashSet::from_iter(["Component".to_string()]),
        );
        let mut compiler = ZodCompiler::new(&document, &options, &resolver);
        let enums = IndexMap::from_iter([
            (
                "z.enum([\"first\"])".to_string(),
                ("StatusEnumSchema".to_string(), "First".to_string()),
            ),
            (
                "z.enum([\"second\"])".to_string(),
                ("StatusEnumSchema".to_string(), "Second".to_string()),
            ),
        ]);
        compiler.extracted_enum_tags_by_name = first_extracted_enum_tags(&enums);
        compiler.runtime_tags.borrow_mut().insert(
            reference.to_string(),
            HashSet::from_iter(["Runtime".to_string()]),
        );
        assert_eq!(compiler.schema_tag(reference), "First");
    }

    #[test]
    fn formats_numbers_like_javascript() {
        for (value, expected) in [
            (json!(0.000001), "0.000001"),
            (json!(0.0000001), "1e-7"),
            (json!(1.5e-7), "1.5e-7"),
            (json!(0.1), "0.1"),
            (json!(-2.5), "-2.5"),
            (json!(100.0), "100"),
            (json!(1e21), "1e+21"),
            (json!(1.25e22), "1.25e+22"),
            (json!(123456789012345680000.0), "123456789012345680000"),
            (json!(42), "42"),
            (json!(-9007199254740991_i64), "-9007199254740991"),
        ] {
            assert_eq!(js_number(&value), expected, "{value}");
        }
    }

    #[test]
    fn detects_stray_array_keywords() {
        let stray = json!({ "type": "string", "items": {} });
        let array = json!({ "type": ["array", "null"], "items": {} });
        let untyped = json!({ "items": {} });
        let properties_map = json!({ "type": { "type": "string" }, "items": {} });
        assert!(is_stray_array_keyword(stray.as_object().unwrap(), "items"));
        assert!(!is_stray_array_keyword(
            stray.as_object().unwrap(),
            "properties"
        ));
        assert!(!is_stray_array_keyword(array.as_object().unwrap(), "items"));
        assert!(!is_stray_array_keyword(
            untyped.as_object().unwrap(),
            "items"
        ));
        assert!(!is_stray_array_keyword(
            properties_map.as_object().unwrap(),
            "items"
        ));
    }
}
