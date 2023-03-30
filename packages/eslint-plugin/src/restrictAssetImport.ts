import { Rule } from "eslint";
import path, { relative } from "path";

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

const extractName = (from: string, to: string) => {
  const matchFileExtension = new RegExp(getExtension(to) + "$");

  return (
    relative(from, to)
      /**
       * @note for some reason I need to replace "../"
       * because the file matching resolution never seems to quite match up
       * this may be a bug in my tests and not the code so this code may need
       * adjusting.
       * The original implementation only did this: `.replace(/\.\w+$/, '')`
       */
      .replace(/\.{1,2}\//, "")
      // this strips off the file extension
      .replace(matchFileExtension, "")
  );
};

interface CheckImportParams {
  matchingFileExtensions: string[];
  currentFile: string;
  context: Rule.RuleContext;
}

type CreateCheckImport = (
  config: CheckImportParams
) => Rule.NodeListener["ImportDeclaration"];

const createCheckImport: CreateCheckImport = (config) => (node) => {
  const { matchingFileExtensions, currentFile, context } = config;
  const importPath = node.source.value;

  if (typeof importPath !== "string") {
    return;
  }

  if (!isLocalFile(importPath)) {
    return;
  }

  const importPathFileExtension = getExtension(importPath);
  const currentFileFileExtension = getExtension(currentFile);

  if (matchingFileExtensions.includes(importPathFileExtension)) {
    const importFile = path.resolve(importPath);
    const importName = extractName(currentFile, importFile);
    const currentName = extractName(process.cwd(), currentFile);

    if (importName !== currentName) {
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
    const currentFile = context.getFilename();
    const fileExtOption = options?.cssExtensions ?? ".css";
    const matchingFileExtensions =
      typeof fileExtOption === "string" ? [fileExtOption] : fileExtOption;

    return {
      ImportDeclaration: createCheckImport({
        matchingFileExtensions,
        currentFile,
        context,
      }),
    };
  },
};
