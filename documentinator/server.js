const express = require("express");
const chokidar = require("chokidar");
const path = require("path");
const fs = require("fs").promises;
const { buildDocs } = require("./builder");

async function serve(docsDir, port = 3000) {
  const app = express();

  // Build docs initially
  await buildDocs(docsDir);

  // Serve static files from dist as root
  app.use(express.static(path.join(process.cwd(), "dist")));

  // Redirect root to index.html if it exists
  app.get("/", async (req, res, next) => {
    try {
      await fs.access(path.join(process.cwd(), "dist", "index.html"));
      res.redirect("/index.html");
    } catch {
      next();
    }
  });

  // Watch for changes
  const watcher = chokidar.watch(docsDir, {
    ignored: /(^|[\/\\])\../,
    persistent: true,
  });

  watcher.on("change", async (path) => {
    console.log(`File ${path} has been changed, rebuilding...`);
    await buildDocs(docsDir);
  });

  // Start server
  app.listen(port, () => {
    console.log(`Documentation server running at http://localhost:${port}`);
  });
}

module.exports = {
  serve,
};
