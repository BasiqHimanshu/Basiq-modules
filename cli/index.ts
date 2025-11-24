#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { diffLines } = require("diff");

const args = process.argv.slice(2);
const command = args[0];
const component = args[1];

if (!command || !component) {
  console.log("Usage: basiq360-modules add <component>");
  process.exit(1);
}

if (command === "add") {
  installComponent(component);
}

function installComponent(name) {
  // FINAL FIX: go two levels up to find templates
  const sourcePath = path.join(__dirname, "../../components", `${name}.tsx`);

  const targetPath = path.join(process.cwd(), "src", "components", `${name}.tsx`);

  if (!fs.existsSync(sourcePath)) {
    console.log(`❌ Component "${name}" does not exist.`);
    return;
  }

  const templateCode = fs.readFileSync(sourcePath, "utf8");

  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, templateCode);

  console.log(`✔ Installed ${name}!`);
  console.log(`➡ File created at src/components/${name}.tsx`);
}
