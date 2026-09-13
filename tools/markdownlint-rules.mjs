const githubAlertMarker = /^> \[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](.*)$/;

/** @type {import('markdownlint').Rule} */
const githubAlerts = {
  names: ['GHA001', 'github-alert-layout'],
  description: 'Keep GitHub alert markers separate from their body',
  tags: ['blockquote'],
  parser: 'micromark',
  function: (params, onError) => {
    const quoteLines = new Set(
      params.parsers.micromark.tokens
        .filter((token) => token.type === 'blockQuote')
        .map((token) => token.startLine - 1),
    );
    params.lines.forEach((line, index) => {
      if (!quoteLines.has(index)) {
        return;
      }
      const match = githubAlertMarker.exec(line);
      if (!match) {
        return;
      }
      const body = match[2].trim();
      // The blank quote line also prevents prose formatters from joining
      // the marker and the body into one paragraph.
      if (body || params.lines[index + 1]?.trim() !== '>') {
        onError({
          lineNumber: index + 1,
          detail: 'Use a standalone marker followed by a blank quoted line.',
          fixInfo: {
            editColumn: 1,
            deleteCount: line.length,
            insertText: `> [!${match[1]}]\n>${body ? `\n> ${body}` : ''}`,
          },
        });
      }
    });
  },
};

const rules = [githubAlerts];
export default rules;
