const indentUnit = 2

module.exports = {
  root: true,
  env: { browser: true, es2020: true }, globals: { __ADMIN_KIT_VERSION__: 'readonly' },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: 'detect' } },
  rules: {
    'array-callback-return': 'off',
    'camelcase': 'off',
    'consistent-return': 'off',
    'eqeqeq': 'warn',
    'no-console': 'off',
    'no-alert': 'warn',
    'no-plusplus': 'off',
    'no-restricted-syntax': 'off',
    'no-multi-spaces': 'error',
    'no-shadow': 'off',
    'no-underscore-dangle': 'off',
    'no-var': 'error',
    'radix': 'off',
    'no-use-before-define': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react/prop-types': 'warn',
    'react/jsx-indent': ['warn', indentUnit],
    'react/jsx-indent-props': ['warn', indentUnit],
    'indent': ['warn', indentUnit],
    'semi': [1, 'never'],
    'react/require-default-props': [
      'warn',
      {
        forbidDefaultForRequired: true,
        ignoreFunctionalComponents: true
      }
    ],
    'template-tag-spacing': ['error', 'never'],
    'react/jsx-tag-spacing': 'error',
    'quotes': ['error', 'single'],
    'jsx-quotes': ['error', 'prefer-single'],
    'no-trailing-spaces': 'error',
    'no-multiple-empty-lines': ['error', { 'max': 1, 'maxEOF': 1 }],
    'max-len': ['warn', 150],
    'object-curly-spacing': ['error', 'always'],
    'no-unused-vars': 'off'
  },
  "overrides": [
    {
      "files": ["vite.config.js", "vite.config.ts"],
      "rules": {
        "no-undef": "off",
        "no-unused-vars": "off"
      }
    }
  ]
}
