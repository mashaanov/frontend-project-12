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
      "perfectionist/sort-imports": [
        "error",
        {
          groups: [
            ["builtin", "external"], // Сначала встроенные и внешние библиотеки
            ["internal"], // Далее импорты из родительских и соседних директорий
            ["parent", "sibling", "index"],
          ],
          order: "asc", // Сортировать импорты в алфавитном порядке
          type: "natural", // Учитывать естественную сортировку
        },
      ],
      "sort-keys": [
        "error",
        "asc",
        { caseSensitive: true, minKeys: 2, natural: false },
      ],
    },
  },
];
