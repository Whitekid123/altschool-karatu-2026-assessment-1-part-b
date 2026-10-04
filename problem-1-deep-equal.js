// Problem 1: compare the keys and values of nested objects without JSON.stringify.
function deepEqual(objA, objB) {
  if (Object.is(objA, objB)) return true;

  // null is reported as "object" by typeof, so check it separately.
  if (objA === null || objB === null ||
      typeof objA !== "object" || typeof objB !== "object") {
    return false;
  }

  if (Array.isArray(objA) !== Array.isArray(objB)) return false;
  if (Array.isArray(objA) && objA.length !== objB.length) return false;

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!Object.hasOwn(objB, key) || !deepEqual(objA[key], objB[key])) {
      return false;
    }
  }

  return true;
}

if (require.main === module) {
  console.log(deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })); // true
  console.log(deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 3 } })); // false
  console.log(deepEqual({ a: 1 }, { a: 1, b: 2 })); // false
}

module.exports = deepEqual;
