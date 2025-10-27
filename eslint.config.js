import js from "@eslint/js";
import globals from "globals";
import { defineConfig, globalIgnores } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier/flat";

const FOUNDRY_GLOBALS = {
  CONFIG: "readonly",
  CONST: "readonly",
  foundry: "readonly",
  game: "readonly",
};

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: { ...globals.browser, ...FOUNDRY_GLOBALS } },
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
  globalIgnores(["foundry/**/*"]),
  eslintConfigPrettier,
]);
