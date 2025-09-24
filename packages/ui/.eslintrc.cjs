const baseConfig = require.resolve('@alt-platform/config/eslint');

module.exports = {
  root: true,
  extends: [baseConfig],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
};
