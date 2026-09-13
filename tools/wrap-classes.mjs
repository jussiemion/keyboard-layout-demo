import ts from 'typescript';
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';

// Split only static Tailwind class lists; never change translated text.
export function wrapClasses(file, write = false) {
  const text = readFileSync(file, 'utf8');
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
  const edits = [];
  function visit(node) {
    if (ts.isStringLiteral(node) && node.text.length > 100) {
      const parent = node.parent;
      const jsx =
        ts.isJsxAttribute(parent) &&
        parent.name.getText(source) === 'className';
      const call =
        ts.isCallExpression(parent) &&
        ['cn', 'clsx', 'cva'].includes(parent.expression.getText(source));
      let owner = parent;
      let classObject = false;
      while (owner && !ts.isSourceFile(owner)) {
        if (
          ts.isVariableDeclaration(owner) &&
          owner.name.getText(source) === 'layoutClasses'
        ) {
          classObject = true;
        }
        if (
          ts.isCallExpression(owner) &&
          owner.expression.getText(source) === 'cva'
        ) {
          classObject = true;
        }
        owner = owner.parent;
      }
      if (jsx || call || classObject) {
        const words = node.text.split(/\s+/).filter(Boolean);
        const lines = [];
        for (const word of words) {
          if (!lines.length || lines.at(-1).length + word.length > 68) {
            lines.push(word);
          } else {
            lines[lines.length - 1] += ' ' + word;
          }
        }
        const value =
          '[' +
          lines.map((line) => JSON.stringify(line)).join(',\n') +
          '].join(" ")';
        edits.push({
          start: node.getStart(source),
          end: node.end,
          value: jsx ? '{' + value + '}' : value,
        });
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  if (write && edits.length) {
    let result = text;
    for (const edit of edits.reverse()) {
      result =
        result.slice(0, edit.start) + edit.value + result.slice(edit.end);
    }
    writeFileSync(file, result);
  }
  return edits.length;
}
function sourceFiles(directory) {
  if (!existsSync(directory)) {
    return [];
  }
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory()
      ? sourceFiles(file)
      : /\.tsx?$/.test(file)
        ? [file]
        : [];
  });
}
const arguments_ = process.argv.slice(2);
const files = arguments_.filter((value) => value !== '--check');
for (const file of files.length
  ? files
  : [...sourceFiles('app'), ...sourceFiles('components')]) {
  if (file === '--check') {
    continue;
  }
  const count = wrapClasses(file, !process.argv.includes('--check'));
  if (count && process.argv.includes('--check')) {
    console.error(
      file + ': split long class lists (run tools/wrap-classes.mjs)',
    );
    process.exitCode = 1;
  }
}
