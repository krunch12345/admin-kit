import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import tseslint from 'typescript-eslint'

const indentUnit = 2

export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**', '.yarn/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        __ADMIN_KIT_VERSION__: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      'eqeqeq': ['warn', 'smart'],
      'no-alert': 'warn',
      'no-multi-spaces': 'error',
      'no-var': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'react-hooks/rules-of-hooks': 'error',
      // Enforced gradually during Phase 3/4 refactors (React Compiler-style rules from hooks v7).
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'jsx-a11y/no-autofocus': 'warn',
      '@typescript-eslint/no-unused-expressions': ['error', {
        allowShortCircuit: true,
        allowTernary: true,
      }],
      // PropTypes removed after TypeScript migration.
      'react/prop-types': 'off',
      'react/jsx-indent': ['warn', indentUnit],
      'react/jsx-indent-props': ['warn', indentUnit],
      'indent': ['warn', indentUnit, { SwitchCase: 1 }],
      'semi': ['warn', 'never'],
      'quotes': ['error', 'single', { avoidEscape: true }],
      'jsx-quotes': ['error', 'prefer-single'],
      'no-trailing-spaces': 'error',
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
      'max-len': ['warn', { code: 150, ignoreStrings: true, ignoreTemplateLiterals: true }],
      'object-curly-spacing': ['error', 'always'],
      'react/jsx-tag-spacing': 'error',
      'template-tag-spacing': ['error', 'never'],
    },
  },
  {
    files: ['**/*.{test,spec}.{js,jsx,ts,tsx}', 'src/test/**'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        vi: 'readonly',
      },
    },
  },
  {
    files: ['vite.config.ts', 'eslint.config.js'],
    rules: {
      'no-undef': 'off',
    },
  },
)
