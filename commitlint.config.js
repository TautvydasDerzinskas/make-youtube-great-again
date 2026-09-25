export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Allow the existing `wip` type from the commitizen config
    'type-enum': [2, 'always', [
      'build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test', 'wip',
    ]],
    // Scopes like "trademark & Chrome" have been used historically
    'scope-case': [0],
    'subject-case': [0],
    'body-max-line-length': [0],
    'footer-max-line-length': [0],
  },
};
