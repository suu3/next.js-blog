import { css } from '@/styled-system/css';
import BioCard from '@/components/bio-card';
import PostSearch from '@/components/post-search';
import { getAllPosts } from '@/lib/posts';

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <section className={css({ display: 'flex', flexDir: 'column', gap: '1.5rem' })}>
      <BioCard />
      <PostSearch posts={posts} />
    </section>
  );
}
