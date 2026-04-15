const fs = require('fs/promises');
const path = require('path');
const MarkdownIt = require('markdown-it');
const hljs = require('highlight.js');
const puppeteer = require('puppeteer');

const ROOT = __dirname;
const DEFAULT_OUTPUT = path.join(ROOT, 'dist', 'interview-prep-complete.pdf');

const PREFERRED_ORDER = [
  'README.md',
  'interview-prep.md',
  'javascript-interview-prep-handbook.md',
  'neetcode-medium-exam-prep.md',
  'javascript-neetcode-templates.md',
  'javascript-2-week-practice-plan.md',
  'interview-prep-cheat-sheet.md',
  'day-before-interview-cram-sheet.md',
  'javascript-interview-prep-print.md',
  'javascript-interview-prep-ultra-compact.md',
];

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: false,
  highlight(code, language) {
    if (language && hljs.getLanguage(language)) {
      const highlighted = hljs.highlight(code, { language, ignoreIllegals: true }).value;
      return `<pre class="hljs"><code>${highlighted}</code></pre>`;
    }

    const escaped = md.utils.escapeHtml(code);
    return `<pre class="hljs"><code>${escaped}</code></pre>`;
  },
});

function parseArgs(argv) {
  const args = { output: DEFAULT_OUTPUT };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === '--output' || arg === '-o') {
      args.output = path.resolve(ROOT, argv[i + 1]);
      i++;
    }
  }

  return args;
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function fileTitle(markdown, fileName) {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : fileName;
}

function splitMarkdownSections(markdown) {
  const lines = markdown.split(/\r?\n/);
  const sections = [];
  let current = [];
  let inFence = false;

  for (const line of lines) {
    if (/^```/.test(line.trim())) {
      inFence = !inFence;
    }

    const isHeading = !inFence && /^(#{1,6})\s+/.test(line);

    if (isHeading && current.join('\n').trim()) {
      sections.push(current.join('\n').trim());
      current = [line];
    } else {
      current.push(line);
    }
  }

  if (current.join('\n').trim()) {
    sections.push(current.join('\n').trim());
  }

  return sections;
}

async function getMarkdownFiles() {
  const entries = await fs.readdir(ROOT, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => entry.name);

  const preferred = PREFERRED_ORDER.filter((file) => files.includes(file));
  const remaining = files
    .filter((file) => !preferred.includes(file))
    .sort((a, b) => a.localeCompare(b));

  return [...preferred, ...remaining];
}

async function buildDocumentHtml(files) {
  const documents = [];
  const generatedAt = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  for (const file of files) {
    const filePath = path.join(ROOT, file);
    const markdown = await fs.readFile(filePath, 'utf8');
    const sections = splitMarkdownSections(markdown);

    documents.push({
      file,
      title: fileTitle(markdown, file),
      sections,
    });
  }

  const tocHtml = documents
    .map((doc, index) => `
      <li>
        <span class="toc-number">${index + 1}.</span>
        <div class="toc-entry">
          <strong>${escapeHtml(doc.title)}</strong>
          <span>${escapeHtml(doc.file)}</span>
        </div>
      </li>
    `)
    .join('');

  const bodyHtml = documents
    .map((doc) => {
      const renderedSections = doc.sections
        .map((section) => `<section class="md-section">${md.render(section)}</section>`)
        .join('\n');

      return `
        <article class="file-doc">
          <div class="file-source">${escapeHtml(doc.file)}</div>
          ${renderedSections}
        </article>
      `;
    })
    .join('\n');

  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Interview Prep PDF Bundle</title>
        <style>
          @page {
            size: A4;
            margin: 18mm 14mm 20mm 14mm;
          }

          :root {
            color-scheme: light;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            font-family: Inter, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            font-size: 10.5pt;
            line-height: 1.45;
            color: #111827;
            background: #ffffff;
          }

          .cover {
            break-after: page;
            page-break-after: always;
            min-height: calc(297mm - 34mm);
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 10mm 0 0;
          }

          .cover-label {
            margin: 0 0 10px;
            font-size: 9pt;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            color: #2563eb;
            font-weight: 700;
          }

          .cover h1 {
            margin: 0 0 12px;
            font-size: 30pt;
            line-height: 1.1;
          }

          .cover p {
            margin: 0 0 14px;
            color: #374151;
            max-width: 140mm;
          }

          .cover ul {
            margin: 18px 0 0;
            padding: 0;
            list-style: none;
            display: grid;
            gap: 10px;
          }

          .cover li {
            margin: 0;
            display: flex;
            gap: 10px;
            align-items: baseline;
            padding: 8px 10px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            background: #f9fafb;
            break-inside: avoid-page;
            page-break-inside: avoid;
          }

          .toc-number {
            min-width: 18px;
            color: #2563eb;
            font-weight: 700;
          }

          .toc-entry {
            display: flex;
            flex-direction: column;
            gap: 2px;
          }

          .toc-entry strong {
            display: block;
          }

          .toc-entry span {
            color: #6b7280;
            font-size: 9pt;
          }

          .cover-meta {
            margin-top: 18px;
            font-size: 9pt;
            color: #6b7280;
          }

          .file-doc {
            break-before: page;
            page-break-before: always;
          }

          .file-doc:first-of-type {
            break-before: auto;
            page-break-before: auto;
          }

          .file-source {
            margin: 0 0 10px;
            font-size: 8.5pt;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: #6b7280;
          }

          .md-section {
            break-inside: avoid-page;
            page-break-inside: avoid;
            margin: 0 0 12px;
          }

          h1, h2, h3, h4, h5, h6 {
            break-after: avoid-page;
            page-break-after: avoid;
            line-height: 1.2;
            margin: 0 0 8px;
            color: #111827;
          }

          h1 {
            font-size: 20pt;
          }

          h2 {
            font-size: 15pt;
            margin-top: 16px;
          }

          h3 {
            font-size: 12pt;
            margin-top: 14px;
          }

          p, ul, ol, blockquote, table {
            orphans: 3;
            widows: 3;
          }

          p, ul, ol, blockquote, table, hr {
            margin: 0 0 10px;
          }

          ul, ol {
            padding-left: 18px;
          }

          li {
            margin: 0 0 4px;
          }

          pre, table, blockquote {
            break-inside: avoid-page;
            page-break-inside: avoid;
          }

          pre {
            margin: 0 0 10px;
            padding: 12px 14px;
            border-radius: 8px;
            background: #f8f8f8;
            color: #1f2937;
            white-space: pre-wrap;
            overflow-wrap: anywhere;
            font-size: 9pt;
            line-height: 1.45;
            border: 1px solid #d1d5db;
          }

          code {
            font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
          }

          .hljs-keyword,
          .hljs-selector-tag,
          .hljs-literal,
          .hljs-section,
          .hljs-link {
            color: #7928a1;
          }

          .hljs-string,
          .hljs-title,
          .hljs-name,
          .hljs-type,
          .hljs-attribute,
          .hljs-symbol,
          .hljs-bullet,
          .hljs-addition,
          .hljs-template-tag,
          .hljs-template-variable {
            color: #956d00;
          }

          .hljs-comment,
          .hljs-quote,
          .hljs-deletion,
          .hljs-meta {
            color: #6a737d;
          }

          .hljs-number,
          .hljs-regexp,
          .hljs-literal,
          .hljs-variable,
          .hljs-tag .hljs-attr,
          .hljs-variable-language,
          .hljs-built_in {
            color: #d73a49;
          }

          .hljs-function .hljs-title,
          .hljs-title.function_ {
            color: #005cc5;
          }

          .hljs-params {
            color: #24292e;
          }

          :not(pre) > code {
            background: #f3f4f6;
            border-radius: 4px;
            padding: 0.12em 0.35em;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 9.5pt;
          }

          th, td {
            border: 1px solid #d1d5db;
            padding: 6px 8px;
            vertical-align: top;
            text-align: left;
          }

          blockquote {
            border-left: 3px solid #d1d5db;
            padding-left: 12px;
            color: #374151;
          }

          hr {
            border: 0;
            border-top: 1px solid #e5e7eb;
          }

          a {
            color: #1d4ed8;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <main>
          <section class="cover">
            <div class="cover-label">JavaScript Interview Prep Pack</div>
            <h1>Interview Prep PDF Bundle</h1>
            <p>Generated from all markdown files in this folder, ordered for JavaScript interview prep review.</p>
            <ul>${tocHtml}</ul>
            <div class="cover-meta">Generated ${escapeHtml(generatedAt)}</div>
          </section>
          ${bodyHtml}
        </main>
      </body>
    </html>
  `;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const files = await getMarkdownFiles();
  const outputDir = path.dirname(args.output);

  await fs.mkdir(outputDir, { recursive: true });

  const html = await buildDocumentHtml(files);
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.pdf({
      path: args.output,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="
          width: 100%;
          font-size: 8px;
          color: #6b7280;
          padding: 0 14mm;
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <span>JavaScript Interview Prep Bundle</span>
          <span></span>
        </div>
      `,
      footerTemplate: `
        <div style="
          width: 100%;
          font-size: 8px;
          color: #6b7280;
          padding: 0 14mm;
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <span>${escapeHtml(path.basename(args.output))}</span>
          <span><span class="pageNumber"></span> / <span class="totalPages"></span></span>
        </div>
      `,
      margin: {
        top: '20mm',
        right: '14mm',
        bottom: '20mm',
        left: '14mm',
      },
    });
  } finally {
    await browser.close();
  }

  process.stdout.write(`PDF written to ${args.output}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
});
