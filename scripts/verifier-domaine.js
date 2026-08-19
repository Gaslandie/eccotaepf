#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { siteUrl } = require("./config");

const root = path.resolve(__dirname, "..");
const expected = new URL(siteUrl);
const allowedExternalHosts = new Set(["schema.org", "wa.me", "www.sitemaps.org"]);
const files = [];
const problems = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "assets" || entry.name === "docs" || entry.name === "scripts") {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(fullPath);
    }
  }
}

walk(root);
files.push(path.join(root, "sitemap.xml"), path.join(root, "robots.txt"));

for (const file of files) {
  if (!fs.existsSync(file)) {
    problems.push(`${path.relative(root, file)} : fichier introuvable`);
    continue;
  }

  const raw = fs.readFileSync(file, "utf8");
  const urls = raw.match(/https?:\/\/[^\s"'<>]+/g) || [];
  for (const value of urls) {
    const url = new URL(value);
    if (allowedExternalHosts.has(url.hostname)) {
      continue;
    }
    if (url.hostname !== expected.hostname || !url.href.startsWith(siteUrl)) {
      problems.push(`${path.relative(root, file)} : hôte/base inattendu "${value}"`);
    }
  }
}

if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}

console.log(`OK - domaine unique : ${siteUrl}`);
