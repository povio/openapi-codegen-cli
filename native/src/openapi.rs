use crate::json::Value;

pub fn parse_document(source: &str, yaml: bool) -> Result<Value, Box<dyn std::error::Error>> {
    let source = source.strip_prefix('\u{feff}').unwrap_or(source);
    if yaml {
        let value: serde_yaml::Value = serde_yaml::from_str(source)?;
        return Ok(crate::json::to_value(value)?);
    }

    Ok(serde_json::from_str(source)?)
}
