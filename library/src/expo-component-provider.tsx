import * as React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export function ExpoPreviewProvider({ children, port = 3000 }: any) {
  let SelectedComponent = null;

  const ws = useWebsocket(port);

  try {
    SelectedComponent = require("expo-preview-internal");
  } catch (error) {
    console.log({ error });
    SelectedComponent = null;
  }

  function onClose() {
    ws.send("onClosePress");
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      {children}
      {Boolean(SelectedComponent) && (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: "white" }]}>
          <View
            style={{
              position: "absolute",
              bottom: 64,
              left: 0,
              right: 0,
              alignContent: "center",
            }}
          >
            <Button title="Close" onPress={() => onClose()} />
          </View>

          <SelectedComponent />
        </View>
      )}
    </View>
  );
}

function useWebsocket(port: number) {
  const [ws, setWs] = React.useState(new WebSocket(`ws://localhost:${port}`));

  React.useEffect(() => {
    setWs(new WebSocket(`ws://localhost:${port}`));
  }, [port]);

  React.useEffect(() => {
    function onOpen() {
      console.log("onOpen()");
    }

    function onError(error: any) {
      console.log("onError()");
      console.log({ error });
    }

    function onClose() {
      console.log("onClose()");
    }

    function onMessage(message: any) {
      console.log("onMessage()");
      console.log({ message });
    }

    ws.addEventListener("open", onOpen);
    ws.addEventListener("error", onError);
    ws.addEventListener("close", onClose);
    ws.addEventListener("message", onMessage);

    return () => {
      ws.removeEventListener("open", onOpen);
      ws.removeEventListener("error", onError);
      ws.removeEventListener("close", onClose);
      ws.removeEventListener("message", onMessage);
    };
  }, []);

  return ws;
}
