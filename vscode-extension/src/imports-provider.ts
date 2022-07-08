import { parse } from "@babel/parser";

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

type Statements = ReturnType<typeof parse>["program"]["body"];
type Statement = ArrayElement<Statements>;

export function importsProvider(node: Statement) {
  if (node.type === "ImportDeclaration") {
    const { source, specifiers } = node;
    if (source.value === "expo-component-preview") {
      for (let specifier of specifiers) {
        // @ts-ignore
        if (specifier.imported.name === "ExpoPreviewProvider") {
          return true;
        }
      }
    }
  }
  return false;
}
