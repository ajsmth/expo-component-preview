import { parse } from "@babel/parser";
import { importsProvider } from "../imports-provider";

const parseAST = (sourceCode: string) =>
  parse(sourceCode, { sourceType: "module", plugins: ["jsx", "typescript"] })
    .program.body;

describe("importsProvider()", () => {
  test("import of PreviewProvider component", () => {
    const input = `import { ExpoPreviewProvider } from 'expo-component-preview'`;
    const ast = parseAST(input);
    const result = importsProvider(ast[0]);
    expect(result).toBe(true);
  });

  test("renamed of PreviewProvider component", () => {
    const input = `import { ExpoPreviewProvider as EPP } from 'expo-component-preview'`;
    const ast = parseAST(input);
    const result = importsProvider(ast[0]);
    expect(result).toBe(true);
  });
});
