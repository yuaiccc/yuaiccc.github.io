import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import GiscusComments from '../../GiscusComments';
import { getAllPosts, getPostBySlug } from '../../../lib/posts';
import { SITE_URL } from '../../site';

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllPosts().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {};
  }

  return {
    title: `${post.title} | Xu Junshan`,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}/` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${SITE_URL}/blog/${post.slug}/`,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="blog-shell min-h-screen bg-slate-50 px-5 py-10 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:py-16">
      <article className="mx-auto max-w-3xl">
        <Link href="/blog/" className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
          &larr; 技术笔记
        </Link>
        <header className="mt-8 border-b border-slate-200 pb-8 dark:border-slate-700">
          <time className="font-mono text-sm text-slate-500 dark:text-slate-400">{post.date}</time>
          <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">{post.title}</h1>
          <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">{post.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:text-slate-400">{tag}</span>
            ))}
          </div>
        </header>
        <div className="blog-content mt-9">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
        <GiscusComments />
      </article>
    </main>
  );
}
