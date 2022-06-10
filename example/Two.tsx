import { StyleSheet, Text, View } from "react-native";

export default function MyComponent() {
  return (
    <View style={{ marginTop: 100 }}>
      <Text>{`<Two/>`}</Text>
    </View>
  );
}

export function MyOtherComponent() {
  return (
    <View style={{ marginTop: 100 }}>
      <Text>{`<TwoMyOtherComponent/>`}</Text>
    </View>
  );
}