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
  const [selectedTag, setSelectedTag] = useState<string>('All');
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

  const tagCounts = useMemo(() => {
    const counts = posts.reduce<Record<string, number>>((acc, post) => {
      post.tags.forEach((tag) => {
        acc[tag] = (acc[tag] ?? 0) + 1;
      });
      return acc;
    }, {});

    return [
      { name: 'All', count: posts.length },
      ...Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([name, count]) => ({ name, count })),
    ];
  }, [posts]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return posts
      .map((post) => {
        const byCategory = selectedCategory === 'All' || post.category === selectedCategory;
        const byTag = selectedTag === 'All' || post.tags.includes(selectedTag);

        if (!byCategory || !byTag) {
          return { post, score: -1 };
        }

        if (!normalized) {
          return { post, score: 0 };
        }

        const fields = [post.title, post.description, post.category, post.tags.join(' ')].map((field) => field.toLowerCase());

        let score = 0;
        fields.forEach((field) => {
          if (field.startsWith(normalized)) {
            score += 5;
          } else if (field.includes(normalized)) {
            score += 2;
          }
        });

        return { post, score };
      })
      .filter((item) => item.score >= 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.post);
  }, [posts, query, selectedCategory, selectedTag]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pagedPosts = filtered.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  return (
    <section className="neo-frame rounded-[22px] border-2 border-[var(--line)] bg-[var(--theme-soft)] p-3 md:p-4">
      <div className="rounded-2xl border-2 border-[var(--line)] bg-[var(--surface)] px-4 py-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-lg font-black tracking-tight">Latest</h2>
          <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center">
            <input
              id="post-search"
              type="search"
              placeholder="Search anything"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              className="w-full rounded-full border-2 border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-sm outline-none md:w-84"
            />
            <p className="text-sm font-semibold text-[var(--muted)]">총 {filtered.length}개의 포스트</p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="space-y-3">
          <div className="rounded-2xl border-2 border-[var(--line)] bg-[var(--surface)] p-3">
            <div className="flex items-center gap-2">
              <Image src="/images/icon.png" alt="profile icon" width={28} height={28} className="h-7 w-7" />
              <div>
                <p className="text-xs text-[var(--muted)]">@Suu3</p>
                <p className="text-sm font-bold text-[var(--theme)]">Developer</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-[var(--muted)]">Your doing great, keep practicing.</p>
          </div>

          <div className="rounded-2xl border-2 border-[var(--line)] bg-[var(--surface)] p-3">
            <p className="mb-2 text-sm font-black">Category</p>
            <ul className="space-y-1 text-sm">
              {categoryCounts.map((category) => {
                const isActive = selectedCategory === category.name;
                return (
                  <li key={category.name}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory(category.name);
                        setPage(1);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg border px-2 py-1 text-left transition ${
                        isActive ? 'border-[var(--line)] bg-[var(--theme-soft)] font-semibold' : 'border-transparent hover:border-[var(--line)]'
                      }`}
                    >
                      <span>{category.name}</span>
                      <span className="text-xs text-[var(--muted)]">({category.count})</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="rounded-2xl border-2 border-[var(--line)] bg-[var(--surface)] p-3">
            <p className="mb-2 text-sm font-black">Tag</p>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {tagCounts.map((tag) => (
                <button
                  key={tag.name}
                  type="button"
                  onClick={() => {
                    setSelectedTag(tag.name);
                    setPage(1);
                  }}
                  className={`rounded-md border px-2 py-1 transition ${
                    selectedTag === tag.name ? 'border-[var(--line)] bg-[var(--theme-soft)]' : 'border-[var(--line)] bg-[var(--surface)]'
                  }`}
                >
                  {tag.name === 'All' ? 'All' : `#${tag.name}`}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="space-y-4">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {pagedPosts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/posts/${splitSlugToSegments(post.slug).join('/')}`}
                  className="group block h-full rounded-2xl border-2 border-[var(--line)] bg-[var(--surface)] p-2 transition duration-200 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_var(--line)]"
                >
                  <div className="relative overflow-hidden rounded-xl border-2 border-[var(--line)]">
                    <Image
                      src={post.thumbnail || '/images/dummy.jpg'}
                      alt={post.title}
                      width={320}
                      height={180}
                      className="y2k-card-image h-32 w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-black/35" />

                    {post.tags[0] ? (
                      <p className="absolute left-2 top-2 z-10 rounded border border-[var(--line)] bg-[var(--theme-soft)] px-2 py-0.5 font-mono text-[10px]">
                        #{post.tags[0]}
                      </p>
                    ) : null}

                    <p className="absolute inset-0 z-10 flex items-center justify-center text-center text-xs font-black tracking-wide text-white">
                      {post.category}
                    </p>
                  </div>

                  <h3 className="mt-2 line-clamp-2 text-sm font-black leading-5">{post.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-[var(--muted)]">{post.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="rounded bg-[var(--theme-soft)] px-1.5 py-0.5 text-[10px]">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-right font-mono text-[10px] text-[var(--muted)]">{post.date}</p>
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-center gap-2 border-t-2 border-[var(--line)] pt-4">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="h-7 w-7 rounded border border-[var(--line)] bg-[var(--surface)] text-sm disabled:opacity-40"
              aria-label="previous"
            >
              {'<'}
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setPage(pageNumber)}
                className={`h-7 w-7 rounded border border-[var(--line)] text-xs ${
                  pageNumber === currentPage ? 'bg-[var(--theme)] text-white' : 'bg-[var(--surface)]'
                }`}
              >
                {pageNumber}
              </button>
            ))}
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              className="h-7 w-7 rounded border border-[var(--line)] bg-[var(--surface)] text-sm disabled:opacity-40"
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
