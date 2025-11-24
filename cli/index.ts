#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { diffLines } from "diff";
import { fileURLToPath } from "url";

// --- Resolve __dirname and __filename in ESM ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Types ---
type SupportedCommand = "add";

// --- CLI Arguments ---
const args = process.argv.slice(2);
const command = args[0] as SupportedCommand | undefined;  // "add"
const component = args[1];                                // "button"

// --- Validation ---
if (!command || !component) {
  console.log("Usage: my-ui add <component>");
  process.exit(1);
}

if (command === "add") {
  installComponent(component);
}

// --- Installer Function ---
function installComponent(name: string): void {
  const sourcePath = path.join(__dirname, "..", "components", `${name}.tsx`);
  const targetPath = path.join(process.cwd(), "src", "components", `${name}.tsx`);

  if (!fs.existsSync(sourcePath)) {
    console.log(`❌ Component "${name}" does not exist.`);
    process.exit(1);
  }
  let userCode = "";
  if (fs.existsSync(targetPath)) {
    userCode = fs.readFileSync(targetPath, "utf8");
  }

  // --- READ TEMPLATE FILE ---
  const templateCode = fs.readFileSync(sourcePath, "utf8");

  // --- DIFF CHECK (Do this BEFORE copying) ---
  if (userCode) {
    const differences = diffLines(userCode, templateCode);

    if (differences.length > 1) {
      console.log(`⚠ The "${name}" component in your project is outdated.`);
      console.log(`➡ Run: npx my-ui update ${name}`);
      return; // stop here to avoid overwriting user's edits
    }
  }

  // Ensure destination directories exist
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });

  // Copy template → project
  fs.copyFileSync(sourcePath, targetPath);

  console.log(`✔ Installed ${name}!`);
  console.log(`➡ File created at src/components/ui/${name}.tsx`);
}
