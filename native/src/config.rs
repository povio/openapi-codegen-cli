use std::collections::HashMap;

use serde::Deserialize;

#[derive(Clone, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GenerateConfig {
    #[serde(default)]
    pub output_file_name_suffix: String,
    #[serde(default)]
    pub namespace_suffix: String,
}

#[derive(Clone, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct InfiniteQueryResponseParamNames {
    #[serde(default = "default_page")]
    pub page: String,
    #[serde(default = "default_total_items")]
    pub total_items: String,
    #[serde(default = "default_limit")]
    pub limit: String,
}

#[derive(Clone, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct InfiniteQueryParamNames {
    #[serde(default = "default_page")]
    pub page: String,
}

#[derive(Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GenerateOptions {
    #[serde(default = "default_true")]
    pub split_by_tags: bool,
    #[serde(default = "default_tag")]
    pub default_tag: String,
    #[serde(default)]
    pub include_tags: Vec<String>,
    #[serde(default)]
    pub exclude_tags: Vec<String>,
    #[serde(default)]
    pub exclude_path_regex: String,
    #[serde(default)]
    pub with_deprecated_endpoints: bool,
    #[serde(default = "default_true")]
    pub ts_namespaces: bool,
    #[serde(default)]
    pub tree_shakeable_namespaces: bool,
    #[serde(default = "default_remove_prefix")]
    pub remove_operation_prefix_ending_with: String,
    #[serde(default = "default_schema_suffix")]
    pub schema_suffix: String,
    #[serde(default)]
    pub models_in_common: bool,
    #[serde(default)]
    pub models_in_modules: bool,
    #[serde(default)]
    pub with_implicit_required_props: bool,
    #[serde(default = "default_true")]
    pub with_default_values: bool,
    #[serde(default)]
    pub with_description: bool,
    #[serde(default)]
    pub all_readonly: bool,
    #[serde(default = "default_true")]
    pub extract_enums: bool,
    #[serde(default)]
    pub replace_optional_with_nullish: bool,
    #[serde(default = "default_true")]
    pub exclude_redundant_zod_schemas: bool,
    #[serde(default = "default_enum_suffix")]
    pub enum_suffix: String,
    #[serde(default)]
    pub base_url: String,
    #[serde(default)]
    pub output: String,
    #[serde(default)]
    pub ts_path: String,
    #[serde(default)]
    pub import_path: String,
    #[serde(default)]
    pub configs: HashMap<String, GenerateConfig>,
    #[serde(default)]
    pub rest_client_import_path: String,
    #[serde(default = "default_rest_client")]
    pub rest_client: String,
    #[serde(default = "default_zod_import_path")]
    pub zod_import_path: String,
    #[serde(default)]
    pub axios_request_config: bool,
    #[serde(default = "default_true")]
    pub parse_request_params: bool,
    #[serde(default)]
    pub inline_endpoints: bool,
    #[serde(default)]
    pub builder_configs: bool,
    #[serde(default = "default_true")]
    pub acl: bool,
    #[serde(default)]
    pub native_compact: bool,
    #[serde(default)]
    pub inline_endpoints_exclude_modules: Vec<String>,
    #[serde(default)]
    pub infinite_queries: bool,
    #[serde(default)]
    pub infinite_query_param_names: InfiniteQueryParamNames,
    #[serde(default)]
    pub infinite_query_response_param_names: InfiniteQueryResponseParamNames,
    #[serde(default = "default_true")]
    pub prefetch_queries: bool,
    #[serde(default = "default_true")]
    pub mutation_effects: bool,
    #[serde(default)]
    pub mutation_default_on_error: bool,
    #[serde(default)]
    pub query_types_import_path: String,
    #[serde(default = "default_package_import_path")]
    pub mutation_effects_import_path: String,
    #[serde(default = "default_true")]
    pub check_acl: bool,
    #[serde(default = "default_acl_import_path")]
    pub acl_check_import_path: String,
    #[serde(default)]
    pub workspace_context: Vec<String>,
    #[serde(default)]
    pub mutation_scope: serde_json::Value,
}

fn default_rest_client() -> String {
    "axios".into()
}

fn default_true() -> bool {
    true
}
fn default_tag() -> String {
    "Common".into()
}
fn default_remove_prefix() -> String {
    "Controller_".into()
}
fn default_schema_suffix() -> String {
    "Schema".into()
}
fn default_enum_suffix() -> String {
    "Enum".into()
}
fn default_page() -> String {
    "page".into()
}
fn default_total_items() -> String {
    "totalItems".into()
}
fn default_limit() -> String {
    "limit".into()
}
fn default_package_import_path() -> String {
    "@povio/openapi-codegen-cli".into()
}
fn default_acl_import_path() -> String {
    "@povio/openapi-codegen-cli/acl".into()
}
fn default_zod_import_path() -> String {
    "@povio/openapi-codegen-cli/zod".into()
}
