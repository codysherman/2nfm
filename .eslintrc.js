module.exports = {
  root: true,
  env: {
    // this section will be used to determine which APIs are available to us
    // (i.e are we running in a browser environment or a node.js env)
    browser: true,
    node: true,
  },
  globals: { RTCMultiConnection: true },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: 'babel-eslint',
    // specifying a module sourcetype prevent eslint from marking import statements as errors
    sourceType: 'module',
  },
  extends: [
    // use the recommended rule set for both plain javascript and vue
    'eslint:recommended',
    'plugin:vue/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  plugins: [
    'import',
  ],
  rules: {
    // we should always disable console logs and debugging in production
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'array-bracket-spacing': [ 'error', 'always' ],
    'array-element-newline': [ 'error', 'consistent' ],
    'arrow-parens': [ 'error', 'always' ],
    'arrow-spacing': 'error',
    'block-spacing': 'error',
    // must expand out comma-dangle to get `functions` option enabled
    'comma-dangle': [ 'error', {
      arrays: 'always-multiline',
      exports: 'always-multiline',
      functions: 'always-multiline',
      imports: 'always-multiline',
      objects: 'always-multiline',
    } ],
    'comma-spacing': [ 'error', { before: false, after: true } ],
    'eol-last': [ 'error', 'never' ],
    'func-call-spacing': [ 'error', 'never' ],
    'import/extensions': [ 'error', 'ignorePackages', { js: 'never' } ],
    'indent': [ 'error', 2, { SwitchCase: 1 } ],
    'keyword-spacing': [ 'error', {
      before: true,
      after: true,
    } ],
    'linebreak-style': [ 'error', 'unix' ],
    'max-len': [ 'error', {
      code: 100,
      tabWidth: 2,
      ignorePattern: '^\\s*' +
        '(transition:\\s[A-Za-z-]+\\s[#$)(0-9A-Za-z-]|background-image:\\s|<svg)',
    } ],
    'no-duplicate-imports': 'error',
    'no-empty': [ 'error', { allowEmptyCatch: true } ],
    'no-multi-spaces': 'error',
    'no-multiple-empty-lines': [ 'error', { max: 2, maxBOF: 0 } ],
    'no-trailing-spaces': 'error',
    'no-unneeded-ternary': 'error',
    'object-curly-newline': [ 'error', { multiline: true } ],
    'object-curly-spacing': [ 'error', 'always' ],
    'object-property-newline': [ 'error', { allowAllPropertiesOnSameLine: true } ],
    'padded-blocks': [ 'error', 'never' ],
    'quote-props': [ 'error', 'consistent-as-needed' ],
    'quotes': [ 'error', 'single' ],
    'semi':[ 'error', 'always' ],
    'semi-spacing': 'error',
    'semi-style': [ 'error', 'last' ],
    'space-before-function-paren': [ 'error', {
      anonymous: 'always',
      named: 'never',
      asyncArrow: 'always',
    } ],
    'spaced-comment': [ 'error', 'always' ],
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          [ '@', './src' ],
        ],
        extensions: [ '.vue', '.json', '.js' ],
      },
    },
  },
};