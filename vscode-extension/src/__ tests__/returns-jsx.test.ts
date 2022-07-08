import { parse } from "@babel/parser";

import { returnsJSX } from "../returns-jsx";

const parseAST = (sourceCode: string) =>
  parse(sourceCode, { sourceType: "module", plugins: ["jsx", "typescript"] })
    .program.body;

describe("returnsJSX()", () => {
  test("smoke", () => {
    const body = parseAST(`
      function Component() {
      }
    `);

    expect(() => returnsJSX(body[0])).not.toThrow();
  });

  test.only("explicit jsx function returns", () => {
    let input = `
      function Component() {
        return <View />;
      }

      function Component2() {
        return <View>123</View>
      }

      function Component3() {
        return null
      }

      function Component4() {
        return <>123</>
      }
      // TODO
      // function Component5() {
      //   const element = (
      //     <View>123</View>
      //   )

      //   return element
      // }
      
      // TODO
      // function Component6() {
      //   const element = () => (
      //     <View>123</View>
      //   )

      //   return element()
      // }
    `;

    const body = parseAST(input);
    body.forEach((node) => {
      const result = returnsJSX(node);
      expect(result).toEqual(true);
    });
  });

});
