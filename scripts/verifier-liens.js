#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = process.cwd();
const htmlFiles = [];
const problems = [];
const ignoredProtocols = /^(https?:|mailto:|tel:|sms:|whatsapp:|#)/i;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "docs" || entry.name === "node_modules") {
      continue;
    }
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      htmlFiles.push(fullPath);
    }
  }
}

function existsForReference(file, value) {
  const clean = value.split("#")[0].split("?")[0];
  if (!clean || ignoredProtocols.test(clean)) {
    return true;
  }
  if (clean.startsWith("/")) {
    problems.push(`${path.relative(root, file)}: chemin absolu interdit "${value}"`);
    return false;
  }
  const target = path.resolve(path.dirname(file), clean);
  if (!target.startsWith(root)) {
    problems.push(`${path.relative(root, file)}: lien sortant du projet "${value}"`);
    return false;
  }
  if (!fs.existsSync(target)) {
    problems.push(`${path.relative(root, file)}: ressource introuvable "${value}"`);
    return false;
  }
  return true;
}

walk(root);

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const attrPattern = /\b(?:href|src|poster)\s*=\s*["']([^"']+)["']/gi;
  const srcsetPattern = /\bsrcset\s*=\s*["']([^"']+)["']/gi;
  let match;

  while ((match = attrPattern.exec(html)) !== null) {
    existsForReference(file, match[1]);
  }

  while ((match = srcsetPattern.exec(html)) !== null) {
    const sources = match[1].split(",");
    for (const source of sources) {
      const url = source.trim().split(/\s+/)[0];
      existsForReference(file, url);
    }
  }
}

if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}

console.log(`OK - ${htmlFiles.length} fichier(s) HTML controles.`);
