use std::ops::Range;

use rayon::prelude::*;

use crate::json::{Map, Value};

pub fn parse_document(source: &str, yaml: bool) -> Result<Value, Box<dyn std::error::Error>> {
    let source = source.strip_prefix('\u{feff}').unwrap_or(source);
    if yaml {
        let value: serde_yaml::Value = serde_yaml::from_str(source)?;
        return Ok(crate::json::to_value(value)?);
    }
    if source.len() >= PARALLEL_PARSE_MIN_BYTES
        && let Some(document) = parse_json_in_parallel(source)
    {
        return Ok(document);
    }
    Ok(serde_json::from_str(source)?)
}

/// Below this, splitting the document costs more than it saves.
const PARALLEL_PARSE_MIN_BYTES: usize = 256 * 1024;

/// Objects whose entries are parsed independently: the bulk of a spec lives in their entries.
const SPLIT_TOP_LEVEL: [&str; 2] = ["paths", "webhooks"];
/// Under `components`, every map (`schemas`, `responses`, `parameters`, ...) is split.
const SPLIT_COMPONENTS: &str = "components";

/// Parses a JSON document by splitting its large objects into entries and parsing those on the
/// render pool, then reassembling them in source order. The result equals `serde_json::from_str`;
/// anything unusual (invalid JSON, deep nesting, a non-object root) returns `None` so the caller
/// parses sequentially and reports serde_json's own errors.
fn parse_json_in_parallel(source: &str) -> Option<Value> {
    let bytes = source.as_bytes();
    let root_start = skip_whitespace(bytes, 0);

    // Plan each top-level entry in one pass: objects that hold the bulk of a spec are split into
    // their entries while they are scanned, so no byte is scanned twice.
    enum Plan {
        Whole(Range<usize>),
        Split(Vec<Entry>),
        Components(Vec<Section>),
    }
    let mut root: Vec<Range<usize>> = Vec::new();
    let mut plans: Vec<Plan> = Vec::new();
    let root_end = scan_object(bytes, root_start, |key, value_start| {
        let key_text = &source[key.clone()];
        let split = SPLIT_TOP_LEVEL.iter().any(|name| {
            key_text.len() == name.len() + 2 && &key_text[1..key_text.len() - 1] == *name
        });
        let components = key_text.len() == SPLIT_COMPONENTS.len() + 2
            && &key_text[1..key_text.len() - 1] == SPLIT_COMPONENTS;
        let (plan, end) = if split && bytes.get(value_start) == Some(&b'{') {
            let (entries, end) = object_entries(bytes, value_start)?;
            (Plan::Split(entries), end)
        } else if components && bytes.get(value_start) == Some(&b'{') {
            let mut sections = Vec::new();
            let end = scan_object(bytes, value_start, |section_key, section_start| {
                if bytes.get(section_start) == Some(&b'{') {
                    let (entries, end) = object_entries(bytes, section_start)?;
                    sections.push((section_key, Some(entries), section_start..end));
                    Some(end)
                } else {
                    let end = value_end(bytes, section_start)?;
                    sections.push((section_key, None, section_start..end));
                    Some(end)
                }
            })?;
            (Plan::Components(sections), end)
        } else {
            let end = value_end(bytes, value_start)?;
            (Plan::Whole(value_start..end), end)
        };
        root.push(key);
        plans.push(plan);
        Some(end)
    })?;
    if skip_whitespace(bytes, root_end) != bytes.len() {
        return None;
    }
    let root: Vec<Entry> = root
        .into_iter()
        .map(|key| Entry { key, value: 0..0 })
        .collect();

    // Every value to parse, in order: whole top-level values and the entries of split objects.
    let mut units: Vec<Range<usize>> = Vec::new();
    for plan in &plans {
        match plan {
            Plan::Whole(range) => units.push(range.clone()),
            Plan::Split(entries) => units.extend(entries.iter().map(|entry| entry.value.clone())),
            Plan::Components(sections) => {
                for (_, entries, whole) in sections {
                    match entries {
                        Some(entries) => {
                            units.extend(entries.iter().map(|entry| entry.value.clone()))
                        }
                        None => units.push(whole.clone()),
                    }
                }
            }
        }
    }
    let parse = |range: &Range<usize>| serde_json::from_str::<Value>(&source[range.clone()]).ok();
    let parsed: Vec<Option<Value>> =
        crate::render_pool::install(|| units.par_iter().map(parse).collect())
            .unwrap_or_else(|_| units.iter().map(parse).collect());
    let mut values = parsed.into_iter();
    let mut next = || values.next().flatten();
    let key = |range: &Range<usize>| serde_json::from_str::<String>(&source[range.clone()]).ok();

    let mut document = Map::with_capacity(root.len());
    for (entry, plan) in root.iter().zip(plans) {
        let value = match plan {
            Plan::Whole(_) => next()?,
            Plan::Split(entries) => {
                let mut map = Map::with_capacity(entries.len());
                for entry in &entries {
                    map.insert(key(&entry.key)?, next()?);
                }
                Value::Object(map)
            }
            Plan::Components(sections) => {
                let mut components = Map::with_capacity(sections.len());
                for (section_key, entries, _) in sections {
                    let section = match entries {
                        Some(entries) => {
                            let mut map = Map::with_capacity(entries.len());
                            for entry in &entries {
                                map.insert(key(&entry.key)?, next()?);
                            }
                            Value::Object(map)
                        }
                        None => next()?,
                    };
                    components.insert(key(&section_key)?, section);
                }
                Value::Object(components)
            }
        };
        // Like serde_json, a repeated key keeps its first position and takes the last value.
        document.insert(key(&entry.key)?, value);
    }
    Some(Value::Object(document))
}

/// A `components` section: its raw key, its entries when it is an object, and its whole value.
type Section = (Range<usize>, Option<Vec<Entry>>, Range<usize>);

/// An object entry's raw key (with quotes) and value, as byte ranges of the source.
struct Entry {
    key: Range<usize>,
    value: Range<usize>,
}

/// serde_json stops nesting at 128 levels; stay well below so split parsing never accepts a
/// document the sequential parse would reject.
const MAX_DEPTH: usize = 100;

/// Walks the object starting at `start` (a `{`): for each entry, `visit` gets the raw key and the
/// value's start, scans the value and returns its end. Returns the offset just past the `}`.
fn scan_object(
    bytes: &[u8],
    start: usize,
    mut visit: impl FnMut(Range<usize>, usize) -> Option<usize>,
) -> Option<usize> {
    if bytes.get(start) != Some(&b'{') {
        return None;
    }
    let mut position = skip_whitespace(bytes, start + 1);
    if bytes.get(position) == Some(&b'}') {
        return Some(position + 1);
    }
    loop {
        if bytes.get(position) != Some(&b'"') {
            return None;
        }
        let key_end = string_end(bytes, position)?;
        let colon = skip_whitespace(bytes, key_end);
        if bytes.get(colon) != Some(&b':') {
            return None;
        }
        let value_start = skip_whitespace(bytes, colon + 1);
        let value_end = visit(position..key_end, value_start)?;
        position = skip_whitespace(bytes, value_end);
        match bytes.get(position) {
            Some(b',') => position = skip_whitespace(bytes, position + 1),
            Some(b'}') => return Some(position + 1),
            _ => return None,
        }
    }
}

/// The entries of the object starting at `start` (a `{`), and the offset just past its `}`.
/// `None` when the bytes there are not a well-formed object, as far as this scan checks.
fn object_entries(bytes: &[u8], start: usize) -> Option<(Vec<Entry>, usize)> {
    let mut entries = Vec::new();
    let end = scan_object(bytes, start, |key, value_start| {
        let end = value_end(bytes, value_start)?;
        entries.push(Entry {
            key,
            value: value_start..end,
        });
        Some(end)
    })?;
    Some((entries, end))
}

fn skip_whitespace(bytes: &[u8], mut position: usize) -> usize {
    while let Some(b' ' | b'\n' | b'\r' | b'\t') = bytes.get(position) {
        position += 1;
    }
    position
}

/// The offset just past the string starting at `start` (a `"`).
fn string_end(bytes: &[u8], start: usize) -> Option<usize> {
    let mut position = start + 1;
    loop {
        position += memchr::memchr2(b'"', b'\\', &bytes[position..])?;
        if bytes[position] == b'\\' {
            position += 2;
        } else {
            return Some(position + 1);
        }
    }
}

/// The offset just past the JSON value starting at `start`. Nested values are matched by bracket
/// depth only; their contents are validated when the value itself is parsed.
fn value_end(bytes: &[u8], start: usize) -> Option<usize> {
    match bytes.get(start)? {
        b'"' => string_end(bytes, start),
        b'{' | b'[' => {
            let mut depth = 0usize;
            let mut position = start;
            loop {
                match bytes.get(position)? {
                    b'"' => {
                        position = string_end(bytes, position)?;
                        continue;
                    }
                    b'{' | b'[' => {
                        depth += 1;
                        if depth > MAX_DEPTH {
                            return None;
                        }
                    }
                    b'}' | b']' => {
                        depth -= 1;
                        if depth == 0 {
                            return Some(position + 1);
                        }
                    }
                    _ => {}
                }
                position += 1;
            }
        }
        _ => {
            let mut position = start;
            while let Some(byte) = bytes.get(position) {
                if matches!(byte, b',' | b'}' | b']' | b' ' | b'\n' | b'\r' | b'\t') {
                    break;
                }
                position += 1;
            }
            (position > start).then_some(position)
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn big(document: &str) -> String {
        // Pad with a large ignored string so the parallel path is taken.
        let padding = "x".repeat(PARALLEL_PARSE_MIN_BYTES);
        format!(r#"{{"padding":"{padding}",{}"#, &document[1..])
    }

    #[test]
    fn parallel_parse_matches_serde_json() {
        let document = big(r##"{
              "openapi": "3.1.0",
              "paths": { "/a\"b": { "get": { "x": [1, 2.5, -3e2, true, null, "s\\u00e9{"] } }, "/c": {}, "/a\"b": { "post": {} } },
              "components": {
                "schemas": { "A": { "type": "object", "properties": { "b": { "$ref": "#/components/schemas/B" } } }, "B": { "enum": ["}", "]"] } },
                "responses": {},
                "examples": []
              },
              "webhooks": { "w": { "nested": [[[{}]]] } },
              "paths": { "/later": {} }
            }"##);
        let parallel = parse_json_in_parallel(&document).expect("parallel path");
        let sequential: Value = serde_json::from_str(&document).unwrap();
        assert_eq!(
            serde_json::to_string(&parallel).unwrap(),
            serde_json::to_string(&sequential).unwrap()
        );
    }

    #[test]
    fn falls_back_on_anything_unusual() {
        for document in [
            big(r#"{"paths": {"a": }}"#),
            big(r#"{"paths": {"a": 1}} trailing"#),
            big(r#"{"paths": {"a": [1, 2}}"#),
            format!("[{}]", "1,".repeat(PARALLEL_PARSE_MIN_BYTES)) + "1",
            big(&format!(
                r#"{{"paths": {{"a": {}{}}}}}"#,
                "[".repeat(120),
                "]".repeat(120)
            )),
        ] {
            assert!(parse_json_in_parallel(&document).is_none());
            // The caller then parses sequentially and reports serde_json's error (or succeeds).
            let _ = parse_document(&document, false);
        }
    }
}
