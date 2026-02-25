import Image from 'next/image';
import PostSearch from '@/components/post-search';
import { getAllPosts } from '@/lib/posts';

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <section className="space-y-6">
      <div className="y2k-hero relative overflow-hidden rounded-2xl border border-[#2a2b31] bg-white px-4 py-5 md:px-6">
        <Image src="/images/icon.png" alt="decorative icon" width={48} height={48} className="hero-icon-left" />
        <Image src="/images/home.svg" alt="decorative home" width={38} height={38} className="hero-icon-right" />
        <div className="y2k-stars" aria-hidden />
        <div className="relative z-10 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Suu3 Archive</p>
          <h1 className="y2k-title text-3xl font-black tracking-tight md:text-4xl">기록하고 공유합니다</h1>
          <p className="text-sm text-gray-600">Y2K + Neo Brutalism 무드로 정리한 개발 기록</p>
        </div>
      </div>
      <PostSearch posts={posts} />
    </section>
  );
}
