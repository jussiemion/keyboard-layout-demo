const tasks = {
  '*.{js,mjs,cjs,ts,tsx,jsx}': [
    'oxlint --fix',
    'node tools/wrap-classes.mjs',
    'oxfmt',
  ],
  '*.css': ['stylelint --fix', 'oxfmt'],
  '*.{json,md,yml,yaml}': 'oxfmt',
};

export default tasks;
