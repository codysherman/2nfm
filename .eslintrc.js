module.exports = {
  env: {
    // this section will be used to determine which APIs are available to us
    // (i.e are we running in a browser environment or a node.js env)
    browser: true,
    node: true,
  },
  extends: [
    // use the recommended rule set for both plain javascript and vue
    'eslint:recommended',
    'plugin:vue/recommended',
  ],
  globals: {
    RTCMultiConnection: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
    // specifying a module sourcetype prevent eslint from marking import statements as errors
    sourceType: 'module',
  },
  plugins: [
    'import',
  ],
  root: true,
  rules: {
    // we should always disable console logs and debugging in production
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'arrow-parens': ['error', 'always'],
    // must expand out comma-dangle to get `functions` option enabled
    'comma-dangle': ['error', {
      'arrays': 'always-multiline',
      'exports': 'always-multiline',
      'functions': 'always-multiline',
      'imports': 'always-multiline',
      'objects': 'always-multiline',
    }],
    'import/extensions': ['error', 'ignorePackages', {'js': 'never'}],
    'indent': ['error', 2, { 'SwitchCase': 1 }],
    'linebreak-style': ['error', 'unix'],
    'max-len': ['error', { 'code': 100, 'tabWidth': 2,
      'ignorePattern': '^\\s*' +
        '(transition:\\s[A-Za-z-]+\\s[#$)(0-9A-Za-z-]|background-image:\\s|<svg)',
    }],
    'no-duplicate-imports': 'error',
    'no-empty': ['error', { 'allowEmptyCatch': true }],
    'no-multi-spaces': 'error',
    'no-multiple-empty-lines': ['error', {'max': 1}],
    'quotes': ['error', 'single'],
    'semi':['error', 'always'],
    'spaced-comment': ['error', 'always'],
  },
};