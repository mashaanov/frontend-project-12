export default [
  {
    ignores: [
      'dist/**', // Игнорировать все файлы в папке dist
      'node_modules/**', // Игнорировать node_modules
    ],
    rules: {
      'perfectionist/sort-imports': 'off',
      'import/order': 'off',
      'quotes': ['error', 'single'], // Всегда одинарные кавычки
      'comma-dangle': ['error', 'always-multiline'], // Запятая в объектах и массивах
      'arrow-body-style': ['error', 'as-needed'], // Не требует фигурных скобок, если можно без них
      'object-curly-newline': ['error', { 'multiline': true, 'consistent': true }],
    },
  },
];
