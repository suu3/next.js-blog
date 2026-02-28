import Link from 'next/link';
import { getAllPosts, getTagsWithCount } from '@/lib/posts';

export default function TagPage() {
  const posts = getAllPosts();
  const tags = Object.entries(getTagsWithCount(posts)).sort((a, b) => b[1] - a[1]);

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-black tracking-tight">태그 모아보기</h1>
      <ul className="grid gap-3 md:grid-cols-2">
        {tags.map(([tag, count]) => (
          <li key={tag}>
            <Link
              href={`/tag/${encodeURIComponent(tag)}`}
              className="flex items-center justify-between rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 transition hover:bg-[var(--theme-soft)]"
            >
              <span className="font-semibold">#{tag}</span>
              <span className="font-mono text-sm text-[var(--muted)]">{count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
