const baseConfig = require.resolve('@alt-platform/config/eslint');

module.exports = {
  root: true,
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  extends: [baseConfig],
  ignorePatterns: ['dist', 'node_modules'],
};
