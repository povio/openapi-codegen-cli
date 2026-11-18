//! Turns a complete native render into output files and writes them, so the rendered contents
//! do not cross into JavaScript. Mirrors `generateFilesFromNativeOpenAPI` and the incremental
//! writer in `src/generators/run`.

use std::{
    collections::HashMap,
    hash::{DefaultHasher, Hasher},
    io::ErrorKind,
    path::{MAIN_SEPARATOR, MAIN_SEPARATOR_STR, Path, PathBuf},
};

use crate::json::{Map, Value};
use rayon::prelude::*;
use serde::Deserialize;

use crate::{config::GenerateOptions, render::decapitalize};

/// How the caller wants files handled, beyond what the generate options say.
#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WriteOptions {
    /// `path.resolve(output)`; manifest keys are this joined with each file's relative name.
    output_absolute: String,
    /// Content hashes of the previous run's files by absolute name, when generating incrementally.
    previous: Option<HashMap<String, String>>,
    /// Identifies post-processing (the formatter); part of every content hash.
    #[serde(default)]
    salt: String,
    /// Write changed files here. Otherwise they are returned for the caller to format and write.
    write: bool,
    /// The output directory did not exist, so no file needs comparing with what is on disk.
    #[serde(default)]
    skip_existing_check: bool,
}

pub struct GeneratedFiles {
    /// Every generated file, as `output/relative/name.ts`, in generation order.
    pub names: Vec<String>,
    pub hashes: Vec<String>,
    /// Changed files the caller formats and writes (only when not writing here).
    pub changed_names: Vec<String>,
    pub changed_contents: Vec<String>,
    pub written: u32,
}

/// The generated files of a complete native render, or `None` when the render is incomplete.
pub fn generate_files(
    mut data: Value,
    options: &GenerateOptions,
    write: &WriteOptions,
) -> Result<Option<GeneratedFiles>, String> {
    let data = data.as_object_mut().ok_or("Native data is not an object")?;
    if data.get("renderedComplete") != Some(&Value::Bool(true)) {
        return Ok(None);
    }
    let started = std::time::Instant::now();
    let files = collect_files(data, options);
    let after_collect = started.elapsed();
    let output_absolute = Path::new(&write.output_absolute);
    let prepared: Vec<(String, String, String, bool)> = crate::render_pool::install(|| {
        files
            .into_par_iter()
            .map(|(relative, content)| {
                let content = trim_trailing_whitespace(&content);
                let hash = content_hash(&write.salt, &content);
                let name = format!("{}/{relative}", options.output);
                let key = absolute_key(output_absolute, &relative);
                let changed = write
                    .previous
                    .as_ref()
                    .is_none_or(|previous| previous.get(&key) != Some(&hash))
                    || !Path::new(&name).exists();
                (name, content, hash, changed)
            })
            .collect()
    })?;

    let after_prepare = started.elapsed();
    let mut result = GeneratedFiles {
        names: Vec::with_capacity(prepared.len()),
        hashes: Vec::with_capacity(prepared.len()),
        changed_names: Vec::new(),
        changed_contents: Vec::new(),
        written: 0,
    };
    let mut to_write = Vec::new();
    for (name, content, hash, changed) in prepared {
        result.names.push(name.clone());
        result.hashes.push(hash);
        if !changed {
            continue;
        }
        if write.write {
            to_write.push((name, content));
        } else {
            result.changed_names.push(name);
            result.changed_contents.push(content);
        }
    }
    if write.write {
        result.written = write_files(&to_write, write.skip_existing_check)?;
    }
    if std::env::var_os("OPENAPI_NATIVE_PROFILE").is_some() {
        eprintln!(
            "native files collect={:.3}ms trim+hash+compare={:.3}ms write={:.3}ms ({} written)",
            after_collect.as_secs_f64() * 1000.0,
            (after_prepare - after_collect).as_secs_f64() * 1000.0,
            (started.elapsed() - after_prepare).as_secs_f64() * 1000.0,
            result.written,
        );
    }
    Ok(Some(result))
}

/// `[relative name, content]` in the order `generateFilesFromNativeOpenAPI` emits files.
fn collect_files(
    data: &mut Map<String, Value>,
    options: &GenerateOptions,
) -> Vec<(String, String)> {
    let mut take = |key: &str| match data.remove(key) {
        Some(Value::Object(map)) => map,
        _ => Map::new(),
    };
    let mut models = take("renderedModels");
    let mut endpoints = take("renderedEndpoints");
    let mut queries = take("renderedQueries");
    let mut acl = take("renderedAcl");
    let mut shared = take("renderedShared");
    let tags: Vec<String> = match data.remove("renderedTags") {
        Some(Value::Array(tags)) => tags
            .into_iter()
            .filter_map(|tag| match tag {
                Value::String(tag) => Some(tag),
                _ => None,
            })
            .collect(),
        _ => Vec::new(),
    };
    let base_url = data
        .get("baseUrl")
        .and_then(Value::as_str)
        .unwrap_or_default()
        .to_string();

    let suffix = |kind: &str| {
        options
            .configs
            .get(kind)
            .map(|config| config.output_file_name_suffix.clone())
            .unwrap_or_default()
    };
    let mut kinds: Vec<(String, &mut Map<String, Value>)> = vec![(suffix("models"), &mut models)];
    if !options.models_only {
        kinds.push((suffix("endpoints"), &mut endpoints));
        kinds.push((suffix("queries"), &mut queries));
        if options.acl {
            kinds.push((suffix("acl"), &mut acl));
        }
    }

    let mut files = Vec::new();
    for tag in &tags {
        for (suffix, rendered) in kinds.iter_mut() {
            // JavaScript skips missing and empty contents alike.
            if let Some(Value::String(content)) = rendered.get_mut(tag)
                && !content.is_empty()
            {
                files.push((tag_file_name(tag, suffix), std::mem::take(content)));
            }
        }
    }
    if !options.models_only {
        let mut shared_file = |key: &str, name: &str, files: &mut Vec<(String, String)>| {
            if let Some(Value::String(content)) = shared.get_mut(key)
                && !content.is_empty()
            {
                files.push((name.to_string(), std::mem::take(content)));
            }
        };
        if options.acl {
            shared_file("appAcl", "acl/app.ability.ts", &mut files);
        }
        if options.mutation_effects {
            shared_file("queryModules", "queryModules.ts", &mut files);
        }
        if options.rest_client_import_path.is_empty() {
            let (client, path) = if options.rest_client == "native" {
                ("NativeRestClient", "/native")
            } else {
                ("RestClient", "/axios")
            };
            files.push((
                "app-rest-client.ts".into(),
                format!(
                    "import {{ {client} }} from \"@povio/openapi-codegen-cli{path}\";\n\nexport const AppRestClient = new {client}({{\n  config: {{\n    baseURL: \"{base_url}\"\n  }},\n}});\n"
                ),
            ));
        }
        shared_file("domainErrors", "domain-errors.ts", &mut files);
    }
    files
}

/// `getTagFileName`: `tag/tag.suffix.ts`, or `suffix.ts` without a tag.
fn tag_file_name(tag: &str, suffix: &str) -> String {
    if tag.is_empty() {
        return format!("{suffix}.ts");
    }
    let tag = decapitalize(tag);
    format!("{tag}/{tag}.{suffix}.ts")
}

/// `text.replace(/[ \t]+$/gm, "")`: drop spaces and tabs before every JavaScript line terminator
/// and at the end.
pub(crate) fn trim_trailing_whitespace(text: &str) -> String {
    let mut output = String::with_capacity(text.len());
    // Start of the current run of spaces and tabs, and how much of `text` is already copied.
    let mut run: Option<usize> = None;
    let mut copied = 0;
    for (index, character) in text.char_indices() {
        match character {
            ' ' | '\t' => {
                run.get_or_insert(index);
            }
            '\n' | '\r' | '\u{2028}' | '\u{2029}' => {
                if let Some(start) = run.take() {
                    output.push_str(&text[copied..start]);
                    copied = index;
                }
            }
            _ => run = None,
        }
    }
    output.push_str(&text[copied..run.unwrap_or(text.len())]);
    output
}

fn content_hash(salt: &str, content: &str) -> String {
    // SipHash with fixed keys: stable between runs, which is all the manifest needs.
    let mut hasher = DefaultHasher::new();
    hasher.write(salt.as_bytes());
    hasher.write_u8(0);
    hasher.write(content.as_bytes());
    format!("{:016x}", hasher.finish())
}

fn absolute_key(output_absolute: &Path, relative: &str) -> String {
    let relative: PathBuf = relative.split('/').collect();
    let key = output_absolute.join(relative);
    let key = key.to_string_lossy();
    if MAIN_SEPARATOR == '/' {
        key.into_owned()
    } else {
        key.replace('/', MAIN_SEPARATOR_STR)
    }
}

const PARALLEL_WRITE_THRESHOLD: usize = 32;

/// Writes files whose content differs from disk, in parallel. Returns how many were written.
fn write_files(files: &[(String, String)], skip_existing_check: bool) -> Result<u32, String> {
    let mut directories: Vec<&Path> = files
        .iter()
        .filter_map(|(name, _)| Path::new(name).parent())
        .collect();
    directories.sort();
    directories.dedup();
    for directory in directories {
        std::fs::create_dir_all(directory)
            .map_err(|error| format!("{}: {error}", directory.display()))?;
    }
    let write_one = |(name, content): &(String, String)| -> Result<u32, String> {
        if !skip_existing_check {
            match std::fs::read(name) {
                Ok(existing) if existing == content.as_bytes() => return Ok(0),
                Ok(_) => {}
                Err(error) if error.kind() == ErrorKind::NotFound => {}
                Err(error) => return Err(format!("{name}: {error}")),
            }
        }
        std::fs::write(name, content).map_err(|error| format!("{name}: {error}"))?;
        Ok(1)
    };
    // A few files (an incremental run) are quicker to write here than to hand to the pool.
    let written = if files.len() < PARALLEL_WRITE_THRESHOLD {
        files
            .iter()
            .map(write_one)
            .collect::<Result<Vec<u32>, String>>()?
    } else {
        crate::render_pool::install(|| {
            files
                .par_iter()
                .map(write_one)
                .collect::<Result<Vec<u32>, String>>()
        })??
    };
    Ok(written.into_iter().sum())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn trims_whitespace_like_the_javascript_regex() {
        for (input, expected) in [
            ("a  \nb\t\n", "a\nb\n"),
            ("a \r\nb", "a\r\nb"),
            ("end  ", "end"),
            ("  lead", "  lead"),
            ("a \t b", "a \t b"),
            ("x \u{2028}y \u{2029}", "x\u{2028}y\u{2029}"),
            ("\n  \n", "\n\n"),
            ("é \nü", "é\nü"),
        ] {
            assert_eq!(trim_trailing_whitespace(input), expected, "{input:?}");
        }
    }

    #[test]
    fn names_tag_files_like_get_tag_file_name() {
        assert_eq!(
            tag_file_name("Airlines", "models"),
            "airlines/airlines.models.ts"
        );
        assert_eq!(tag_file_name("", "api"), "api.ts");
    }
}
