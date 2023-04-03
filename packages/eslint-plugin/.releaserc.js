module.exports = {
  // Branches that you want to run semantic-release on
  branches: [
    { name: "main" },
    { name: "alpha", channel: "alpha", prerelease: true },
    { name: "beta", channel: "beta", prerelease: true },
  ],
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalcommits",
        parserOpts: {
          noteKeywords: ["BREAKING CHANGE", "BREAKING CHANGES"], // consider both keywords as indicator for creating major release
        },
      },
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "conventionalcommits",
      },
    ],
    [
      "@semantic-release/changelog",
      {
        // Tells semantic-release to create a changelog file with this name and path
        changelogFile: "CHANGELOG.md",
      },
    ],
    [
      "@semantic-release/npm",
      {
        tarballDir: "release",
      },
    ],
    [
      "@semantic-release/github",
      {
        assets: "release/*.tgz",
      },
    ],
    [
      "@semantic-release/git",
      {
        // Tells semantic-release to commit updates to these assets back to the repo after the new release is made
        assets: ["package.json", "CHANGELOG.md"],
        // Specifies the commit message for the new release when the package.json and CHANGELOG files are updated and commited back to the repo
        message: "v.${nextRelease.version} [skip ci]",
      },
    ],
  ],
};
