const fs = require("fs").promises;
const path = require("path");
const matter = require("gray-matter");
const { getDirMetadata } = require("./config");
const { extractTitle } = require("./markdown");

async function buildSidebar(
  docsDir,
  currentPath = "",
  config = { baseURL: "/" }
) {
  let html = '<ul class="nav-list">';
  const entries = await fs.readdir(path.join(docsDir, currentPath), {
    withFileTypes: true,
  });

  // Get directories and their metadata
  const dirs = entries.filter(
    (entry) =>
      entry.isDirectory() &&
      !entry.name.startsWith(".") &&
      entry.name !== "node_modules"
  );

  const dirEntries = await Promise.all(
    dirs.map(async (dir) => {
      const relativePath = path.join(currentPath, dir.name);
      const fullPath = path.join(docsDir, relativePath);
      const metadata = await getDirMetadata(fullPath);
      return {
        type: "directory",
        dir,
        relativePath,
        position: metadata.position ?? Infinity,
        label: metadata.label || dir.name,
      };
    })
  );

  // Get all markdown files in current directory
  const mdFiles = entries.filter(
    (entry) => entry.isFile() && entry.name.endsWith(".md")
  );

  // Process each file to get its position
  const fileEntries = await Promise.all(
    mdFiles.map(async (file) => {
      const filePath = path.join(docsDir, currentPath, file.name);
      const content = await fs.readFile(filePath, "utf-8");
      const { data } = matter(content);
      const title = data.title || (await extractTitle(filePath));

      return {
        type: "file",
        name: file.name,
        position: data.sidebarPosition ?? Infinity,
        title,
      };
    })
  );

  // Merge and sort both directories and files by position, then by name/title
  const allEntries = [...dirEntries, ...fileEntries].sort((a, b) => {
    if (a.position === b.position) {
      return (a.label || a.title).localeCompare(b.label || b.title);
    }
    return a.position - b.position;
  });

  // Process all entries in order
  for (const entry of allEntries) {
    if (entry.type === "directory") {
      html += `
            <li class="nav-item">
                <span class="nav-folder">${entry.label}</span>
                ${await buildSidebar(docsDir, entry.relativePath, config)}
            </li>
        `;
    } else {
      const urlPath = path
        .join(config.baseURL, currentPath, entry.name)
        .replace(/\.md$/, ".html")
        .replace(/\\/g, "/");
      html += `
            <li class="nav-item">
                <a href="${urlPath}" class="nav-link">${entry.title}</a>
            </li>
        `;
    }
  }

  html += "</ul>";
  return html;
}

module.exports = {
  buildSidebar,
};
