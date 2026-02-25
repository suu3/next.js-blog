import Link from 'next/link';
import { getAllPosts, getCategoriesWithCount } from '@/lib/posts';

export default function CategoryPage() {
  const posts = getAllPosts();
  const categories = Object.entries(getCategoriesWithCount(posts)).sort((a, b) => b[1] - a[1]);

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-black tracking-tight">카테고리 모아보기</h1>
      <ul className="grid gap-3 md:grid-cols-2">
        {categories.map(([category, count]) => (
          <li key={category}>
            <Link
              href={`/category/${encodeURIComponent(category)}`}
              className="flex items-center justify-between rounded-xl border border-[#2a2b31] bg-white px-4 py-3 transition hover:bg-[#ffddca] hover:shadow-[4px_4px_0_0_#2a2b31]"
            >
              <span className="font-semibold">{category}</span>
              <span className="font-mono text-sm text-gray-500">{count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
