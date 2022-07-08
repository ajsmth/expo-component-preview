import { createServer } from "http";
import * as path from "path";
import * as fs from "fs";
import { Server as WebSocketServer } from "ws";

export function start({ port, root }: any) {
  const server = createServer((req, res) => {
    if (req.method === "GET") {
      const url = new URL(req.url || "", `http://${req.headers.host}`);

      const filePath = url.searchParams.get("filePath");
      const componentName = url.searchParams.get("componentName");

      if (filePath != null && componentName != null) {
        updatePreviewComponent(filePath, componentName);
      } else {
      }
    }

    res.end();
  });

  const pathToPreviewComponentFile = path.resolve(
    root,
    ".expo",
    "expo-component-preview.js"
  );

  const template = `
module.exports = require('{{ filePath }}')
  `;

  const emptyTemplate = `
module.exports = null
  `;

  function updatePreviewComponent(filePath: string, componentName = "default") {
    resetPreviewComponent();

    const fileContents = template.replace(`{{ filePath }}`, filePath);

    fs.writeFileSync(pathToPreviewComponentFile, fileContents, {
      encoding: "utf-8",
    });

    wss.clients.forEach((client) => {
      client.send(JSON.stringify({ componentName }));
    });
  }

  function resetPreviewComponent() {
    fs.writeFileSync(pathToPreviewComponentFile, emptyTemplate, {
      encoding: "utf-8",
    });
  }

  server.on("close", () => {
    resetPreviewComponent();
  });

  server.listen(port, () => {
    resetPreviewComponent();
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
