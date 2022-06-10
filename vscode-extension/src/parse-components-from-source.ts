import { Parser } from "acorn";

export function parseComponentsFromSource(sourceCode: string) {
  let body = [];

  try {
    const ast: any = Parser.extend(require("acorn-jsx")()).parse(sourceCode, {
      ecmaVersion: "latest",
      sourceType: "module",
    });

    body = ast.body;
  } catch (error) {
    console.log({ error });
  }

  let components = new Map();

  for (const node of body) {
    // const MyComponent = () => {}
    if (node.type === "VariableDeclaration") {
      parseVariableDeclarations(node, { isExported: false });
    }

    // function MyComponent() {}
    if (node.type === "FunctionDeclaration") {
      parseFunctionDeclaration(node, { isExported: false });
    }

    // export const MyComponent = () => {}
    if (node.type === "ExportNamedDeclaration") {
      if (node.declaration) {
        const declarationType = node.declaration.type;

        if (declarationType === "VariableDeclaration") {
          parseVariableDeclarations(node.declaration, { isExported: true });
        }

        if (declarationType === "FunctionDeclaration") {
          parseFunctionDeclaration(node.declaration, {
            isExported: true,
          });
        }
      }

      // export { MyComponent }
      if (node.specifiers) {
        for (const specifier of node.specifiers) {
          if (specifier.type === "ExportSpecifier") {
            const component = components.get(specifier.local.name);
            components.set(component.name, { ...component, isExported: true });
          }
        }
      }
    }

    if (node.type === "ExportDefaultDeclaration") {
      // export default MyComponent
      if (node.declaration.type === "Identifier") {
        const previousEntry = components.get(node.declaration.name);
        if (previousEntry != null) {
          components.set("default", {
            ...node.declaration.id,
            ...previousEntry,
            isExported: true,
          });
          components.delete(node.declaration.name);
        }
      } else {
        // export default function MyComponent() {}
        components.set("default", {
          ...node.declaration.id,
          isExported: true,
        });
      }
    }
  }

  function parseVariableDeclarations(
    node: any,
    { isExported = false }: { isExported: boolean }
  ) {
    const declarations = node.declarations ?? [];
    for (const declaration of declarations) {
      if (declaration.init?.type === "ArrowFunctionExpression") {
        const name: string = declaration.id?.name ?? "";

        if (isCapitalized(name)) {
          components.set(declaration.id?.name, {
            isExported,
            ...declaration.id,
          });
        }
      }
    }
  }

  function parseFunctionDeclaration(
    node: any,
    { isExported = false }: { isExported: boolean }
  ) {
    const name = node.id.name;

    if (isCapitalized(name)) {
      components.set(node.id.name, { isExported, ...node.id });
    }
  }

  function isCapitalized(str: string) {
    const firstLetter = str.charAt(0);
    return firstLetter === firstLetter.toUpperCase();
  }

  return components;
}
