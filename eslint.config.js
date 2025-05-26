// eslint.config.js
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import pluginRouter from "@tanstack/eslint-plugin-router"; // Replace with correct package if different

export default tseslint.config(
  // Ignore patterns
  { ignores: ["dist"] },
  // Main configuration
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx,jsx}"],
    // Spread recommended configurations
    ...js.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: globals.browser,
      parser: tseslint.parser, // Explicitly set TypeScript parser
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: __dirname, // Use __dirname for CommonJS
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "@tanstack/router": pluginRouter,
      "react-x": reactX,
      "react-dom": reactDom,
      "simple-import-sort": simpleImportSort,
      "@tanstack/query": pluginQuery,
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true, // Resolve TypeScript paths (e.g., @/)
          project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        },
      },
    },
    rules: {
      // Disable conflicting import rules
      "sort-imports": "off",
      "import/order": "off",
      // React hooks and refresh rules
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      // TanStack Router rules
      "@tanstack/router/create-route-property-order": "error",
      "@tanstack/query/exhaustive-deps": "error",
      // React-X and React-DOM rules
      ...reactX.configs["recommended-typescript"].rules,
      ...reactDom.configs.recommended.rules,
      // Import sorting rules
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // 1. Side effect imports (e.g., import "./setup.js")
            ["^\\u0000"],
            // 2. External packages (e.g., react, @scope/pkg)
            ["^@?\\w"],
            // 3. Internal aliases (e.g., @/components, @/utils)
            ["^@/"],
            // 4. Parent directory imports (e.g., ../utils)
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
            // 5. Same directory imports (e.g., ./module)
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
            // 6. Style imports (e.g., ./styles.css)
            ["^.+\\.?(css|scss)$"],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
    },
  }
);
