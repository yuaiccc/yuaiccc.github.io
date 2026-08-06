import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '../../lib/posts';

export const metadata: Metadata = {
  title: 'Blog | Xu Junshan',
  description: 'Technical notes on AI agents, RAG, backend engineering, and experiments by Xu Junshan.',
  alternates: { canonical: '/blog/' },
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <main className="blog-shell min-h-screen bg-slate-50 px-5 py-10 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <header className="border-b border-slate-200 pb-8 dark:border-slate-700">
          <Link href="/" className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
            &larr; Resume
          </Link>
          <h1 className="mt-5 text-3xl font-semibold sm:text-4xl">技术笔记</h1>
          <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-400">AI agents、RAG、后端工程与研究实验中的过程记录。</p>
        </header>

        <section className="divide-y divide-slate-200 dark:divide-slate-700">
          {posts.map((post) => (
            <article key={post.slug} className="py-8">
              <time className="font-mono text-sm text-slate-500 dark:text-slate-400">{post.date}</time>
              <h2 className="mt-2 text-xl font-bold">
                <Link href={`/blog/${post.slug}/`} className="transition-colors hover:text-blue-600 dark:hover:text-blue-400">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">{post.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:text-slate-400">{tag}</span>
                ))}
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
