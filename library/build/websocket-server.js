"use strict";
exports.__esModule = true;
exports.start = void 0;
var http_1 = require("http");
var path = require("path");
var fs = require("fs");
var ws_1 = require("ws");
function start(_a) {
    var port = _a.port, root = _a.root;
    var server = http_1.createServer(function (req, res) {
        if (req.method === "GET") {
            var url = new URL(req.url || "", "http://" + req.headers.host);
            var filePath = url.searchParams.get("filePath");
            var componentName = url.searchParams.get("componentName");
            if (filePath != null && componentName != null) {
                updatePreviewComponent(filePath, componentName);
            }
            else {
            }
        }
        res.end();
    });
    var pathToPreviewComponentFile = path.resolve(root, ".expo", "expo-component-preview.js");
    var template = "\nmodule.exports = require('{{ filePath }}')\n  ";
    var emptyTemplate = "\nmodule.exports = null\n  ";
    function updatePreviewComponent(filePath, componentName) {
        if (componentName === void 0) { componentName = "default"; }
        resetPreviewComponent();
        var fileContents = template.replace("{{ filePath }}", filePath);
        fs.writeFileSync(pathToPreviewComponentFile, fileContents, {
            encoding: "utf-8"
        });
        wss.clients.forEach(function (client) {
            client.send(JSON.stringify({ componentName: componentName }));
        });
    }
    function resetPreviewComponent() {
        fs.writeFileSync(pathToPreviewComponentFile, emptyTemplate, {
            encoding: "utf-8"
        });
    }
    server.on("close", function () {
        resetPreviewComponent();
    });
    server.listen(port, function () {
        resetPreviewComponent();
        console.log("Expo Component Preview running on http://localhost:" + port);
    });
    process.on("exit", function () {
        resetPreviewComponent();
        server.close();
    });
    var wss = new ws_1.Server({
        server: server
    });
    wss.on("connection", function (websocket) {
        websocket.on("open", function () { });
        websocket.on("close", function () { });
        websocket.on("message", function (message) {
            if (message.toString() === "onClosePress") {
                resetPreviewComponent();
            }
        });
    });
}
exports.start = start;
