const path = require("path");
const fs = require("fs");
const websocketServer = require("./build/websocket-server");

// if changing this, you'll also need to update the `expo-component-provider` require
const previewNodeModuleName = "expo-preview-internal";
// if changing this, you'll also need to update the `websocket-server` require
const previewComponentFileName = "expo-preview-component.js";

function withExpoComponentPreview(config) {
  const pathToComponentFile = path.resolve(
    config.projectRoot,
    ".expo",
    previewComponentFileName
  );

  fs.writeFileSync(pathToComponentFile, emptyTemplate, { encoding: "utf-8" });

  config.resolver.extraNodeModules[previewNodeModuleName] = pathToComponentFile;
  const serverPort = config.server.port;
  const websocketPort = 3000;

  websocketServer.start({ port: websocketPort, root: config.projectRoot });

  return config;
}

const emptyTemplate = `
module.exports = null
`;

module.exports = withExpoComponentPreview;
