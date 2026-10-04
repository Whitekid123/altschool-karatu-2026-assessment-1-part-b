// Problem 3: freeze an object and its nested objects, then return that object.
function deepFreeze(obj) {
  const visited = new WeakSet();

  function freezeNested(value) {
    if (value === null || typeof value !== "object" || visited.has(value)) {
      return value;
    }

    // Mark first so a circular reference cannot cause endless recursion.
    visited.add(value);
    for (const nestedValue of Object.values(value)) {
      freezeNested(nestedValue);
    }

    return Object.freeze(value);
  }

  return freezeNested(obj);
}

if (require.main === module) {
  const config = deepFreeze({
    api: { baseUrl: "https://x.com", retries: 3 },
    debug: false,
  });
  // These assignments are ignored in non-strict mode.
  // Strict mode would throw TypeError instead.
  config.api.baseUrl = "https://changed.com";
  config.debug = true;
  console.log(config.api.baseUrl, config.debug); // https://x.com false
  console.log(Object.isFrozen(config.api)); // true
}

module.exports = deepFreeze;
