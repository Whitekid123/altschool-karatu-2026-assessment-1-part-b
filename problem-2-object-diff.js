// Problem 2: find added, removed and changed top-level properties.
function diffObjects(oldObj, newObj) {
  const result = {
    added: {},
    removed: {},
    changed: {},
  };

  for (const key of Object.keys(newObj)) {
    if (!Object.hasOwn(oldObj, key)) {
      result.added[key] = newObj[key];
    } else if (oldObj[key] !== newObj[key]) {
      result.changed[key] = {
        from: oldObj[key],
        to: newObj[key],
      };
    }
  }

  for (const key of Object.keys(oldObj)) {
    if (!Object.hasOwn(newObj, key)) {
      result.removed[key] = oldObj[key];
    }
  }

  return result;
}

console.log(diffObjects(
  { name: "Setemi", role: "Engineer", country: "Jamaica" },
  { name: "Setemi", role: "Senior Engineer", city: "Kingston" }
));
// {
//   added: { city: "Kingston" },
//   removed: { country: "Jamaica" },
//   changed: { role: { from: "Engineer", to: "Senior Engineer" } }
// }
