const fs = require("fs").promises;
const path = require("path");
const Mustache = require("mustache");
const matter = require("gray-matter");
const { loadConfig } = require("./config");
const { processMarkdown, extractTitle } = require("./markdown");
const { buildSidebar } = require("./sidebar");

async function getTemplatePath(docsDir, filename) {
  // First check if user has a template in their docs directory
  const userTemplatePath = path.join(docsDir, "template", filename);
  try {
    await fs.access(userTemplatePath);
    return userTemplatePath;
  } catch {
    // Fall back to package template
    return path.join(__dirname, "..", "template", filename);
  }
}

async function buildDocs(docsDir) {
  // Load configuration
  const config = await loadConfig(docsDir);

  // Read template
  const templatePath = await getTemplatePath(docsDir, "index.html");
  const template = await fs.readFile(templatePath, "utf-8");

  // Build sidebar once
  const sidebar = await buildSidebar(docsDir);

  // Create dist directory
  await fs.mkdir("dist", { recursive: true });

  // Copy CSS file
  const cssPath = await getTemplatePath(docsDir, "style.css");
  await fs.copyFile(cssPath, path.join("dist", "style.css"));

  // Process all markdown files
  async function processDir(currentPath = "") {
    const entries = await fs.readdir(path.join(docsDir, currentPath), {
      withFileTypes: true,
    });

    for (const entry of entries) {
      const relativePath = path.join(currentPath, entry.name);
      const fullPath = path.join(docsDir, relativePath);

      if (
        entry.isDirectory() &&
        !entry.name.startsWith(".") &&
        entry.name !== "node_modules" &&
        entry.name !== "template" // Skip template directory
      ) {
        const outDir = path.join("dist", relativePath);
        await fs.mkdir(outDir, { recursive: true });
        await processDir(relativePath);
      } else if (entry.name.endsWith(".md")) {
        const content = await fs.readFile(fullPath, "utf-8");
        const { data: frontmatter } = matter(content);
        const htmlContent = await processMarkdown(
          content,
          docsDir,
          path.dirname(relativePath)
        );

        // Use frontmatter title, h1 title, or filename
        const title = frontmatter.title || (await extractTitle(fullPath));

        // Render template with config and frontmatter data
        const html = Mustache.render(template, {
          title,
          content: htmlContent,
          sidebar,
          siteTitle: config.siteTitle,
          ...frontmatter,
        });

        const outPath = path.join(
          "dist",
          relativePath.replace(/\.md$/, ".html")
        );
        await fs.writeFile(outPath, html);
      }
    }
  }

  await processDir();
}

module.exports = {
  buildDocs,
};
