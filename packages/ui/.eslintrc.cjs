module.exports = {
  root: true,
  extends: ["@alt-platform/config/eslint"],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },
};
