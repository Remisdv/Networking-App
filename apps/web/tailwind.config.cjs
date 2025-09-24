const sharedConfig = require('@alt-platform/config/tailwind');

module.exports = {
  ...sharedConfig,
  content: ['./index.html', './src/**/*.{ts,tsx}'],
};
