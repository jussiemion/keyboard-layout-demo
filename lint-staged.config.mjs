const tasks = {
  '*.{js,mjs,cjs,ts,tsx,jsx}': [
    'oxlint --fix',
    'node tools/wrap-classes.mjs',
    'oxfmt',
  ],
  '*.css': ['stylelint --fix', 'oxfmt'],
  '*.md': ['markdownlint-cli2 --fix', 'oxfmt'],
  '*.{json,jsonc,yml,yaml}': 'oxfmt',
  '*.py': ['uvx ruff@0.16.7 format'],
};

export default tasks;
