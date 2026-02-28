import { slugifyHeading } from '@/lib/slug';

export type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

export function extractHeadings(content: string): TocItem[] {
  return content
    .split('\n')
    .map((line) => line.replace(/\r$/, '').trimStart().match(/^(##|###)\s+(.+)/))
    .filter((line): line is RegExpMatchArray => Boolean(line))
    .map((line) => ({
      id: slugifyHeading(line[2]),
      text: line[2].trim(),
      level: (line[1].length === 2 ? 2 : 3) as 2 | 3,
    }))
    .filter((heading, index, arr) => arr.findIndex((item) => item.id === heading.id) === index);
}
