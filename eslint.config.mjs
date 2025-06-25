import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    rules: {
      // Disable or warn specific rules
      "@typescript-eslint/no-explicit-any": "off",       // or "warn"
      "@typescript-eslint/no-unused-vars": "warn",       // or "off"
      "react-hooks/rules-of-hooks": "error",             // usually keep this on
    }
  },
];

export default eslintConfig;
