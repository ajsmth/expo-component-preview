import { parse } from "@babel/parser";
import { importsProvider } from "./imports-provider";

type ComponentNode = {
  start: number;
  end: number;
  name: string;
  isExported?: boolean;
};

export function parseComponentsFromSource(sourceCode: string) {
  const ast = parse(sourceCode, {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
  });

  let body = ast.program.body;

  let components = new Map<string, any>();

  function addIfReactComponent(component: any) {
    if (isCapitalized(component.name)) {
      components.set(component.name, component);
    }
  }

  for (const node of body) {
    if (node.type === "ImportDeclaration") {
      if (importsProvider(node)) {
        components.clear();
        break;
      }
    }

    // const MyComponent = () => {}
    if (node.type === "VariableDeclaration") {
      for (let declaration of node.declarations) {
        const component: any = declaration.id;
        component.isExported = false;
        addIfReactComponent(component);
      }
    }

    // function MyComponent() {}
    if (node.type === "FunctionDeclaration") {
      const component: any = node.id;
      component.isExported = false;
      addIfReactComponent(component);
    }

    // // export const MyComponent = () => {}
    if (node.type === "ExportNamedDeclaration") {
      if (node.declaration) {
        const declarationType = node.declaration.type;

        if (declarationType === "VariableDeclaration") {
          for (let declaration of node.declaration.declarations) {
            const component: any = declaration.id;
            component.isExported = true;
            addIfReactComponent(component);
          }
        }

        if (declarationType === "FunctionDeclaration") {
          const component: any = node.declaration.id;
          component.isExported = true;
          addIfReactComponent(component);
        }
      }

      // export { MyComponent }
      if (node.specifiers) {
        for (const specifier of node.specifiers) {
          if (specifier.type === "ExportSpecifier") {
            const component = components.get(specifier.local.name);
            component.isExported = true;
            addIfReactComponent(component);
          }
        }
      }
    }

    if (node.type === "ExportDefaultDeclaration") {
      // export default function [name?](){}
      if (node.declaration.type === "FunctionDeclaration") {
        if (!node.declaration.id) {
          const component: any = node.declaration;
          component.name = "default";
          component.isExported = true;
          components.set("default", component);
        } else {
          const component: any = node.declaration.id;
          component.isExported = true;
          if (isCapitalized(component.name)) {
            components.set("default", component);
          }
        }
      }

      // export default MyComponent
      if (node.declaration.type === "Identifier") {
        const component = components.get(node.declaration.name);
        if (component != null) {
          component.isExported = true;
          components.set("default", component);
          components.delete(component.name);
        }
      }
    }
  }

  function isCapitalized(str: string) {
    const firstLetter = str.charAt(0);
    return firstLetter === firstLetter.toUpperCase();
  }

  return components;
}
