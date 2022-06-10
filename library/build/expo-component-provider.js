"use strict";
exports.__esModule = true;
exports.ExpoPreviewProvider = void 0;
var React = require("react");
var react_native_1 = require("react-native");
function ExpoPreviewProvider(_a) {
    var children = _a.children, _b = _a.port, port = _b === void 0 ? 3000 : _b;
    var SelectedComponent = null;
    var ws = useWebsocket(port);
    try {
        SelectedComponent = require("expo-preview-internal");
    }
    catch (error) {
        console.log({ error: error });
        SelectedComponent = null;
    }
    function onClose() {
        ws.send("onClosePress");
    }
    return (<react_native_1.View style={react_native_1.StyleSheet.absoluteFill}>
      {children}
      {Boolean(SelectedComponent) && (<react_native_1.View style={[react_native_1.StyleSheet.absoluteFill, { backgroundColor: "white" }]}>
          <react_native_1.View style={{
                position: "absolute",
                bottom: 64,
                left: 0,
                right: 0,
                alignContent: "center"
            }}>
            <react_native_1.Button title="Close" onPress={function () { return onClose(); }}/>
          </react_native_1.View>

          <SelectedComponent />
        </react_native_1.View>)}
    </react_native_1.View>);
}
exports.ExpoPreviewProvider = ExpoPreviewProvider;
function useWebsocket(port) {
    var _a = React.useState(new WebSocket("ws://localhost:" + port)), ws = _a[0], setWs = _a[1];
    React.useEffect(function () {
        setWs(new WebSocket("ws://localhost:" + port));
    }, [port]);
    React.useEffect(function () {
        function onOpen() {
            console.log("onOpen()");
        }
        function onError(error) {
            console.log("onError()");
            console.log({ error: error });
        }
        function onClose() {
            console.log("onClose()");
        }
        function onMessage(message) {
            console.log("onMessage()");
            console.log({ message: message });
        }
        ws.addEventListener("open", onOpen);
        ws.addEventListener("error", onError);
        ws.addEventListener("close", onClose);
        ws.addEventListener("message", onMessage);
        return function () {
            ws.removeEventListener("open", onOpen);
            ws.removeEventListener("error", onError);
            ws.removeEventListener("close", onClose);
            ws.removeEventListener("message", onMessage);
        };
    }, []);
    return ws;
}
