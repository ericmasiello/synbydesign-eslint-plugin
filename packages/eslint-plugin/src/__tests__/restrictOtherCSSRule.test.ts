import { RuleTester } from "eslint";
import path from "path";
import { it } from "vitest";
import { rule } from "../restrictAssetImport";

it("should pass default configuration", () => {
  const tester = new RuleTester({
    parser: require.resolve("@typescript-eslint/parser"),
  });

  tester.run("restrict-css-imports", rule, {
    valid: [
      {
        code: `import './Foo.css';`,
        filename: path.resolve("./Foo.tsx"),
      },
      {
        code: `
          import 'some-library/dist/lib.css';
          import './Foo.css';
        `,
        filename: path.resolve("./Foo.tsx"),
      },
    ],
    invalid: [
      {
        code: `import './styles/Other.css';`,
        filename: path.resolve("./Foo.tsx"),
        errors: [
          {
            message:
              'Import path "./styles/Other.css" should match current file Foo.tsx as "./Foo.css"',
            type: "ImportDeclaration",
          },
        ],
      },
      {
        code: `import './otherDir/Foo.css';`,
        filename: path.resolve("./Foo.tsx"),
        errors: [
          {
            message:
              'Import path "./otherDir/Foo.css" should match current file Foo.tsx as "./Foo.css"',
            type: "ImportDeclaration",
          },
        ],
      },
    ],
  });
});

it("should ignore file path", () => {
  const tester = new RuleTester({
    parser: require.resolve("@typescript-eslint/parser"),
  });

  tester.run("restrict-css-imports", rule, {
    valid: [
      {
        code: `import './Foo.css';`,
        filename: path.resolve("./src/someFolder/Foo.tsx"),
      },
    ],
    invalid: [
      {
        code: `import './styles/Other.css';`,
        filename: path.resolve("./src/someFolder/Foo.tsx"),
        errors: [
          {
            message:
              'Import path "./styles/Other.css" should match current file Foo.tsx as "./Foo.css"',
            type: "ImportDeclaration",
          },
        ],
      },
    ],
  });
});

it("should match a custom file extension (e.g. `.module.scss`", () => {
  const tester = new RuleTester({
    parser: require.resolve("@typescript-eslint/parser"),
  });

  const options = [{ cssExtensions: ".module.scss" }];

  tester.run("restrict-css-imports", rule, {
    valid: [
      {
        code: `import './Foo.module.scss';`,
        filename: path.resolve("./Foo.tsx"),
        options,
      },
      {
        code: `
          import 'some-library/dist/lib.css';
          import './Foo.module.scss';
        `,
        filename: path.resolve("./Foo.tsx"),
        options,
      },
    ],
    invalid: [
      {
        code: `import './styles/Other.module.scss';`,
        filename: path.resolve("./Foo.tsx"),
        options,
        errors: [
          {
            message:
              'Import path "./styles/Other.module.scss" should match current file Foo.tsx as "./Foo.module.scss"',
            type: "ImportDeclaration",
          },
        ],
      },
      {
        code: `import './otherDir/Foo.module.scss';`,
        filename: path.resolve("./Foo.tsx"),
        options,
        errors: [
          {
            message:
              'Import path "./otherDir/Foo.module.scss" should match current file Foo.tsx as "./Foo.module.scss"',
            type: "ImportDeclaration",
          },
        ],
      },
    ],
  });
});

it("should match multiple custom file extensions (e.g. `[.css, .scss, .module.css, .module.scss]`", () => {
  const tester = new RuleTester({
    parser: require.resolve("@typescript-eslint/parser"),
  });

  const options = [
    { cssExtensions: [".module.scss", ".module.css", ".css", ".scss"] },
  ];

  tester.run("restrict-css-imports", rule, {
    valid: [
      {
        code: `import './Foo.module.scss';`,
        filename: path.resolve("./Foo.tsx"),
        options,
      },
      {
        code: `
          import 'some-library/dist/lib.css';
          import './Foo.module.scss';
        `,
        filename: path.resolve("./Foo.tsx"),
        options,
      },
      {
        code: `
          import 'some-library/dist/lib.css';
          import * as scssStyles from './Foo.module.scss';
          import * as cssStyles from './Foo.module.css';
          import './Foo.scss';
          import './Foo.css';
        `,
        filename: path.resolve("./Foo.tsx"),
        options,
      },
    ],
    invalid: [
      {
        code: `
          import 'some-library/dist/lib.css';
          import { SomeComponent } from "./path/to/SomeComponent";
          import * as scssStyles from './Bar.module.scss';
          import * as cssStyles from './Bar.module.css';
          import './Bar.scss';
          import './Bar.css';
      `,
        filename: path.resolve("./Foo.tsx"),
        options,
        errors: [
          {
            message:
              'Import path "./Bar.module.scss" should match current file Foo.tsx as "./Foo.module.scss"',
            type: "ImportDeclaration",
          },
          {
            message:
              'Import path "./Bar.module.css" should match current file Foo.tsx as "./Foo.module.css"',
            type: "ImportDeclaration",
          },
          {
            message:
              'Import path "./Bar.scss" should match current file Foo.tsx as "./Foo.scss"',
            type: "ImportDeclaration",
          },
          {
            message:
              'Import path "./Bar.css" should match current file Foo.tsx as "./Foo.css"',
            type: "ImportDeclaration",
          },
        ],
      },
    ],
  });
});
