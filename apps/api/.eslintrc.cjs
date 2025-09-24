module.exports = {
  root: true,
  parserOptions: {
    project: ["./tsconfig.json"],
    tsconfigRootDir: __dirname
  },
  extends: ["@alt-platform/config/eslint"],
  ignorePatterns: ["dist", "node_modules"],
};
