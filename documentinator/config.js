const fs = require("fs").promises;
const path = require("path");
const yaml = require("js-yaml");

// Default configuration
const defaultConfig = {
  siteTitle: "Documentation",
};

// Load configuration from config.yml if it exists
async function loadConfig(docsDir) {
  try {
    const configPath = path.join(docsDir, "config.yml");
    const configContent = await fs.readFile(configPath, "utf-8");
    return { ...defaultConfig, ...yaml.load(configContent) };
  } catch (error) {
    return defaultConfig;
  }
}

// Get directory metadata from category.yml if it exists
async function getDirMetadata(dirPath) {
  try {
    const metadataPath = path.join(dirPath, "category.yml");
    const content = await fs.readFile(metadataPath, "utf-8");
    return (
      yaml.load(content) || {
        position: Infinity,
        label: path.basename(dirPath),
      }
    );
  } catch (error) {
    return { position: Infinity, label: path.basename(dirPath) };
  }
}

module.exports = {
  loadConfig,
  getDirMetadata,
};
