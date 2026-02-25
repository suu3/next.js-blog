import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import { splitSlugToSegments } from '@/lib/slug';

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateStaticParams() {
  const categories = [...new Set(getAllPosts().map((post) => post.category))];
  return categories.map((category) => ({ category: encodeURIComponent(category) }));
}

export default async function CategoryDetailPage({ params }: Props) {
  const { category: categoryParam } = await params;
  const category = decodeURIComponent(categoryParam);
  const posts = getAllPosts().filter((post) => post.category === category);

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-black tracking-tight">{category}</h1>
      <p className="text-sm text-gray-500">{posts.length}개의 포스트</p>
      <ul className="space-y-2">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/posts/${splitSlugToSegments(post.slug).join('/')}`}
              className="block rounded-lg border border-[#2a2b31] bg-white px-4 py-3 hover:bg-[#ffddca]"
            >
              <p className="font-semibold">{post.title}</p>
              <p className="mt-1 text-sm text-gray-500">{post.date}</p>
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/category" className="inline-block rounded border border-[#2a2b31] px-3 py-2 text-sm hover:bg-[#ffddca]">
        ← 카테고리 목록
      </Link>
    </section>
  );
}
