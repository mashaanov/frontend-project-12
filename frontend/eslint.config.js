import babelParser from '@babel/eslint-parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import eslintPluginImport from 'eslint-plugin-import'; // Добавляем сам плагин как объект

export default [
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-react'],
        },
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      import: eslintPluginImport, // Используем плагин как объект
    },
    rules: {
      quotes: ['error', 'single'],
      'perfectionist/sort-imports': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-wrap-multilines': [
        'error',
        { declaration: true, assignment: true, return: true },
      ],
      'react/jsx-closing-tag-location': 'error',
      'comma-dangle': ['error', 'always-multiline'],
      'import/no-duplicates': 'error',
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
        },
      ],
      'arrow-body-style': ['error', 'as-needed'],
      'operator-linebreak': ['error', 'before'],
      'react/jsx-indent': ['error', 2], // 2 пробела для отступов в JSX
      indent: ['error', 2], // 2 пробела для отступов в коде
      'object-curly-newline': ['error', { multiline: true, consistent: true }],
    },
  },
];
