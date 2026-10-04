// Problem 1: check whether two objects have the same keys and values.
function deepEqual(objA, objB) {
  if (objA === objB) {
    return true;
  }

  if (objA === null || objB === null ||
      typeof objA !== "object" || typeof objB !== "object") {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (const key of keysA) {
    // Compare nested values by calling the function again.
    if (!Object.hasOwn(objB, key) || !deepEqual(objA[key], objB[key])) {
      return false;
    }
  }

  return true;
}

console.log(deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })); // true
console.log(deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 3 } })); // false
console.log(deepEqual({ a: 1 }, { a: 1, b: 2 })); // false
