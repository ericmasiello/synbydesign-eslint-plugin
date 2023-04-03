# `@synbydesign-eslint`

This eslint plugin is designed restrict how CSS-like assets are imported.

See [README](https://github.com/ericmasiello/synbydesign-eslint-plugin/blob/main/packages/eslint-plugin/README.md) for installation and configuration details.

# How to work with this repository

## Configure your `.envrc`

1. Rename `.envrc.dev` to `.envrc.`
2. Update the the tokens with the necessary values
3. `source .envrc`

## Running Commands

This repository is a monorepo managed by Turborepo. Below are common commands you can run:

```bash
# test
npm run test

# lint - @note this intentionally fails inside the App demo component
npm run lint

# build
npm run
```

## Publishing

Make sure the `.envrc` values are correctly set and sourced. Then run:

```bash
# run this from the packaages/esling-config directory
cd packages/eslint-config

# update the version
npm version [major|minor|patch]

# update the commit with the updated version in package.json
git add .
git commit --amend
git push

# publish the new version to npm
npm publish

# create a tag with the latest version
# e.g., `git tag v1.0.1`
git tag v[version-number]
git push --tags
```

At the moment, `semantic-release` does not work correctly. This requires further investigation.
