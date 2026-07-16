module.exports = {
  extends: ['gitmoji'],
  plugins: ['commitlint-plugin-gitmoji'],
  rules: {
    'header-max-length': [2, 'always', 120],
    'scope-case': [2, 'always', 'upper-case'],
  },
};
