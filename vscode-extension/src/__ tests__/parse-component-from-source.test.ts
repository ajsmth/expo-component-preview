import { parseComponentsFromSource } from "../parse-components-from-source";

describe("parsing components", () => {
  test("jsx", () => {
    const output = parseComponentsFromSource(`
      import * as React from 'react';
      import { View } from 'react-native';

      function App() {
        return <View>123</View>
      }
    `);      
  });

  test("parse arrow fn", () => {
    const output = parseComponentsFromSource(
      `const MyArrowComponent = () => {}`
    );
    const component = output.get("MyArrowComponent");
    expectNodeAttributes(component);
    expect(component.name).toEqual("MyArrowComponent");
    expect(component.isExported).toBe(false);
  });

  test("parse function component", () => {
    const output = parseComponentsFromSource(
      `function MyFunctionComponent() {}`
    );
    const component = output.get("MyFunctionComponent");
    expectNodeAttributes(component);
    expect(component.name).toEqual("MyFunctionComponent");
    expect(component.isExported).toBe(false);
  });

  test("lowercase function is not a component", () => {
    const output = parseComponentsFromSource(
      `function myFunctionComponent() {}`
    );
    const component = output.get("myFunctionComponent");
    expect(component).not.toBeDefined();
  });

  test("lowercase const is not a component", () => {
    const output = parseComponentsFromSource(
      `let myFunctionComponent = () => {}`
    );
    const component = output.get("myFunctionComponent");
    expect(component).not.toBeDefined();
  });

  test("parse exported arrow fn", () => {
    const output = parseComponentsFromSource(
      `export const MyExportedArrow = () => {}`
    );
    const component = output.get("MyExportedArrow");
    expectNodeAttributes(component);
    expect(component.name).toEqual("MyExportedArrow");
    expect(component.isExported).toBe(true);
  });

  test("parse exported function component", () => {
    const output = parseComponentsFromSource(
      `export function MyExportedFunction() {}`
    );
    const component = output.get("MyExportedFunction");
    expectNodeAttributes(component);
    expect(component.name).toEqual("MyExportedFunction");
    expect(component.isExported).toBe(true);
  });

  test("parse exported variables via const", () => {
    const output = parseComponentsFromSource(
      `const MyArrowComponent = () => {};
      export { MyArrowComponent }
      `
    );

    const component = output.get("MyArrowComponent");
    expectNodeAttributes(component);
    expect(component.name).toEqual("MyArrowComponent");
    expect(component.isExported).toBe(true);
  });

  test("parse exported variables via function", () => {
    const output = parseComponentsFromSource(
      `function MyFunctionComponent() {};
      export { MyFunctionComponent }
      `
    );

    const component = output.get("MyFunctionComponent");
    expectNodeAttributes(component);
    expect(component.name).toEqual("MyFunctionComponent");
    expect(component.isExported).toBe(true);
  });

  test("default export function", () => {
    const output = parseComponentsFromSource(
      `export default function MyFunctionComponent() {};
      `
    );

    const component = output.get("default");
    expectNodeAttributes(component);
    expect(component.name).toEqual("MyFunctionComponent");
    expect(component.isExported).toBe(true);
  });

  test("default export arrow function", () => {
    const output = parseComponentsFromSource(
      ` const MyFunctionComponent = () => {}
        export default MyFunctionComponent
      `
    );

    const component = output.get("default");
    expectNodeAttributes(component);
    expect(component.name).toEqual("MyFunctionComponent");
    expect(component.isExported).toBe(true);
    expect(output.size).toEqual(1);
  });

  test("multiple components", () => {
    const template = `
    const test = 123;
    function MyComponent() {}
    const MyComponent2 = () => {};
    export function MyComponent3() {}
    export default function MyComponent4() {}
    export { MyComponent, MyComponent2 };
    `;

    const output = parseComponentsFromSource(template);

    expect(output.size).toEqual(4);

    expect(output.get("test")).not.toBeDefined();
    expect(output.get("MyComponent").isExported).toBe(true);
    expect(output.get("default").name).toEqual("MyComponent4");
  });

  function expectNodeAttributes(node: any) {
    expect(node.isExported).toBeDefined();
    expect(node.start).toBeDefined();
    expect(node.end).toBeDefined();
    expect(node.name).toBeDefined();
  }
});
