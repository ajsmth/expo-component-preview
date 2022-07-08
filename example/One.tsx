import { StyleSheet, Text, View } from "react-native";

export default function MyComponent() {
  return (
    <View style={{ marginTop: 100 }}>
      <Text>{`<One/>`}</Text>
    </View>
  );
}

export function MyOtherComponent() {
  return (
    <View style={{ marginTop: 100 }}>
      <Text>{`<OneMyOtherComponent/>`}</Text>
    </View>
  );
}

export function MyOtherComponent2() {
  return (
    <View style={{ marginTop: 100 }}>
      <Text>{`<OneMyOtherComponent2/>`}</Text>
    </View>
  );
}

export function MyOtherComponent3({ awesome }: { awesome: number }) {
  return (
    <View>
      <Text>{`<OneMyOtherComponent123123/>`}</Text>
    </View>
  );
}
