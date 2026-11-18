//! A JSON value with `serde_json::Value`'s API and semantics (with `preserve_order`), backed by
//! an Fx-hashed `IndexMap`. Specs are parsed into this tree and every stage reads it, so cheaper
//! construction and lookups than SipHash-keyed maps speed up the whole pipeline.

use std::{
    fmt,
    ops::{Deref, DerefMut, Index, IndexMut},
};

use indexmap::IndexMap;
use rustc_hash::FxBuildHasher;
use serde::{
    Deserialize, Deserializer, Serialize, Serializer,
    de::{MapAccess, SeqAccess, Visitor},
    ser::{SerializeMap, SerializeSeq},
};

pub use serde_json::Number;

/// Insertion-ordered map. Like `serde_json::Map` with `preserve_order`, `remove` swaps the last
/// entry into the removed slot.
#[derive(Clone)]
pub struct Map<K = String, V = Value>(IndexMap<K, V, FxBuildHasher>);

/// Order-insensitive, like `serde_json::Map` (and `IndexMap`) equality.
impl<K: std::hash::Hash + Eq, V: PartialEq> PartialEq for Map<K, V> {
    fn eq(&self, other: &Self) -> bool {
        self.0 == other.0
    }
}

impl<K: std::hash::Hash + Eq, V: Eq> Eq for Map<K, V> {}

impl<K, V> Map<K, V> {
    pub fn new() -> Self {
        Self(IndexMap::default())
    }

    pub fn with_capacity(capacity: usize) -> Self {
        Self(IndexMap::with_capacity_and_hasher(capacity, FxBuildHasher))
    }

    // Inherent so they also work as paths (`Map::len`), not only through `Deref`.
    pub fn len(&self) -> usize {
        self.0.len()
    }

    pub fn is_empty(&self) -> bool {
        self.0.is_empty()
    }
}

impl<K: std::hash::Hash + Eq, V> Map<K, V> {
    /// `serde_json::Map::remove` with `preserve_order`: an `IndexMap::swap_remove`.
    pub fn remove<Q>(&mut self, key: &Q) -> Option<V>
    where
        K: std::borrow::Borrow<Q>,
        Q: std::hash::Hash + Eq + ?Sized,
    {
        self.0.swap_remove(key)
    }
}

impl<K, V> Default for Map<K, V> {
    fn default() -> Self {
        Self::new()
    }
}

impl<K, V> Deref for Map<K, V> {
    type Target = IndexMap<K, V, FxBuildHasher>;
    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl<K, V> DerefMut for Map<K, V> {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.0
    }
}

impl<K: fmt::Debug, V: fmt::Debug> fmt::Debug for Map<K, V> {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        self.0.fmt(formatter)
    }
}

impl<K: std::hash::Hash + Eq, V> FromIterator<(K, V)> for Map<K, V> {
    fn from_iter<I: IntoIterator<Item = (K, V)>>(iter: I) -> Self {
        Self(IndexMap::from_iter(iter))
    }
}

impl<K: std::hash::Hash + Eq, V> Extend<(K, V)> for Map<K, V> {
    fn extend<I: IntoIterator<Item = (K, V)>>(&mut self, iter: I) {
        self.0.extend(iter)
    }
}

impl<K, V> IntoIterator for Map<K, V> {
    type Item = (K, V);
    type IntoIter = indexmap::map::IntoIter<K, V>;
    fn into_iter(self) -> Self::IntoIter {
        self.0.into_iter()
    }
}

impl<'m, K, V> IntoIterator for &'m Map<K, V> {
    type Item = (&'m K, &'m V);
    type IntoIter = indexmap::map::Iter<'m, K, V>;
    fn into_iter(self) -> Self::IntoIter {
        self.0.iter()
    }
}

impl<'m, K, V> IntoIterator for &'m mut Map<K, V> {
    type Item = (&'m K, &'m mut V);
    type IntoIter = indexmap::map::IterMut<'m, K, V>;
    fn into_iter(self) -> Self::IntoIter {
        self.0.iter_mut()
    }
}

impl<V> Index<&str> for Map<String, V> {
    type Output = V;
    fn index(&self, key: &str) -> &V {
        self.0.get(key).expect("key not in map")
    }
}

/// `serde_json::Value`, with objects in [`Map`].
#[derive(Clone, PartialEq, Eq, Default)]
pub enum Value {
    #[default]
    Null,
    Bool(bool),
    Number(Number),
    String(String),
    Array(Vec<Value>),
    Object(Map<String, Value>),
}

static NULL: Value = Value::Null;

impl Value {
    pub fn get<I: ValueIndex>(&self, index: I) -> Option<&Value> {
        index.index_into(self)
    }

    pub fn get_mut<I: ValueIndex>(&mut self, index: I) -> Option<&mut Value> {
        index.index_into_mut(self)
    }

    /// RFC 6901 JSON pointer lookup, as `serde_json::Value::pointer`.
    pub fn pointer(&self, pointer: &str) -> Option<&Value> {
        if pointer.is_empty() {
            return Some(self);
        }
        if !pointer.starts_with('/') {
            return None;
        }
        let mut target = self;
        for token in pointer.split('/').skip(1) {
            let token = unescape_token(token);
            target = match target {
                Value::Object(map) => map.get(token.as_ref())?,
                Value::Array(list) => parse_index(&token).and_then(|index| list.get(index))?,
                _ => return None,
            };
        }
        Some(target)
    }

    pub fn pointer_mut(&mut self, pointer: &str) -> Option<&mut Value> {
        if pointer.is_empty() {
            return Some(self);
        }
        if !pointer.starts_with('/') {
            return None;
        }
        let mut target = self;
        for token in pointer.split('/').skip(1) {
            let token = unescape_token(token);
            target = match target {
                Value::Object(map) => map.get_mut(token.as_ref())?,
                Value::Array(list) => {
                    parse_index(&token).and_then(move |index| list.get_mut(index))?
                }
                _ => return None,
            };
        }
        Some(target)
    }

    pub fn as_object(&self) -> Option<&Map<String, Value>> {
        match self {
            Value::Object(map) => Some(map),
            _ => None,
        }
    }

    pub fn as_object_mut(&mut self) -> Option<&mut Map<String, Value>> {
        match self {
            Value::Object(map) => Some(map),
            _ => None,
        }
    }

    pub fn as_array(&self) -> Option<&Vec<Value>> {
        match self {
            Value::Array(list) => Some(list),
            _ => None,
        }
    }

    pub fn as_array_mut(&mut self) -> Option<&mut Vec<Value>> {
        match self {
            Value::Array(list) => Some(list),
            _ => None,
        }
    }

    pub fn as_str(&self) -> Option<&str> {
        match self {
            Value::String(string) => Some(string),
            _ => None,
        }
    }

    pub fn as_bool(&self) -> Option<bool> {
        match self {
            Value::Bool(value) => Some(*value),
            _ => None,
        }
    }

    pub fn as_number(&self) -> Option<&Number> {
        match self {
            Value::Number(number) => Some(number),
            _ => None,
        }
    }

    pub fn as_f64(&self) -> Option<f64> {
        self.as_number().and_then(Number::as_f64)
    }

    pub fn as_i64(&self) -> Option<i64> {
        self.as_number().and_then(Number::as_i64)
    }

    pub fn as_u64(&self) -> Option<u64> {
        self.as_number().and_then(Number::as_u64)
    }

    pub fn as_null(&self) -> Option<()> {
        self.is_null().then_some(())
    }

    pub fn is_null(&self) -> bool {
        matches!(self, Value::Null)
    }

    pub fn is_boolean(&self) -> bool {
        matches!(self, Value::Bool(_))
    }

    pub fn is_number(&self) -> bool {
        matches!(self, Value::Number(_))
    }

    pub fn is_string(&self) -> bool {
        matches!(self, Value::String(_))
    }

    pub fn is_array(&self) -> bool {
        matches!(self, Value::Array(_))
    }

    pub fn is_object(&self) -> bool {
        matches!(self, Value::Object(_))
    }

    pub fn is_i64(&self) -> bool {
        self.as_number().is_some_and(Number::is_i64)
    }

    pub fn is_u64(&self) -> bool {
        self.as_number().is_some_and(Number::is_u64)
    }

    pub fn is_f64(&self) -> bool {
        self.as_number().is_some_and(Number::is_f64)
    }

    pub fn take(&mut self) -> Value {
        std::mem::take(self)
    }
}

fn unescape_token(token: &str) -> std::borrow::Cow<'_, str> {
    if token.contains('~') {
        token.replace("~1", "/").replace("~0", "~").into()
    } else {
        token.into()
    }
}

/// `serde_json`'s pointer array index rules: digits only, no leading zero.
fn parse_index(token: &str) -> Option<usize> {
    if token.starts_with('+') || (token.starts_with('0') && token.len() != 1) {
        return None;
    }
    token.parse().ok()
}

/// What `Value::get` and indexing accept: a key or an array position.
pub trait ValueIndex {
    fn index_into<'v>(&self, value: &'v Value) -> Option<&'v Value>;
    fn index_into_mut<'v>(&self, value: &'v mut Value) -> Option<&'v mut Value>;
}

impl ValueIndex for str {
    fn index_into<'v>(&self, value: &'v Value) -> Option<&'v Value> {
        value.as_object()?.get(self)
    }
    fn index_into_mut<'v>(&self, value: &'v mut Value) -> Option<&'v mut Value> {
        value.as_object_mut()?.get_mut(self)
    }
}

impl ValueIndex for String {
    fn index_into<'v>(&self, value: &'v Value) -> Option<&'v Value> {
        self.as_str().index_into(value)
    }
    fn index_into_mut<'v>(&self, value: &'v mut Value) -> Option<&'v mut Value> {
        self.as_str().index_into_mut(value)
    }
}

impl ValueIndex for usize {
    fn index_into<'v>(&self, value: &'v Value) -> Option<&'v Value> {
        value.as_array()?.get(*self)
    }
    fn index_into_mut<'v>(&self, value: &'v mut Value) -> Option<&'v mut Value> {
        value.as_array_mut()?.get_mut(*self)
    }
}

impl<T: ValueIndex + ?Sized> ValueIndex for &T {
    fn index_into<'v>(&self, value: &'v Value) -> Option<&'v Value> {
        (**self).index_into(value)
    }
    fn index_into_mut<'v>(&self, value: &'v mut Value) -> Option<&'v mut Value> {
        (**self).index_into_mut(value)
    }
}

impl<I: ValueIndex> Index<I> for Value {
    type Output = Value;
    /// Like `serde_json`, a missing key or position reads as `null`.
    fn index(&self, index: I) -> &Value {
        index.index_into(self).unwrap_or(&NULL)
    }
}

impl IndexMut<&str> for Value {
    /// Like `serde_json`, indexing `null` with a key turns it into an object and inserts `null`.
    fn index_mut(&mut self, key: &str) -> &mut Value {
        if self.is_null() {
            *self = Value::Object(Map::new());
        }
        match self {
            Value::Object(map) => map.entry(key.to_string()).or_insert(Value::Null),
            _ => panic!("cannot index into a non-object JSON value with a key"),
        }
    }
}

impl IndexMut<usize> for Value {
    fn index_mut(&mut self, index: usize) -> &mut Value {
        match self {
            Value::Array(list) => &mut list[index],
            _ => panic!("cannot index into a non-array JSON value with a position"),
        }
    }
}

impl fmt::Debug for Value {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Value::Null => formatter.write_str("Null"),
            Value::Bool(value) => write!(formatter, "Bool({value})"),
            Value::Number(number) => write!(formatter, "Number({number})"),
            Value::String(string) => write!(formatter, "String({string:?})"),
            Value::Array(list) => {
                formatter.write_str("Array ")?;
                formatter.debug_list().entries(list).finish()
            }
            Value::Object(map) => {
                formatter.write_str("Object ")?;
                map.fmt(formatter)
            }
        }
    }
}

impl fmt::Display for Value {
    /// Compact JSON, or pretty-printed with `{:#}`, as `serde_json::Value` displays.
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        let text = if formatter.alternate() {
            serde_json::to_string_pretty(self)
        } else {
            serde_json::to_string(self)
        }
        .map_err(|_| fmt::Error)?;
        formatter.write_str(&text)
    }
}

impl Serialize for Value {
    fn serialize<S: Serializer>(&self, serializer: S) -> Result<S::Ok, S::Error> {
        match self {
            Value::Null => serializer.serialize_unit(),
            Value::Bool(value) => serializer.serialize_bool(*value),
            Value::Number(number) => number.serialize(serializer),
            Value::String(string) => serializer.serialize_str(string),
            Value::Array(list) => {
                let mut sequence = serializer.serialize_seq(Some(list.len()))?;
                for item in list {
                    sequence.serialize_element(item)?;
                }
                sequence.end()
            }
            Value::Object(map) => map.serialize(serializer),
        }
    }
}

impl<V: Serialize> Serialize for Map<String, V> {
    fn serialize<S: Serializer>(&self, serializer: S) -> Result<S::Ok, S::Error> {
        let mut out = serializer.serialize_map(Some(self.len()))?;
        for (key, value) in self.iter() {
            out.serialize_entry(key, value)?;
        }
        out.end()
    }
}

impl<'de> Deserialize<'de> for Value {
    /// The same values `serde_json::Value` deserializes to.
    fn deserialize<D: Deserializer<'de>>(deserializer: D) -> Result<Value, D::Error> {
        struct ValueVisitor;
        impl<'de> Visitor<'de> for ValueVisitor {
            type Value = Value;

            fn expecting(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
                formatter.write_str("any valid JSON value")
            }
            fn visit_bool<E>(self, value: bool) -> Result<Value, E> {
                Ok(Value::Bool(value))
            }
            fn visit_i64<E>(self, value: i64) -> Result<Value, E> {
                Ok(Value::Number(value.into()))
            }
            fn visit_u64<E>(self, value: u64) -> Result<Value, E> {
                Ok(Value::Number(value.into()))
            }
            fn visit_f64<E>(self, value: f64) -> Result<Value, E> {
                Ok(Number::from_f64(value).map_or(Value::Null, Value::Number))
            }
            fn visit_str<E>(self, value: &str) -> Result<Value, E> {
                Ok(Value::String(value.to_string()))
            }
            fn visit_string<E>(self, value: String) -> Result<Value, E> {
                Ok(Value::String(value))
            }
            fn visit_none<E>(self) -> Result<Value, E> {
                Ok(Value::Null)
            }
            fn visit_some<D: Deserializer<'de>>(self, deserializer: D) -> Result<Value, D::Error> {
                Deserialize::deserialize(deserializer)
            }
            fn visit_unit<E>(self) -> Result<Value, E> {
                Ok(Value::Null)
            }
            fn visit_seq<A: SeqAccess<'de>>(self, mut access: A) -> Result<Value, A::Error> {
                let mut list = Vec::with_capacity(access.size_hint().unwrap_or(0).min(4096));
                while let Some(item) = access.next_element()? {
                    list.push(item);
                }
                Ok(Value::Array(list))
            }
            fn visit_map<A: MapAccess<'de>>(self, mut access: A) -> Result<Value, A::Error> {
                let mut map = Map::with_capacity(access.size_hint().unwrap_or(0).min(4096));
                while let Some((key, value)) = access.next_entry::<String, Value>()? {
                    map.insert(key, value);
                }
                Ok(Value::Object(map))
            }
        }
        deserializer.deserialize_any(ValueVisitor)
    }
}

impl From<serde_json::Value> for Value {
    fn from(value: serde_json::Value) -> Self {
        match value {
            serde_json::Value::Null => Value::Null,
            serde_json::Value::Bool(value) => Value::Bool(value),
            serde_json::Value::Number(number) => Value::Number(number),
            serde_json::Value::String(string) => Value::String(string),
            serde_json::Value::Array(list) => {
                Value::Array(list.into_iter().map(Value::from).collect())
            }
            serde_json::Value::Object(map) => Value::Object(
                map.into_iter()
                    .map(|(key, value)| (key, Value::from(value)))
                    .collect(),
            ),
        }
    }
}

impl From<Value> for serde_json::Value {
    fn from(value: Value) -> Self {
        match value {
            Value::Null => serde_json::Value::Null,
            Value::Bool(value) => serde_json::Value::Bool(value),
            Value::Number(number) => serde_json::Value::Number(number),
            Value::String(string) => serde_json::Value::String(string),
            Value::Array(list) => {
                serde_json::Value::Array(list.into_iter().map(serde_json::Value::from).collect())
            }
            Value::Object(map) => serde_json::Value::Object(
                map.into_iter()
                    .map(|(key, value)| (key, serde_json::Value::from(value)))
                    .collect(),
            ),
        }
    }
}

macro_rules! from_primitive {
    ($($source:ty => $variant:ident),* $(,)?) => {
        $(impl From<$source> for Value {
            fn from(value: $source) -> Self {
                Value::$variant(value.into())
            }
        })*
    };
}

from_primitive!(
    bool => Bool,
    String => String,
    &str => String,
    i32 => Number,
    i64 => Number,
    u8 => Number,
    u16 => Number,
    u32 => Number,
    u64 => Number,
    usize => Number,
    Number => Number,
);

impl From<f64> for Value {
    fn from(value: f64) -> Self {
        Number::from_f64(value).map_or(Value::Null, Value::Number)
    }
}

impl From<Vec<Value>> for Value {
    fn from(list: Vec<Value>) -> Self {
        Value::Array(list)
    }
}

impl From<Map<String, Value>> for Value {
    fn from(map: Map<String, Value>) -> Self {
        Value::Object(map)
    }
}

impl From<()> for Value {
    fn from((): ()) -> Self {
        Value::Null
    }
}

impl<T: Into<Value>> From<Option<T>> for Value {
    fn from(value: Option<T>) -> Self {
        value.map_or(Value::Null, Into::into)
    }
}

impl<T: Into<Value>> FromIterator<T> for Value {
    fn from_iter<I: IntoIterator<Item = T>>(iter: I) -> Self {
        Value::Array(iter.into_iter().map(Into::into).collect())
    }
}

impl PartialEq<str> for Value {
    fn eq(&self, other: &str) -> bool {
        self.as_str() == Some(other)
    }
}

impl PartialEq<&str> for Value {
    fn eq(&self, other: &&str) -> bool {
        self.as_str() == Some(*other)
    }
}

impl PartialEq<String> for Value {
    fn eq(&self, other: &String) -> bool {
        self.as_str() == Some(other.as_str())
    }
}

impl PartialEq<bool> for Value {
    fn eq(&self, other: &bool) -> bool {
        self.as_bool() == Some(*other)
    }
}

macro_rules! eq_number {
    ($($kind:ty => $read:ident as $as:ty),* $(,)?) => {
        $(impl PartialEq<$kind> for Value {
            /// As `serde_json`: equal when the number reads back as exactly this value.
            fn eq(&self, other: &$kind) -> bool {
                self.$read().is_some_and(|value| value == *other as $as)
            }
        })*
    };
}

eq_number!(
    i8 => as_i64 as i64,
    i16 => as_i64 as i64,
    i32 => as_i64 as i64,
    i64 => as_i64 as i64,
    isize => as_i64 as i64,
    u8 => as_u64 as u64,
    u16 => as_u64 as u64,
    u32 => as_u64 as u64,
    u64 => as_u64 as u64,
    usize => as_u64 as u64,
    f32 => as_f64 as f64,
    f64 => as_f64 as f64,
);

/// `serde_json::to_value`, into this [`Value`].
pub fn to_value<T: Serialize>(value: T) -> serde_json::Result<Value> {
    serde_json::to_value(value).map(Value::from)
}

/// `serde_json::json!`, producing this [`Value`].
#[macro_export]
macro_rules! json {
    ($($json:tt)+) => {
        $crate::json::Value::from(::serde_json::json!($($json)+))
    };
}

impl napi::bindgen_prelude::ToNapiValue for Value {
    unsafe fn to_napi_value(
        env: napi::sys::napi_env,
        value: Self,
    ) -> napi::Result<napi::sys::napi_value> {
        // SAFETY: forwarded unchanged from the caller's contract.
        unsafe { serde_json::Value::to_napi_value(env, serde_json::Value::from(value)) }
    }
}

impl napi::bindgen_prelude::FromNapiValue for Value {
    unsafe fn from_napi_value(
        env: napi::sys::napi_env,
        value: napi::sys::napi_value,
    ) -> napi::Result<Self> {
        // SAFETY: forwarded unchanged from the caller's contract.
        unsafe { serde_json::Value::from_napi_value(env, value) }.map(Value::from)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn matches_serde_json_values() {
        let text = r#"{"b":1,"a":[true,null,1.5,-3,18446744073709551615,"x~/y"],"c":{"d/e":{"f~g":2},"b":{}},"b":3}"#;
        let ours: Value = serde_json::from_str(text).unwrap();
        let theirs: serde_json::Value = serde_json::from_str(text).unwrap();
        assert_eq!(
            serde_json::to_string(&ours).unwrap(),
            serde_json::to_string(&theirs).unwrap()
        );
        assert_eq!(ours.to_string(), theirs.to_string());
        assert_eq!(format!("{ours:#}"), format!("{theirs:#}"));
        assert_eq!(serde_json::Value::from(ours.clone()), theirs);
        assert_eq!(Value::from(theirs.clone()), ours);
        for pointer in [
            "",
            "/a/0",
            "/a/02",
            "/a/5",
            "/c/d~1e/f~0g",
            "/c/b",
            "/missing",
            "a",
            "/a/+1",
        ] {
            assert_eq!(
                ours.pointer(pointer)
                    .map(|value| serde_json::Value::from(value.clone())),
                theirs.pointer(pointer).cloned(),
                "{pointer}"
            );
        }
        assert_eq!(ours["a"][0], true);
        assert!(ours["missing"]["deeper"].is_null());
    }

    #[test]
    fn remove_swaps_like_serde_json() {
        let mut ours: Value = serde_json::from_str(r#"{"a":1,"b":2,"c":3}"#).unwrap();
        let mut theirs: serde_json::Value = serde_json::from_str(r#"{"a":1,"b":2,"c":3}"#).unwrap();
        ours.as_object_mut().unwrap().remove("a");
        theirs.as_object_mut().unwrap().remove("a");
        assert_eq!(
            serde_json::to_string(&ours).unwrap(),
            serde_json::to_string(&theirs).unwrap()
        );
    }
}
