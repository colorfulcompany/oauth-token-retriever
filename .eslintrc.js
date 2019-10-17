module.exports = {
  env: {
    browser: false,
    commonjs: true,
    es6: true
  },
  extends: [
    'standard',
    'plugin:jsdoc/recommended'
  ],
  plugins: [
    'jsdoc'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    describe: true,
    it: true
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    'jsdoc/require-param-description': 'off',
    'jsdoc/require-returns-description': 'off'
  },
  settings: {
    jsdoc: {
      tagNamePreference: {
        returns: 'return'
      }
    }
  }
}
