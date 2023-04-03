# `@synbydesign-eslint`

This eslint plugin is designed restrict how CSS-like assets are imported.

# Quickstart

## Step 1: Installation

First, install the required packages for [ESLint](https://eslint.org/) and this plugin:

```bash
npm install -D @synbydesign-eslint/eslint-plugin
```

## Step 2: Configuration

Next, create a `.eslintrc` config file in the root of your project, and populate it with the following:

```
// .eslintrc
{
  "plugins": ["@synbydesign-eslint"],
  "rules": {
    "@synbydesign-eslint/restrict-asset-import": ["error"]
  }
}
```

## Step 3: Running ESLint

```bash
npx eslint .
```

# Rules

## `@synbydesign-eslint/restrict-asset-import`

Requires that CSS assets are co-located with a component and the CSS asset matches the same name. By default, the rule will match files with the extension `.css`, `.scss`, `.module.css`, and `.module.scss`.

### Correct

```tsx
// App.tsx
import "./App.css"; // OK!
import "./App.scss"; // OK!
import styles from "./App.module.css"; // OK!
import scssStyles from "./App.moulde.scss"; // OK!

export const App = () => {
  return <div>Hello world</div>;
};
```

### Incorrect

```tsx
// App.tsx
import "./Foo.css"; // Fail: different name
import "./Foo.scss"; // Fail: different name
import styles from "./Foo.module.css"; // Fail: different name
import scssStyles from "./Foo.moulde.scss"; // Fail: different name

import "./other/directory/App.css"; // Fail: different directory
import "./other/directory/App.scss"; // Fail: different directory
import styles from "./other/directory/App.module.css"; //Fail: different directory
import scssStyles from "./other/directory/App.moulde.scss"; // Fail: different directory

export const App = () => {
  return <div>Hello world</div>;
};
```

### Options

You can modify the default extensions by supplying a single `string` or an array of `string[]`s.

```json
// .eslintrc
{
  "plugins": ["@synbydesign-eslint"],
  "rules": {
    "@synbydesign-eslint/restrict-asset-import": [
      "error",
      {
        // Applies *only* to files matching *.styl extension
        "cssExtensions": ".styl"
      }
    ]
  }
}
```

```json
// .eslintrc
{
  "plugins": ["@synbydesign-eslint"],
  "rules": {
    "@synbydesign-eslint/restrict-asset-import": [
      "error",
      {
        // applies to all the listed extensions
        "cssExtensions": [
          ".module.scss",
          ".module.css",
          ".css",
          ".scss",
          ".styl",
          ".module.styl"
        ]
      }
    ]
  }
}
```
