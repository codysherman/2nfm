module.exports = {
  root: true,
  env: {
    // this section will be used to determine which APIs are available to us
    // (i.e are we running in a browser environment or a node.js env)
    node: true,
    browser: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
    // specifying a module sourcetype prevent eslint from marking import statements as errors
    sourceType: 'module',
  },
  extends: [
    // use the recommended rule set for both plain javascript and vue
    'eslint:recommended',
    'plugin:vue/recommended',
  ],
  plugins: [
    'import',
  ],
  rules: {
    // we should always disable console logs and debugging in production
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'arrow-parens': ['error', 'always'],
    // must expand out comma-dangle to get `functions` option enabled
    'comma-dangle': ['error', {
      'arrays': 'always-multiline',
      'objects': 'always-multiline',
      'imports': 'always-multiline',
      'exports': 'always-multiline',
      'functions': 'always-multiline',
    }],
    'import/extensions': ['error', 'ignorePackages', {'js': 'never'}],
    'indent': ['error', 2],
    'max-len': ['error', { 'code': 100, 'tabWidth': 2,
      'ignorePattern': '^\\s*' +
        '(transition:\\s[A-Za-z-]+\\s[#$)(0-9A-Za-z-]|background-image:\\s|<svg)',
    }],
    'quotes': ['error', 'single'],
    'no-empty': ['error', { 'allowEmptyCatch': true }],
  },
};