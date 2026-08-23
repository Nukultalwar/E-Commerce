module.exports = [
  { ignores: ['node_modules/**'] },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin')
    },
    linterOptions: {
      reportUnusedDisableDirectives: true
    },
    rules: {}
  }
];
