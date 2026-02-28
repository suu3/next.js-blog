import Link from 'next/link';
import { notFound } from 'next/navigation';
import { css } from '@/styled-system/css';
import PostActions from '@/components/post-actions';
import PostComments from '@/components/post-comments';
import PostMarkdown from '@/components/post-markdown';
import PostToc from '@/components/post-toc';
import { extractHeadings } from '@/lib/markdown';
import { getAllPosts, getPostBySlug } from '@/lib/posts';

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({
    slug: post.slug.split('/').map(encodeURIComponent),
  }));
}

export default async function PostDetailPage({ params }: Props) {
  const { slug: slugSegments } = await params;
  const slug = slugSegments.map(decodeURIComponent).join('/');
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const headings = extractHeadings(post.content);

  return (
    <section className={css({ display: 'grid', gap: '1.5rem', gridTemplateColumns: { base: '1fr', lg: 'minmax(0,1fr) 260px' } })}>
      <article className={css({ borderRadius: '0.75rem', border: '1px solid var(--line)', bg: 'var(--surface)', p: { base: '1rem', md: '2rem' }, boxShadow: '4px 4px 0 0 var(--line)' })}>
        <p className={css({ mb: '0.75rem', display: 'inline-block', borderRadius: '0.375rem', bg: 'var(--theme-soft)', px: '0.5rem', py: '0.25rem', fontFamily: 'FiraCode-Medium, monospace', fontSize: '0.75rem' })}>{post.category}</p>
        <h1 className={css({ fontSize: { base: '1.5rem', md: '1.875rem' }, fontWeight: '900', letterSpacing: '-0.025em' })}>{post.title}</h1>
        <p className={css({ mt: '0.5rem', fontSize: '0.875rem', color: 'var(--muted)' })}>{post.date}</p>
        <p className={css({ mt: '1rem', fontSize: { base: '1rem', md: '1.125rem' }, lineHeight: { base: '1.75rem', md: '2rem' }, color: 'var(--muted)' })}>{post.description}</p>

        <PostActions />

        <div className={css({ mt: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' })}>
          {(post.tags.length ? post.tags : ['없음']).map((tag) => (
            <Link
              key={tag}
              href={`/tag/${encodeURIComponent(tag)}`}
              className={css({ borderRadius: '0.375rem', border: '1px solid var(--line)', bg: 'var(--surface)', px: '0.5rem', py: '0.25rem', fontSize: '0.75rem', fontWeight: '600', transition: 'all 0.15s ease', _hover: { bg: 'var(--theme-soft)' } })}
            >
              #{tag}
            </Link>
          ))}
        </div>

        <hr className={css({ my: '1.5rem', borderColor: 'var(--line)' })} />

        <div className="post-content">
          <PostMarkdown content={post.content} />
        </div>

        <Link
          href="/"
          prefetch={false}
          className={css({ mt: '2rem', display: 'inline-flex', alignItems: 'center', borderRadius: '0.375rem', border: '1px solid var(--line)', bg: 'var(--surface)', px: '0.75rem', py: '0.5rem', fontSize: '0.875rem', fontWeight: '600', transition: 'all 0.15s ease', _hover: { transform: 'translate(-2px, -2px)', bg: 'var(--theme-soft)' } })}
        >
          ← 목록으로
        </Link>

        <PostComments issueTerm={post.slug} />
      </article>

      <div className={css({ display: { base: 'none', lg: 'block' } })}>
        <PostToc items={headings} />
      </div>
    </section>
  );
}

