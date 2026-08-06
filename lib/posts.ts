import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content', 'blog');

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  content: string;
};

type PostFrontMatter = Omit<Post, 'slug' | 'content'>;

function toPost(fileName: string): Post {
  const slug = fileName.replace(/\.md$/, '');
  const source = fs.readFileSync(path.join(postsDirectory, fileName), 'utf8');
  const { data, content } = matter(source);
  const frontMatter = data as Partial<PostFrontMatter>;

  if (!frontMatter.title || !frontMatter.description || !frontMatter.date) {
    throw new Error(`Invalid front matter in blog post: ${fileName}`);
  }

  return {
    slug,
    title: frontMatter.title,
    description: frontMatter.description,
    date: frontMatter.date,
    tags: frontMatter.tags ?? [],
    content,
  };
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  return fs
    .readdirSync(postsDirectory)
    .filter((fileName) => fileName.endsWith('.md'))
    .map(toPost)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPostBySlug(slug: string): Post | undefined {
  const fileName = `${slug}.md`;
  const filePath = path.join(postsDirectory, fileName);

  if (!fs.existsSync(filePath)) {
    return undefined;
  }

  return toPost(fileName);
}
