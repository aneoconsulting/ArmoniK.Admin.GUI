import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import angular from "angular-eslint";
import importPlugin from "eslint-plugin-import"

export default tseslint.config(
  {
    files: ["src/**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...angular.configs.tsRecommended,
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
      "@/quotes": [
        "error",
        "single"
      ],
      "@/semi": [
        "error",
        "always"
      ],
      "@/indent": [
        "error",
        2,
        {
          "FunctionDeclaration": {
            "parameters": "first"
          },
          "FunctionExpression": {
            "parameters": "first"
          }
        }
      ],
      "@typescript-eslint/no-empty-object-type": [
        "warn"
      ],
      "import/no-unresolved": [
        "error",
        {
          "ignore": [
            "^@app/",
            "^@components/",
            "^@services/",
            "^@angular/",
            "^@pipes/"
          ]
        }
      ],
      "import/order": [
        "error",
        {
          "groups": [
            "builtin", // Built-in imports (come from NodeJS native) go first
            "external", // <- External imports
            "internal", // <- Absolute imports
            [
              "sibling",
              "parent"
            ], // <- Relative imports, the sibling and parent types they can be mingled together
            "index", // <- index imports
            "unknown" // <- unknown
          ],
          "newlines-between": "never",
          "alphabetize": {
            /* sort in ascending order. Options: ["ignore", "asc", "desc"] */
            "order": "asc",
            /* ignore case. Options: [true, false] */
            "caseInsensitive": true
          }
        }
      ],
    },
  },
  {
    files: ["src/**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  }
);