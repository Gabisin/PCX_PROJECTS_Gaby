import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
  {
    // Primitivos shadcn-style: exportam variantes (cva) e sub-componentes a par
    // do componente principal — HMR de facto não é perfeito aqui, é aceitável.
    files: [
      "src/shared/ui/**/*.tsx",
      "src/shared/i18n/**/*.tsx",
      "src/app/providers/**/*.tsx",
      "src/entities/*/model/*Provider*.tsx",
    ],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  }
);
