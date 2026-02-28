const fs = require('node:fs');
const path = require('node:path');

const filePath = path.join(
  __dirname,
  'content',
  '회고',
  '[2024-12-10]2024년_회고록',
  '[2024-12-10]2024년_회고록.md',
);
const raw = fs.readFileSync(filePath, 'utf8');

const lines = raw.split('\n');
let contentStart = 0;
if (lines[0].trim() === '---') {
  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i].trim() === '---') {
      contentStart = i + 1;
      break;
    }
  }
}

const content = lines.slice(contentStart).join('\n');

function extractHeadingsLocal(src) {
  return src
    .split('\n')
    .map((line) => line.replace(/\r$/, '').trimStart().match(/^(##|###)\s+(.+)/))
    .filter((line) => Boolean(line))
    .map((line) => ({
      id: line[2]
        .trim()
        .toLowerCase()
        .replace(/[\s\u00A0]+/g, '-')
        .replace(/[^\w\u3131-\u318e\uac00-\ud7a3-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, ''),
      text: line[2].trim(),
      level: line[1].length === 2 ? 2 : 3,
    }))
    .filter((heading, index, arr) => arr.findIndex((item) => item.id === heading.id) === index);
}

console.log('Local extractHeadings for 2024년 회고록:');
console.log(extractHeadingsLocal(content));


