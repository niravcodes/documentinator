#!/usr/bin/env node
const { buildDocs } = require("./builder");
const { serve } = require("./server");

async function main() {
  const command = process.argv[2];
  const docsDir = process.argv[3] || "./docs";

  if (!command) {
    console.error("Please specify a command: build or serve");
    process.exit(1);
  }

  try {
    switch (command) {
      case "build":
        await buildDocs(docsDir);
        console.log("Documentation built successfully!");
        break;
      case "serve":
        await serve(docsDir);
        break;
      default:
        console.error("Unknown command. Use build or serve");
        process.exit(1);
    }
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();
