// Problem 5: validate required own properties against the schema's typeof strings.
function validateSchema(obj, schema) {
  const errors = [];

  for (const [key, expectedType] of Object.entries(schema)) {
    if (!Object.hasOwn(obj, key)) {
      errors.push(`${key}: missing property`);
    } else {
      const actualType = typeof obj[key];
      if (actualType !== expectedType) {
        errors.push(`${key}: expected ${expectedType}, got ${actualType}`);
      }
    }
  }

  return errors;
}

if (require.main === module) {
  const schema = { name: "string", age: "number", isAdmin: "boolean" };
  console.log(validateSchema({ name: "Ada", age: 21, isAdmin: false }, schema)); // []
  console.log(validateSchema({ name: "Ada", age: "21" }, schema));
  // ["age: expected number, got string", "isAdmin: missing property"]
}

module.exports = validateSchema;
