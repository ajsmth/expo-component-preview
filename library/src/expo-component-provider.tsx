import * as React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

type ExpoPreviewProviderProps = {
  children?: any;
};

export function ExpoPreviewProvider({
  children,
}: ExpoPreviewProviderProps) {
  // TODO - make port configurable
  const { onClose, SelectedComponent } = useComponentPreview();

  return (
    <View style={StyleSheet.absoluteFill}>
      {children}
      {Boolean(SelectedComponent) && (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: "white" }]}>
          <SelectedComponent />
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
        </View>
      )}
    </View>
  );
}

function useComponentPreview(port: number = 3241) {
  const [ws, setWs] = React.useState(new WebSocket(`ws://localhost:${port}`));
  const [selectedComponentName, setSelectedComponentName] = React.useState("");

  const SelectedComponent =
    require("expo-component-preview-internal")?.[selectedComponentName] ?? null;

  React.useEffect(() => {
    setWs(new WebSocket(`ws://localhost:${port}`));
  }, [port]);

  React.useEffect(() => {
    function onOpen() {
      setSelectedComponentName("");
    }

    function onError(error: any) {}

    function onClose() {
      setSelectedComponentName("");
    }

    function onMessage(message: any) {
      try {
        const { componentName } = JSON.parse(message.data);

        if (componentName != null) {
          setSelectedComponentName(componentName);
        }
      } catch (err) {
        console.log({ err });
      }
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

  function onClose() {
    ws.send("onClosePress");
  }

  return {
    SelectedComponent,
    ws,
    onClose,
  };
}
