import { Rule } from "eslint";
import path from "path";

/**
 * Parses a filename to extract the extension.
 * @note the built in `extname` from `path` will provide an extension as ".scss" when
 * the intended extension is ".module.scss". This function works around this problem.
 * @param filename
 * @returns
 */
const getExtension = (filename: string) => {
  const parsedPath = path.parse(filename);
  return parsedPath.base.substring(parsedPath.base.indexOf("."));
};

const isLocalFile = (importPath: string) => {
  return importPath.startsWith(".") || importPath.startsWith("/");
};

const stripExtension = (filepath: string) => {
  const matchFileExtension = new RegExp(getExtension(filepath) + "$");

  return filepath.replace(matchFileExtension, "");
};

interface CheckImportParams {
  matchingFileExtensions: string[];
  currentFilePath: string;
  context: Rule.RuleContext;
}

type CreateCheckImport = (
  config: CheckImportParams
) => Rule.NodeListener["ImportDeclaration"];

const createCheckImport: CreateCheckImport = (config) => (node) => {
  const { matchingFileExtensions, currentFilePath, context } = config;

  const importPath = node.source.value;

  if (typeof importPath !== "string") {
    return;
  }

  if (!isLocalFile(importPath)) {
    return;
  }

  const currentFileFolderPath = path.parse(currentFilePath).dir;

  const importPathFileExtension = getExtension(importPath);
  const currentFileFileExtension = getExtension(currentFilePath);

  if (matchingFileExtensions.includes(importPathFileExtension)) {
    const fullImportPath = path.join(currentFileFolderPath, importPath);

    if (stripExtension(fullImportPath) !== stripExtension(currentFilePath)) {
      const parsedCurrentFile = path.parse(currentFilePath);

      const currentName = stripExtension(
        `${parsedCurrentFile.name}${parsedCurrentFile.ext}`
      );

      context.report({
        node,
        message: `Import path "${importPath}" should match current file ${currentName}${currentFileFileExtension} as "./${currentName}${importPathFileExtension}"`,
      });
    }
  }
};

interface Options {
  /**
   * @default '.css'
   */
  cssExtensions: string | string[];
}

export const rule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "restricts imports of CSS files where the name of the CSS file does not match the current file",
      category: "Possible Errors",
      recommended: true,
    },
    schema: [
      {
        type: "object",
        properties: {
          cssExtensions: {
            type: ["string", "array"],
          },
        },
      },
    ],
  },
  create(context): Rule.RuleListener {
    const options: Options | undefined = context.options[0];
    const currentFilePath = context.getFilename();
    const fileExtOption = options?.cssExtensions ?? [
      ".css",
      ".module.css",
      ".scss",
      ".module.scss",
    ];
    const matchingFileExtensions =
      typeof fileExtOption === "string" ? [fileExtOption] : fileExtOption;

    return {
      ImportDeclaration: createCheckImport({
        matchingFileExtensions,
        currentFilePath,
        context,
      }),
    };
  },
};
