import js from "@eslint/js";
import globals from "globals";
import { defineConfig, globalIgnores } from "eslint/config";

const FOUNDRY_GLOBALS = {
  foundry: "readonly",
  CONFIG: "readonly",
  game: "readonly",
  Roll: "readonly",
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
]);
