'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { PostSummary } from '@/lib/posts';
import { splitSlugToSegments } from '@/lib/posts';

type Props = {
  posts: PostSummary[];
};

export default function PostSearch({ posts }: Props) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return posts;
    }

    return posts.filter((post) =>
      [post.title, post.description, post.category, post.tags.join(' ')].some((field) =>
        field.toLowerCase().includes(normalized),
      ),
    );
  }, [posts, query]);

  return (
    <section className="space-y-4">
      <div className="rounded-xl border border-[#2a2b31] bg-white p-4 shadow-[4px_4px_0_0_#2a2b31]">
        <label htmlFor="post-search" className="mb-2 block text-sm font-semibold">
          검색
        </label>
        <input
          id="post-search"
          type="search"
          placeholder="제목, 설명, 태그로 검색"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full rounded-lg border border-[#2a2b31] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#ff6737]"
        />
        <p className="mt-2 text-sm text-gray-500">총 {filtered.length}개의 포스트</p>
      </div>

      <ul className="grid gap-4 md:grid-cols-2">
        {filtered.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/posts/${splitSlugToSegments(post.slug).join('/')}`}
              className="block h-full rounded-xl border border-[#2a2b31] bg-white p-4 transition hover:-translate-y-0.5 hover:bg-[#ffddca] hover:shadow-[4px_4px_0_0_#2a2b31]"
            >
              <p className="mb-2 inline-block rounded-md bg-[#ffddca] px-2 py-1 font-mono text-xs text-[#2a2b31]">
                {post.category}
              </p>
              <h2 className="line-clamp-2 text-lg font-bold">{post.title}</h2>
              <p className="mt-2 line-clamp-2 text-sm text-gray-600">{post.description}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded border border-gray-300 px-1.5 py-0.5 text-xs text-gray-600">
                    #{tag}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-right font-mono text-xs text-gray-500">{post.date}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
