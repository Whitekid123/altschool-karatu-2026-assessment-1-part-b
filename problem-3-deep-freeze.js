// Problem 3: freeze an object and its nested objects.
function deepFreeze(obj) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  // Freeze each nested object before freezing the main object.
  for (const value of Object.values(obj)) {
    deepFreeze(value);
  }

  return Object.freeze(obj);
}

const config = deepFreeze({
  api: { baseUrl: "https://x.com", retries: 3 },
  debug: false,
});

// These changes are ignored when this file runs without strict mode.
config.api.baseUrl = "https://changed.com";
config.debug = true;

console.log(config.api.baseUrl, config.debug); // https://x.com false
console.log(Object.isFrozen(config.api)); // true
