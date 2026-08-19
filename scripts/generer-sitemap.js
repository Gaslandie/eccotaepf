#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { siteUrl } = require("./config");

const root = path.resolve(__dirname, "..");

function walk(dir, result = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "assets" || entry.name === "docs" || entry.name === "scripts") {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, result);
    } else if (entry.isFile() && entry.name.endsWith(".html") && entry.name !== "404.html") {
      result.push(fullPath);
    }
  }
  return result;
}

function publicPath(file) {
  const relative = path.relative(root, file).replace(/\\/g, "/");
  if (relative === "index.html") {
    return "";
  }
  if (relative.endsWith("/index.html")) {
    return relative.slice(0, -"index.html".length);
  }
  return relative;
}

function xmlEscape(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function generateSitemap() {
  const urls = walk(root)
    .map((file) => ({
      loc: new URL(publicPath(file), siteUrl).toString(),
      lastmod: fs.statSync(file).mtime.toISOString().slice(0, 10),
    }))
    .sort((a, b) => a.loc.localeCompare(b.loc, "fr"));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>
    <loc>${xmlEscape(url.loc)}</loc>
    <lastmod>${url.lastmod}</lastmod>
  </url>`).join("\n")}
</urlset>
`;

  fs.writeFileSync(path.join(root, "sitemap.xml"), xml, "utf8");
  fs.writeFileSync(path.join(root, "robots.txt"), `User-agent: *
Disallow: /

Sitemap: ${new URL("sitemap.xml", siteUrl).toString()}
`, "utf8");
  return urls.length;
}

if (require.main === module) {
  console.log(`sitemap.xml généré : ${generateSitemap()} URL(s)`);
}

module.exports = { generateSitemap };
