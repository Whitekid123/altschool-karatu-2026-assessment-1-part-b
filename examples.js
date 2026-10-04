const { execFileSync } = require("node:child_process");
const path = require("node:path");

const files = [
  "problem-1-deep-equal.js",
  "problem-2-object-diff.js",
  "problem-3-deep-freeze.js",
  "problem-4-private-counter.js",
  "problem-5-schema-validator.js",
];

for (const file of files) {
  console.log("\n" + file);
  execFileSync(process.execPath, [path.join(__dirname, file)], { stdio: "inherit" });
}
