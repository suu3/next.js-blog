'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { PostSummary } from '@/lib/posts';
import { splitSlugToSegments } from '@/lib/slug';

type Props = {
  posts: PostSummary[];
};

const POSTS_PER_PAGE = 6;

export default function PostSearch({ posts }: Props) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [page, setPage] = useState(1);

  const categoryCounts = useMemo(() => {
    const counts = posts.reduce<Record<string, number>>((acc, post) => {
      acc[post.category] = (acc[post.category] ?? 0) + 1;
      return acc;
    }, {});

    return [
      { name: 'All', count: posts.length },
      ...Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .map(([name, count]) => ({ name, count })),
    ];
  }, [posts]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return posts.filter((post) => {
      const byCategory = selectedCategory === 'All' || post.category === selectedCategory;

      if (!byCategory) {
        return false;
      }

      if (!normalized) {
        return true;
      }

      return [post.title, post.description, post.category, post.tags.join(' ')].some((field) =>
        field.toLowerCase().includes(normalized),
      );
    });
  }, [posts, query, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pagedPosts = filtered.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  const selectCategory = (name: string) => {
    setSelectedCategory(name);
    setPage(1);
  };

  const onQueryChange = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  return (
    <section className="rounded-2xl border border-[#2a2b31] bg-[#f6f3ef]">
      <div className="border-b border-[#2a2b31] px-4 py-3 md:px-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-lg font-black tracking-tight">Search UI</h2>
          <input
            id="post-search"
            type="search"
            placeholder="검색제목, 설명, 태그로 검색"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            className="w-full rounded-md border border-[#2a2b31] bg-white px-3 py-2 text-sm outline-none md:max-w-md"
          />
        </div>
        <p className="mt-2 text-sm text-gray-600">총 {filtered.length}개의 포스트</p>
      </div>

      <div className="grid gap-5 p-4 md:grid-cols-[220px_minmax(0,1fr)] md:p-6">
        <aside className="space-y-3">
          <div className="rounded-xl border border-[#2a2b31] bg-white p-3">
            <div className="flex items-center gap-2">
              <Image src="/images/icon.png" alt="profile icon" width={24} height={24} className="h-6 w-6" />
              <div>
                <p className="text-xs text-gray-500">@Suu3</p>
                <p className="text-sm font-semibold text-[#ff6737]">Developer</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-500">I explain with words and code.</p>
          </div>

          <div className="rounded-xl border border-[#2a2b31] bg-white p-3">
            <p className="mb-2 text-sm font-semibold">Category</p>
            <ul className="space-y-1 text-sm">
              {categoryCounts.map((category) => {
                const isActive = selectedCategory === category.name;
                return (
                  <li key={category.name}>
                    <button
                      type="button"
                      onClick={() => selectCategory(category.name)}
                      className={`flex w-full items-center justify-between rounded px-2 py-1 text-left ${
                        isActive ? 'bg-[#ffddca] font-semibold' : 'hover:bg-[#f6f3ef]'
                      }`}
                    >
                      <span>{category.name}</span>
                      <span className="text-xs text-gray-500">({category.count})</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        <div className="space-y-6">
          <h2 className="text-lg font-black tracking-tight">Posts UI</h2>
          <ul className="grid gap-4 lg:grid-cols-3 sm:grid-cols-2">
            {pagedPosts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/posts/${splitSlugToSegments(post.slug).join('/')}`}
                  className="block h-full rounded-xl border border-[#2a2b31] bg-white p-2 transition duration-200 hover:-translate-y-1 hover:bg-[#fffaf4] hover:shadow-[5px_5px_0_0_#2a2b31]"
                >
                  <div className="relative overflow-hidden rounded-lg border border-[#2a2b31]">
                    <Image
                      src={post.thumbnail || '/images/dummy.jpg'}
                      alt={post.title}
                      width={320}
                      height={180}
                      className="y2k-card-image h-32 w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />

                    {post.tags[0] ? (
                      <p className="absolute left-2 top-2 z-10 inline-block rounded-md border border-[#2a2b31] bg-[#ffefe5] px-2 py-0.5 font-mono text-[10px] text-[#2a2b31]">
                        #{post.tags[0]}
                      </p>
                    ) : null}

                    <p className="absolute inset-0 z-10 flex items-center justify-center text-center text-xs font-black tracking-wide text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]">
                      {post.category}
                    </p>
                  </div>

                  <h3 className="mt-2 line-clamp-2 text-sm font-bold leading-5">{post.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-gray-600">{post.description}</p>
                  <p className="mt-3 text-right font-mono text-[10px] text-gray-500">{post.date}</p>
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-center gap-2 border-t border-[#2a2b31] pt-4">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="h-7 w-7 rounded border border-[#2a2b31] text-sm disabled:opacity-40"
              aria-label="previous"
            >
              {'<'}
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setPage(pageNumber)}
                className={`h-7 w-7 rounded border border-[#2a2b31] text-xs ${
                  pageNumber === currentPage ? 'bg-[#ff6737] text-white' : 'bg-white'
                }`}
              >
                {pageNumber}
              </button>
            ))}
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              className="h-7 w-7 rounded border border-[#2a2b31] text-sm disabled:opacity-40"
              aria-label="next"
            >
              {'>'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
