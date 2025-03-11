export default [
  {
    ignores: [
      'dist/**', // Игнорировать все файлы в папке dist
      'node_modules/**', // Игнорировать node_modules
    ],
    rules: {
      'perfectionist/sort-imports': 'off',
      'import/order': 'off',
      quotes: ['error', 'single'], // Устанавливаем одинарные кавычки
    },
  },
];
