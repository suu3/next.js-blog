import PostSearch from '@/components/post-search';
import { getAllPosts } from '@/lib/posts';

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-500">전체 포스트</p>
        <h1 className="text-3xl font-black tracking-tight">기록하고 공유합니다</h1>
      </div>
      <PostSearch posts={posts} />
    </section>
  );
}
