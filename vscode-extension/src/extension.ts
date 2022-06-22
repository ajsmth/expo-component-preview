// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { parseComponentsFromSource } from "./parse-components-from-source";
import fetch from "cross-fetch";

const openCommand = "expo-component-preview.open";
const supportedLanguages = [
  "javascript",
  "javascriptreact",
  "jsx",
  "typescriptreact",
];
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  vscode.languages.registerCodeLensProvider(supportedLanguages, {
    provideCodeLenses: async (document, token) => {
      const components = parseComponentsFromSource(document.getText());

      const lenses: any = [];

      for (let component of components) {
        const [name, node] = component;

        if (node.isExported) {
          const start = document.positionAt(node.start);
          const lens = new vscode.CodeLens(new vscode.Range(start, start));

          lens.command = {
            command: openCommand,
            arguments: [document.uri.path, name],
            title: `Open "${node.name}" with Expo Component Preview`,
          };

          lenses.push(lens);
        }
      }

      return lenses;
    },
  });

  vscode.commands.registerCommand(
    openCommand,
    (filePath: string, componentName: string) => {
      fetch(
        `http://localhost:3241?filePath=${filePath}&componentName=${componentName}`
      )
        .then((res: any) => res.json())
        .then((response: any) => {
          // TODO - ??
        })
        .catch((error: any) => {
          // TODO - show error message
          console.log({ error });
        });
    }
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
