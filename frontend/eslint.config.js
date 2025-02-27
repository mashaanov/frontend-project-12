import perfectionist from "eslint-plugin-perfectionist";

export default [
  {
    ignores: [
      "dist/**", // Игнорировать все файлы в папке dist
      "node_modules/**", // Игнорировать node_modules
    ],
    plugins: {
      perfectionist,
    },
    rules: {
      "perfectionist/sort-imports": "off",
      "import/order": "off",
    },
  },
];
