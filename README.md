# Karatu 2026 Assessment 1 - Part B

JavaScript solutions for the five object exercises shown in the supplied screenshots
(slides 295-299, following the introduction at slide 294).

This is the separate Part B repository. It contains no Part A HTML files.

## Solutions

| Problem | Function | File |
| --- | --- | --- |
| 1. Deep Equal | `deepEqual(objA, objB)` | [problem-1-deep-equal.js](problem-1-deep-equal.js) |
| 2. Object Diff | `diffObjects(oldObj, newObj)` | [problem-2-object-diff.js](problem-2-object-diff.js) |
| 3. Deep Freeze | `deepFreeze(obj)` | [problem-3-deep-freeze.js](problem-3-deep-freeze.js) |
| 4. Private Counter Factory | `createCounter()` | [problem-4-private-counter.js](problem-4-private-counter.js) |
| 5. Schema Validator | `validateSchema(obj, schema)` | [problem-5-schema-validator.js](problem-5-schema-validator.js) |

## Run

Use Node.js 18 or newer. There are no dependencies to install.

Run every supplied example:

```sh
npm run examples
```

Run one solution:

```sh
node problem-1-deep-equal.js
```

Run the automated checks:

```sh
npm test
```

Each solution exports its function for reuse. Its example runs only when the file
is executed directly.

## How the solutions work

1. **Deep Equal** checks primitive values, compares the keys on both objects, and
   recursively compares each matching value. It does not use JSON serialization.
2. **Object Diff** compares sets of top-level keys. Added entries contain new values;
   removed entries contain old values; changed entries contain `{ from, to }`.
   Neither input is modified.
3. **Deep Freeze** recursively visits nested objects before freezing each one and
   returns the original object. A WeakSet prevents repeated visits and handles cycles.
4. **Private Counter** stores the count in a function-local variable. The returned
   methods close over it; the `value` getter reads it without exposing a public count.
5. **Schema Validator** checks each schema key with `Object.hasOwn`, then compares
   the property's `typeof` result. Errors follow schema order. Extra properties are allowed.

## Scope and behavior

- The object exercises target plain data objects and arrays with enumerable,
  string-keyed properties. Custom classes, Date, Map, Set, symbols and non-enumerable
  properties are outside this exercise's scope.
- Deep Equal supports acyclic nested data; Object Diff is deliberately shallow:
  separate nested object instances count as changed, even if their contents match.
- Value comparisons use `Object.is`: NaN equals NaN, while +0 and -0 differ.
- Deep Freeze also handles arrays, null values, shared references, cycles, and an
  already shallow-frozen parent. Mutating a frozen object is ignored in non-strict
  mode and throws in strict mode.
- Each counter starts at zero and can become negative.
- Schema validation follows JavaScript's literal `typeof` rules: arrays and null
  have type `"object"`. A missing key differs from a present key whose value is undefined.

## Exercise references

- [Assignment introduction](https://javascript.oluwasetemi.dev/294)
- [Instructor's object exercises](https://github.com/Oluwasetemi/javascript-note/blob/main/pages/objects.md)

The screenshots determine the exercise set; the instructor's source confirms the
Object Diff example and expected `from`/`to` format.
