export type ObjectLiteral<T = any> = Record<string, T>;

export type List<A = any> = ReadonlyArray<A>;

export type Length<L extends List> = L["length"];

/**
Represents an array of strings split using a given character or character set.

Use-case: Defining the return type of a method like `String.prototype.split`.

@example
```
declare function split<S extends string, D extends string>(string: S, separator: D): Split<S, D>;

type Item = 'foo' | 'bar' | 'baz' | 'waldo';
const items = 'foo,bar,baz,waldo';
let array: Item[];

array = split(items, ',');
```

@category String
@category Template literal
*/
export type Split<S extends string, Delimiter extends string> = S extends `${infer Head}${Delimiter}${infer Tail}`
  ? [Head, ...Split<Tail, Delimiter>]
  : S extends Delimiter
    ? []
    : [S];

export type HasNestedPath<Path extends string> = Length<Split<Path, ".">> extends 1 ? false : true;
