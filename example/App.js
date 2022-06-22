import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { ExpoPreviewProvider } from "expo-component-preview";

export default function App() {
  return (
    <ExpoPreviewProvider>
      <View style={styles.container}>
        <Text>Open up App.tsx test est to start working on your app!</Text>
        <StatusBar style="auto" />
      </View>
    </ExpoPreviewProvider>
  );
}

export function MyComponent() {
  return (
    <View style={{ marginTop: 100 }}>
      <Text>This is cool wow</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
