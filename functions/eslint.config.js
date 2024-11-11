// eslint.config.js
module.exports = [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2018,
      sourceType: "module",
      globals: {
        // Define global variables if needed
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    rules: {
      "no-restricted-globals": ["error", "name", "length"],
      "prefer-arrow-callback": "error",
      "quotes": ["error", "double", { "allowTemplateLiterals": true }],
      "no-console": "off",
    },
  },
  {
    files: ["**/*.spec.*"],
    languageOptions: {
      globals: {
        // Specify test environment globals, like Mocha, if needed
      },
    },
    rules: {
      // Test-specific rule overrides (if needed)
    },
  },
];
