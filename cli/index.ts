#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { diffLines } = require("diff");

// CLI args
const args = process.argv.slice(2);
const command = args[0];
const component = args[1];

// Validation
if (!command || !component) {
  console.log("Usage: basiq360-modules add <component>");
  process.exit(1);
}

if (command === "add") {
  installComponent(component);
}

function installComponent(name) {
  // FIX: load templates from repo root, not from dist
  const sourcePath = path.join(process.cwd(), "components", `${name}.tsx`);

  const targetPath = path.join(
    process.cwd(),
    "src",
    "components",
    `${name}.tsx`
  );

  if (!fs.existsSync(sourcePath)) {
    console.log(`❌ Component "${name}" does not exist.`);
    process.exit(1);
  }

  let userCode = "";
  if (fs.existsSync(targetPath)) {
    userCode = fs.readFileSync(targetPath, "utf8");
  }

  const templateCode = fs.readFileSync(sourcePath, "utf8");

  if (userCode) {
    const differences = diffLines(userCode, templateCode);
    if (differences.length > 1) {
      console.log(`⚠ Component "${name}" is outdated.`);
      console.log(`➡ Run: npx basiq360-modules update ${name}`);
      return;
    }
  }

  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(sourcePath, targetPath);

  console.log(`✔ Installed ${name}!`);
  console.log(`➡ File created at src/components/${name}.tsx`);
}
