// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const withExpoComponentPreview = require("expo-component-preview/withExpoComponentPreview");
const path = require("path");

const exclusionList = require('metro-config/src/defaults/exclusionList');

// Find the workspace root, this can be replaced with `find-yarn-workspace-root`
const workspaceRoot = path.resolve(__dirname, "..");
const projectRoot = __dirname;

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];
// 2. Let Metro know where to resolve packages, and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

config.resolver.blacklistRE = exclusionList([/vscode-extension\/.*/])

config.resolver.providesModuleNodeModules = [];

withExpoComponentPreview(config)

module.exports = config;
