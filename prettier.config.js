// https://prettier.io/docs/en/options.html
module.exports = {
  tabWidth: 2,
  printWidth: 140,
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  overrides: [
    {
      files: ['*.json'],
      options: {
        tabWidth: 2,
      },
    },
  ],
};
