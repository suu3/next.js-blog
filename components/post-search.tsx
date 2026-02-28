'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { css, cx } from '@/styled-system/css';
import type { PostSummary } from '@/lib/posts';
import { splitSlugToSegments } from '@/lib/slug';

type Props = {
  posts: PostSummary[];
};

const POSTS_PER_PAGE = 6;

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 },
};

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
    <section className={cx('neo-frame', css({ borderRadius: '22px', border: '2px solid var(--line)', bg: 'var(--theme-soft)', p: { base: '0.75rem', md: '1rem' } }))}>
      <div className={css({ borderRadius: '1rem', border: '2px solid var(--line)', bg: 'var(--surface)', px: '1rem', py: '0.75rem' })}>
        <div className={css({ display: 'flex', flexDir: { base: 'column', md: 'row' }, gap: '0.75rem', alignItems: { md: 'center' }, justifyContent: { md: 'space-between' } })}>
          <h2 className={css({ fontSize: '1.125rem', fontWeight: '900', letterSpacing: '-0.025em' })}>Latest</h2>
          <div className={css({ display: 'flex', w: 'full', flexDir: { base: 'column', md: 'row' }, gap: '0.5rem', alignItems: { md: 'center' }, width: { md: 'auto' } })}>
            <input
              id="post-search"
              type="search"
              placeholder="Search anything"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              className={css({ w: { base: 'full', md: '21rem' }, borderRadius: '9999px', border: '2px solid var(--line)', bg: 'var(--surface)', px: '1rem', py: '0.5rem', fontSize: '0.875rem', outline: 'none' })}
            />
            <p className={css({ fontSize: '0.875rem', fontWeight: '600', color: 'var(--muted)' })}>총 {filtered.length}개의 포스트</p>
          </div>
        </div>
      </div>

      <div className={css({ mt: '1rem', display: 'grid', gap: '1rem', gridTemplateColumns: { base: '1fr', md: '220px minmax(0, 1fr)' } })}>
        <aside className={css({ display: 'flex', flexDir: 'column', gap: '0.75rem' })}>
          <div className={css({ borderRadius: '1rem', border: '2px solid var(--line)', bg: 'var(--surface)', p: '0.75rem' })}>
            <div className={css({ display: 'flex', alignItems: 'center', gap: '0.5rem' })}>
              <Image src="/images/icon.png" alt="profile icon" width={28} height={28} className={css({ h: '1.75rem', w: '1.75rem' })} />
              <div>
                <p className={css({ fontSize: '0.75rem', color: 'var(--muted)' })}>@Suu3</p>
                <p className={css({ fontSize: '0.875rem', fontWeight: '700', color: 'var(--theme)' })}>Developer</p>
              </div>
            </div>
            <p className={css({ mt: '0.75rem', fontSize: '0.75rem', color: 'var(--muted)' })}>Your doing great, keep practicing.</p>
          </div>

          <div className={css({ borderRadius: '1rem', border: '2px solid var(--line)', bg: 'var(--surface)', p: '0.75rem' })}>
            <p className={css({ mb: '0.5rem', fontSize: '0.875rem', fontWeight: '900' })}>Category</p>
            <ul className={css({ display: 'flex', flexDir: 'column', gap: '0.25rem', fontSize: '0.875rem' })}>
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
                      className={cx(
                        css({
                          display: 'flex',
                          w: 'full',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          borderRadius: '0.5rem',
                          border: '1px solid transparent',
                          px: '0.5rem',
                          py: '0.25rem',
                          textAlign: 'left',
                          transition: 'all 0.15s ease',
                        }),
                        isActive
                          ? css({ borderColor: 'var(--line)', bg: 'var(--theme-soft)', fontWeight: '600' })
                          : css({ _hover: { borderColor: 'var(--line)' } }),
                      )}
                    >
                      <span>{category.name}</span>
                      <span className={css({ fontSize: '0.75rem', color: 'var(--muted)' })}>({category.count})</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className={css({ borderRadius: '1rem', border: '2px solid var(--line)', bg: 'var(--surface)', p: '0.75rem' })}>
            <p className={css({ mb: '0.5rem', fontSize: '0.875rem', fontWeight: '900' })}>Tag</p>
            <div className={css({ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', fontSize: '0.75rem' })}>
              {tagCounts.map((tag) => (
                <button
                  key={tag.name}
                  type="button"
                  onClick={() => {
                    setSelectedTag(tag.name);
                    setPage(1);
                  }}
                  className={cx(
                    css({ borderRadius: '0.375rem', border: '1px solid var(--line)', px: '0.5rem', py: '0.25rem', transition: 'all 0.15s ease' }),
                    selectedTag === tag.name ? css({ bg: 'var(--theme-soft)' }) : css({ bg: 'var(--surface)' }),
                  )}
                >
                  {tag.name === 'All' ? 'All' : `#${tag.name}`}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className={css({ display: 'flex', flexDir: 'column', gap: '1rem' })}>
          <motion.ul 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            key={`${selectedCategory}-${selectedTag}-${page}`}
            className={css({ display: 'grid', gap: '0.75rem', gridTemplateColumns: { base: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(3, minmax(0, 1fr))' } })}
          >
            <AnimatePresence mode="popLayout">
              {pagedPosts.map((post) => (
                <motion.li 
                  key={post.slug}
                  variants={itemVariants}
                  layout
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Link
                    href={`/posts/${splitSlugToSegments(post.slug).join('/')}`}
                    className={cx(
                      'post-card-group',
                      css({
                        display: 'block',
                        h: 'full',
                        borderRadius: '1rem',
                        border: '2px solid var(--line)',
                        bg: 'var(--surface)',
                        p: '0.5rem',
                        transition: 'all 0.2s ease',
                        _hover: { transform: 'translateY(-2px)', boxShadow: '4px 4px 0 0 var(--line)' },
                      }),
                    )}
                  >
                    <div className={css({ position: 'relative', overflow: 'hidden', borderRadius: '0.75rem', border: '2px solid var(--line)' })}>
                      <Image
                        src={post.thumbnail || '/images/dummy.jpg'}
                        alt={post.title}
                        width={320}
                        height={180}
                        className={cx(
                          'y2k-card-image',
                          css({ h: '8rem', w: 'full', objectFit: 'cover', transition: 'transform 0.2s ease' }),
                          css({
                            '.post-card-group:hover &': {
                              transform: 'scale(1.02)',
                            },
                          }),
                        )}
                      />
                      <div className={css({ position: 'absolute', inset: 0, bg: 'rgba(0, 0, 0, 0.35)' })} />

                      {post.tags[0] ? (
                        <p className={css({ position: 'absolute', left: '0.5rem', top: '0.5rem', zIndex: 10, borderRadius: '0.25rem', border: '1px solid var(--line)', bg: 'var(--theme-soft)', px: '0.5rem', py: '0.125rem', fontFamily: 'FiraCode-Medium, monospace', fontSize: '10px' })}>
                          #{post.tags[0]}
                        </p>
                      ) : null}

                      <p className={css({ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: '0.75rem', fontWeight: '900', letterSpacing: '0.025em', color: 'white' })}>
                        {post.category}
                      </p>
                    </div>

                    <h3 className={css({ mt: '0.5rem', fontSize: '0.875rem', fontWeight: '900', lineHeight: '1.25rem', lineClamp: '2' })}>{post.title}</h3>
                    <p className={css({ mt: '0.25rem', fontSize: '0.75rem', color: 'var(--muted)', lineClamp: '2' })}>{post.description}</p>
                    <div className={css({ mt: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.25rem' })}>
                      {post.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className={css({ borderRadius: '0.25rem', bg: 'var(--theme-soft)', px: '0.375rem', py: '0.125rem', fontSize: '10px' })}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <p className={css({ mt: '0.75rem', textAlign: 'right', fontFamily: 'FiraCode-Medium, monospace', fontSize: '10px', color: 'var(--muted)' })}>{post.date}</p>
                  </Link>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>

          <div className={css({ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', borderTop: '2px solid var(--line)', pt: '1rem' })}>
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className={css({ h: '1.75rem', w: '1.75rem', borderRadius: '0.25rem', border: '1px solid var(--line)', bg: 'var(--surface)', fontSize: '0.875rem', _disabled: { opacity: 0.4 } })}
              aria-label="previous"
            >
              {'<'}
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setPage(pageNumber)}
                className={cx(
                  css({ h: '1.75rem', w: '1.75rem', borderRadius: '0.25rem', border: '1px solid var(--line)', fontSize: '0.75rem' }),
                  pageNumber === currentPage ? css({ bg: 'var(--theme)', color: 'white' }) : css({ bg: 'var(--surface)' }),
                )}
              >
                {pageNumber}
              </button>
            ))}
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              className={css({ h: '1.75rem', w: '1.75rem', borderRadius: '0.25rem', border: '1px solid var(--line)', bg: 'var(--surface)', fontSize: '0.875rem', _disabled: { opacity: 0.4 } })}
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
