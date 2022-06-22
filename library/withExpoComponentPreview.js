const path = require("path");
const fs = require("fs");
const websocketServer = require("./build/websocket-server");

function withExpoComponentPreview(config) {
  const pathToComponentFile = path.resolve(
    config.projectRoot,
    ".expo",
    "expo-component-preview.js"
  );

  fs.writeFileSync(pathToComponentFile, emptyTemplate, { encoding: "utf-8" });

  config.resolver.extraNodeModules["expo-component-preview-internal"] =
    pathToComponentFile;
  // TODO - make configurable
  const websocketPort = 3241;

  websocketServer.start({ port: websocketPort, root: config.projectRoot });

  return config;
}

const emptyTemplate = `
module.exports = null
`;

module.exports = withExpoComponentPreview;
