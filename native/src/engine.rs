use serde::Serialize;
use serde_json::Value;

const METHODS: [&str; 8] = [
    "get", "put", "post", "delete", "options", "head", "patch", "trace",
];

#[derive(Default, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DocumentStats {
    pub operations: u32,
    pub schemas: u32,
    pub parameters: u32,
    pub responses: u32,
    pub request_bodies: u32,
    pub schema_refs: u32,
}

pub fn analyze(document: &Value) -> DocumentStats {
    let mut stats = DocumentStats::default();
    if let Some(schemas) = document
        .pointer("/components/schemas")
        .and_then(Value::as_object)
    {
        stats.schemas = schemas.len() as u32;
        for schema in schemas.values() {
            walk_schema(schema, &mut stats);
        }
    }

    let Some(paths) = document.get("paths").and_then(Value::as_object) else {
        return stats;
    };
    for path_item in paths.values().filter_map(Value::as_object) {
        let path_parameters = path_item.get("parameters").and_then(Value::as_array);
        for method in METHODS {
            let Some(operation) = path_item.get(method).and_then(Value::as_object) else {
                continue;
            };
            stats.operations += 1;
            stats.parameters += path_parameters.map_or(0, |params| params.len() as u32);
            stats.parameters += operation
                .get("parameters")
                .and_then(Value::as_array)
                .map_or(0, |params| params.len() as u32);
            if operation.get("requestBody").is_some() {
                stats.request_bodies += 1;
            }
            stats.responses += operation
                .get("responses")
                .and_then(Value::as_object)
                .map_or(0, |responses| responses.len() as u32);
        }
    }
    stats
}

fn walk_schema(value: &Value, stats: &mut DocumentStats) {
    match value {
        Value::Object(object) => {
            if object.contains_key("$ref") {
                stats.schema_refs += 1;
            }
            for child in object.values() {
                walk_schema(child, stats);
            }
        }
        Value::Array(array) => {
            for child in array {
                walk_schema(child, stats);
            }
        }
        _ => {}
    }
}
