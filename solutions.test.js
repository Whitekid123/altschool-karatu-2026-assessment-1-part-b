"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const deepEqual = require("./problem-1-deep-equal");
const diffObjects = require("./problem-2-object-diff");
const deepFreeze = require("./problem-3-deep-freeze");
const createCounter = require("./problem-4-private-counter");
const validateSchema = require("./problem-5-schema-validator");

test("Deep Equal: the three exercise examples", () => {
  assert.equal(deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } }), true);
  assert.equal(deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 3 } }), false);
  assert.equal(deepEqual({ a: 1 }, { a: 1, b: 2 }), false);
});

test("Deep Equal: null, primitives, key order and missing keys", () => {
  assert.equal(deepEqual(null, null), true);
  assert.equal(deepEqual(null, {}), false);
  assert.equal(deepEqual(1, "1"), false);
  assert.equal(deepEqual(NaN, NaN), true);
  assert.equal(deepEqual(0, -0), false);
  assert.equal(deepEqual({ a: 1, b: 2 }, { b: 2, a: 1 }), true);
  assert.equal(deepEqual({ a: undefined }, { b: undefined }), false);
  assert.equal(deepEqual({ a: undefined }, {}), false);
  assert.equal(deepEqual({ a: 1 }, Object.create({ a: 1 })), false);
});

test("Deep Equal: arrays have ordered values and lengths", () => {
  assert.equal(deepEqual([1, { a: 2 }], [1, { a: 2 }]), true);
  assert.equal(deepEqual([1, 2], [2, 1]), false);
  assert.equal(deepEqual([], {}), false);
  assert.equal(deepEqual(new Array(2), []), false);
});

test("Object Diff: exercise example and unchanged inputs", () => {
  const oldObj = Object.freeze({ name: "Setemi", role: "Engineer", country: "Jamaica" });
  const newObj = Object.freeze({ name: "Setemi", role: "Senior Engineer", city: "Kingston" });
  assert.deepEqual(diffObjects(oldObj, newObj), {
    added: { city: "Kingston" },
    removed: { country: "Jamaica" },
    changed: { role: { from: "Engineer", to: "Senior Engineer" } },
  });
});

test("Object Diff: additions and removals distinguish undefined from absence", () => {
  assert.deepEqual(diffObjects({ removed: undefined }, { added: undefined }), {
    added: { added: undefined }, removed: { removed: undefined }, changed: {},
  });
  assert.deepEqual(diffObjects({}, {}), { added: {}, removed: {}, changed: {} });
  assert.deepEqual(diffObjects({ a: 1 }, { a: 1 }), { added: {}, removed: {}, changed: {} });
});

test("Object Diff: top-level comparison preserves nested references", () => {
  const shared = { a: 1 };
  const before = { b: 2 };
  const after = { b: 2 };
  const result = diffObjects({ same: shared, nested: before }, { same: shared, nested: after });
  assert.deepEqual(Object.keys(result.changed), ["nested"]);
  assert.equal(result.changed.nested.from, before);
  assert.equal(result.changed.nested.to, after);
});

test("Object Diff: inherited keys are ignored and special keys are preserved", () => {
  assert.deepEqual(diffObjects({}, Object.create({ inherited: 1 })), {
    added: {}, removed: {}, changed: {},
  });
  const newObj = Object.fromEntries([["__proto__", 7]]);
  const result = diffObjects({}, newObj);
  assert.equal(Object.hasOwn(result.added, "__proto__"), true);
  assert.equal(result.added.__proto__, 7);
  assert.equal(Object.getPrototypeOf(result.added), Object.prototype);
});

test("Deep Freeze: exercise object stays unchanged", () => {
  const original = { api: { baseUrl: "https://x.com", retries: 3 }, debug: false };
  const config = deepFreeze(original);
  assert.equal(config, original);
  assert.equal(Object.isFrozen(config), true);
  assert.equal(Object.isFrozen(config.api), true);
  assert.throws(() => { config.api.baseUrl = "https://changed.com"; }, TypeError);
  assert.throws(() => { config.debug = true; }, TypeError);
  assert.equal(config.api.baseUrl, "https://x.com");
  assert.equal(config.debug, false);
});

test("Deep Freeze: nested arrays and already frozen parents", () => {
  const data = Object.freeze({ items: [{ enabled: true }], empty: null });
  deepFreeze(data);
  assert.equal(Object.isFrozen(data.items), true);
  assert.equal(Object.isFrozen(data.items[0]), true);
  assert.throws(() => data.items.push({}), TypeError);
  assert.equal(deepFreeze(null), null);
});

test("Deep Freeze: circular and shared references", () => {
  const child = { value: 1 };
  const data = { first: child, second: child };
  data.self = data;
  assert.equal(deepFreeze(data), data);
  assert.equal(Object.isFrozen(child), true);
  assert.equal(Object.isFrozen(data), true);
});

test("Private Counter: exercise example and getter", () => {
  const counter = createCounter();
  assert.equal(counter.value, 0);
  counter.increment();
  counter.increment();
  counter.decrement();
  assert.equal(counter.value, 1);
  assert.equal(counter.count, undefined);
  assert.equal(typeof Object.getOwnPropertyDescriptor(counter, "value").get, "function");
  assert.throws(() => { counter.value = 99; }, TypeError);
  assert.equal(counter.value, 1);
});

test("Private Counter: instances are independent and public count cannot alter closure", () => {
  const first = createCounter();
  const second = createCounter();
  first.increment();
  second.decrement();
  first.count = 100;
  assert.equal(first.value, 1);
  assert.equal(second.value, -1);
  const increment = first.increment;
  increment();
  assert.equal(first.value, 2);
});

test("Schema Validator: both exercise examples with exact error messages", () => {
  const schema = { name: "string", age: "number", isAdmin: "boolean" };
  assert.deepEqual(validateSchema({ name: "Ada", age: 21, isAdmin: false }, schema), []);
  assert.deepEqual(validateSchema({ name: "Ada", age: "21" }, schema), [
    "age: expected number, got string", "isAdmin: missing property",
  ]);
});

test("Schema Validator: own keys, undefined values, extra keys and empty schema", () => {
  assert.deepEqual(validateSchema(Object.create({ name: "Ada" }), { name: "string" }), [
    "name: missing property",
  ]);
  assert.deepEqual(validateSchema({ value: undefined }, { value: "undefined" }), []);
  assert.deepEqual(validateSchema({}, { value: "undefined" }), ["value: missing property"]);
  assert.deepEqual(validateSchema({ name: "Ada", extra: true }, { name: "string" }), []);
  assert.deepEqual(validateSchema({}, {}), []);
});

test("Schema Validator: follows literal typeof rules", () => {
  assert.deepEqual(validateSchema({ value: null, list: [], count: NaN }, {
    value: "object", list: "object", count: "number",
  }), []);
});
