const fs = require("fs").promises;
const fsSync = require("fs");
const path = require("path");
const { marked } = require("marked");
const hljs = require("highlight.js");
const matter = require("gray-matter");

// Extract title from markdown content
async function extractTitle(filePath) {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    const { data } = matter(content);
    if (data.title) {
      return data.title;
    }
    const titleMatch = content.match(/^#\s+(.+)$/m);
    return titleMatch ? titleMatch[1] : path.basename(filePath, ".md");
  } catch (error) {
    return path.basename(filePath, ".md");
  }
}

// Function to copy images and return the new path
function copyImageSync(imagePath, docsDir, currentDir) {
  try {
    const absoluteImagePath = path.join(docsDir, currentDir, imagePath);
    const relativeOutputDir = currentDir;
    const outputDir = path.join("dist", relativeOutputDir);
    fsSync.mkdirSync(outputDir, { recursive: true });

    const imageName = path.basename(imagePath);
    const outputPath = path.join(outputDir, imageName);
    fsSync.copyFileSync(absoluteImagePath, outputPath);

    return path.join(relativeOutputDir, imageName);
  } catch (error) {
    console.warn(
      `Warning: Could not copy image ${imagePath}: ${error.message}`
    );
    return imagePath;
  }
}

// Transform markdown links to HTML links
function transformLink(href, currentDir) {
  if (href.startsWith("http")) {
    return href;
  }

  // Remove .md extension and ensure it starts with /
  const normalizedPath = path
    .join(currentDir, href)
    .replace(/\.md$/, ".html")
    .replace(/\\/g, "/"); // Convert Windows paths to URL paths

  return normalizedPath.startsWith("/") ? normalizedPath : "/" + normalizedPath;
}

// Process markdown content
async function processMarkdown(content, docsDir, currentDir) {
  const { content: markdownContent } = matter(content);

  const renderer = new marked.Renderer();

  renderer.link = (href, title, text) => {
    const newHref = transformLink(href, currentDir);
    return `<a href="${newHref}"${
      title ? ` title="${title}"` : ""
    }>${text}</a>`;
  };

  renderer.image = (href, title, text) => {
    if (href.startsWith("http")) {
      return `<img src="${href}" alt="${text}"${
        title ? ` title="${title}"` : ""
      }>`;
    }

    const newPath = copyImageSync(href, docsDir, currentDir);
    return `<img src="/${newPath}" alt="${text}"${
      title ? ` title="${title}"` : ""
    }>`;
  };

  renderer.code = (code, language) => {
    if (language === "mermaid") {
      const diagramId = "mermaid-" + Math.random().toString(36).substr(2, 9);
      return `<div class="mermaid" id="${diagramId}">${code}</div>`;
    }

    if (language) {
      try {
        const highlighted = hljs.highlight(code, { language }).value;
        return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>`;
      } catch (e) {
        const highlighted = hljs.highlightAuto(code).value;
        return `<pre><code class="hljs">${highlighted}</code></pre>`;
      }
    }

    const highlighted = hljs.highlightAuto(code).value;
    return `<pre><code class="hljs">${highlighted}</code></pre>`;
  };

  marked.use({ renderer });
  return marked.parse(markdownContent);
}

// Process markdown files in a directory and sort by sidebarPosition
async function processMarkdownFiles(dir) {
  const files = await fs.readdir(dir, { withFileTypes: true });
  const mdFiles = files.filter(
    (file) => file.isFile() && file.name.endsWith(".md")
  );

  const fileData = await Promise.all(
    mdFiles.map(async (file) => {
      const filePath = path.join(dir, file.name);
      const content = await fs.readFile(filePath, "utf-8");
      const { data } = matter(content);
      return {
        file,
        position: data.sidebarPosition || Infinity,
        title: await extractTitle(filePath),
      };
    })
  );

  return fileData.sort((a, b) => a.position - b.position);
}

module.exports = {
  extractTitle,
  processMarkdown,
  processMarkdownFiles,
};
