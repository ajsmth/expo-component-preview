import { parse } from "@babel/parser";

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

type Statements = ReturnType<typeof parse>["program"]["body"];
type Statement = ArrayElement<Statements>;

export function returnsJSX(node: Statement) {
  if (node.type === "FunctionDeclaration") {
    if (node.body.type === "BlockStatement") {
      for (let statement of node.body.body) {
        if (statement.type === "ReturnStatement") {
          if (statement.argument?.type.includes("JSX")) {
            return true;
          }

          if (statement.argument?.type === "NullLiteral") {
            return true;
          }
        }
      }
    }
  }

  return false;
}
