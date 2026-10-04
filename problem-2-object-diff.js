// Problem 2: report additions, removals and changes to top-level properties.
function diffObjects(oldObj, newObj) {
  const oldKeys = new Set(Object.keys(oldObj));
  const newKeys = new Set(Object.keys(newObj));
  const added = [];
  const removed = [];
  const changed = [];

  for (const key of newKeys) {
    if (!oldKeys.has(key)) {
      added.push([key, newObj[key]]);
    } else if (!Object.is(oldObj[key], newObj[key])) {
      changed.push([key, { from: oldObj[key], to: newObj[key] }]);
    }
  }

  for (const key of oldKeys) {
    if (!newKeys.has(key)) {
      removed.push([key, oldObj[key]]);
    }
  }

  // fromEntries also handles a property named "__proto__" as ordinary data.
  return {
    added: Object.fromEntries(added),
    removed: Object.fromEntries(removed),
    changed: Object.fromEntries(changed),
  };
}

if (require.main === module) {
  console.dir(diffObjects(
    { name: "Setemi", role: "Engineer", country: "Jamaica" },
    { name: "Setemi", role: "Senior Engineer", city: "Kingston" }
  ), { depth: null });
  // added: { city: "Kingston" }
  // removed: { country: "Jamaica" }
  // changed: { role: { from: "Engineer", to: "Senior Engineer" } }
}

module.exports = diffObjects;
