import { createServer } from "http";
import * as path from "path";
import * as fs from "fs";
import { Server as WebSocketServer } from "ws";

// if changing this, you'll also need to update the `withExpoComponentPreview` value
const previewComponentFileName = "expo-preview-component.js";

export function start({ port, root }: any) {
  const server = createServer((req, res) => {
    if (req.method === "GET") {
      const url = new URL(req.url || "", `http://${req.headers.host}`);

      const filePath = url.searchParams.get("filePath");

      let componentName = url.searchParams.get("componentName");

      if (filePath != null && componentName != null) {
        updatePreviewComponent(filePath, componentName);
      } else {
        // TODO - warning? message?
      }
    }

    res.end();
  });

  const pathToPreviewComponentFile = path.resolve(
    root,
    ".expo",
    previewComponentFileName
  );

  const template = `
module.exports = require('{{ filePath }}').{{ componentName }}
  `;

  const emptyTemplate = `
module.exports = null
  `;

  function updatePreviewComponent(filePath: string, componentName = "default") {
    resetPreviewComponent();

    fs.writeFileSync(
      pathToPreviewComponentFile,
      template
        .replace(`{{ filePath }}`, filePath)
        .replace(`{{ componentName }}`, componentName),
      { encoding: "utf-8" }
    );
  }

  function resetPreviewComponent() {
    fs.writeFileSync(pathToPreviewComponentFile, emptyTemplate, {
      encoding: "utf-8",
    });
  }

  resetPreviewComponent();

  server.on("close", () => {
    resetPreviewComponent();
  });

  server.listen(port, () => {
    console.log(`Expo Component Preview running on http://localhost:${port}`);
  });

  process.on("exit", () => {
    resetPreviewComponent();
    server.close();
  });

  const wss = new WebSocketServer({
    server,
  });

  wss.on("connection", (websocket) => {
    websocket.on("open", () => {});
    websocket.on("close", () => {});

    websocket.on("message", (message) => {
      if (message.toString() === "onClosePress") {
        resetPreviewComponent();
      }
    });
  });
}
