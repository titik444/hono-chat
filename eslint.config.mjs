import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'
import pluginPrettier from 'eslint-plugin-prettier'

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.bun
      }
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  prettier, // Menonaktifkan aturan ESLint yang konflik dengan Prettier
  {
    plugins: {
      prettier: pluginPrettier
    },
    rules: {
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      'no-return-assign': 'off',
      'array-callback-return': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      'no-undef': 'off',
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
]
