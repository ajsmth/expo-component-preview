"use strict";
exports.__esModule = true;
exports.ExpoPreviewProvider = void 0;
var React = require("react");
var react_native_1 = require("react-native");
function ExpoPreviewProvider(_a) {
    var children = _a.children;
    // TODO - make port configurable
    var _b = useComponentPreview(), onClose = _b.onClose, SelectedComponent = _b.SelectedComponent;
    return (<react_native_1.View style={react_native_1.StyleSheet.absoluteFill}>
      {children}
      {Boolean(SelectedComponent) && (<react_native_1.View style={[react_native_1.StyleSheet.absoluteFill, { backgroundColor: "white" }]}>
          <SelectedComponent />
          <react_native_1.View style={{
                position: "absolute",
                bottom: 64,
                left: 0,
                right: 0,
                alignContent: "center"
            }}>
            <react_native_1.Button title="Close" onPress={function () { return onClose(); }}/>
          </react_native_1.View>
        </react_native_1.View>)}
    </react_native_1.View>);
}
exports.ExpoPreviewProvider = ExpoPreviewProvider;
function useComponentPreview(port) {
    var _a, _b;
    if (port === void 0) { port = 3241; }
    var _c = React.useState(new WebSocket("ws://localhost:" + port)), ws = _c[0], setWs = _c[1];
    var _d = React.useState(""), selectedComponentName = _d[0], setSelectedComponentName = _d[1];
    var SelectedComponent = (_b = (_a = require("expo-component-preview-internal")) === null || _a === void 0 ? void 0 : _a[selectedComponentName]) !== null && _b !== void 0 ? _b : null;
    React.useEffect(function () {
        setWs(new WebSocket("ws://localhost:" + port));
    }, [port]);
    React.useEffect(function () {
        function onOpen() {
            setSelectedComponentName("");
        }
        function onError(error) { }
        function onClose() {
            setSelectedComponentName("");
        }
        function onMessage(message) {
            try {
                var componentName = JSON.parse(message.data).componentName;
                if (componentName != null) {
                    setSelectedComponentName(componentName);
                }
            }
            catch (err) {
                console.log({ err: err });
            }
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
    function onClose() {
        ws.send("onClosePress");
    }
    return {
        SelectedComponent: SelectedComponent,
        ws: ws,
        onClose: onClose
    };
}
