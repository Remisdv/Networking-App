const baseConfig = require.resolve("@alt-platform/config/eslint");

module.exports = {
  root: true,
  extends: [baseConfig],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: [require.resolve("./tsconfig.eslint.json")]
  },
  ignorePatterns: ["vite.config.ts", "vitest.config.ts"]
};

