import { cache } from 'react';

import seasons from './constants/seasons'
import fs from 'fs'
import matter from 'gray-matter'
import path, { join } from 'path'

const postsDirectory = join(process.cwd(), '_posts')

type SeasonType = {
  label: string
  before: string
  after: string
}

export const getAllPostsChronological = cache(() => {

  const allPosts = [];
  const years = fs.readdirSync(postsDirectory);

  for (const year of years) {
    const seasons = fs.readdirSync(path.join(postsDirectory, year));

    for (const season of seasons) {
      const files = fs.readdirSync(path.join(postsDirectory, year, season));

      for (const file of files) {
        if (!file.endsWith('.md')) continue;
        const slug = file.replace('.md', '');
        const post = getPostBySlug(`${year}/${season}/${slug}`);
        allPosts.push({ ...post, slug }); // Just the slug, not full path
      }
    }
  }

  return allPosts.sort((a, b) => (a.date > b.date ? -1 : 1));
})

export function getPostsByYearAndSeason(year: string, seasonLabel: string) {
  return fs.readdirSync(`${postsDirectory}/${year}/${seasonLabel}`).map((slug) => {
    return `${year}/${seasonLabel}/${slug}`
  }).map((slug) => getPostBySlug(slug)).sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
}

export function findPostBySlug(slug: string): any {
  const years = fs.readdirSync(postsDirectory);

  for (const year of years) {
    const seasons = fs.readdirSync(path.join(postsDirectory, year));

    for (const season of seasons) {
      const targetPath = path.join(postsDirectory, year, season, `${slug}.md`)
      if (fs.existsSync(targetPath)) {
        const { data, content } = matter(fs.readFileSync(targetPath, 'utf8'))
        const { prev, next } = getAdjacentPosts(slug)
        const prevData = prev ? { title: prev.title, slug: prev.slug } : null
        const nextData = next ? { title: next.title, slug: next.slug } : null
        return { ...data, slug, content, prevData, nextData } as any;
      }
    }
  }

  throw new Error(`Post not found: ${slug}`);
}

export function getAdjacentPosts(slug: string) {
  const allPosts = getAllPostsChronological().reverse();
  const currentIndex = allPosts.findIndex(post => post.slug === slug);

  if (currentIndex === -1) return { prev: null, next: null };

  return {
    prev: currentIndex > 0 ? allPosts[currentIndex - 1] : null,
    next: currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null
  };
}

export function getPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, '')
  const fullPath = join(postsDirectory, `${realSlug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  const files = fs.readdirSync(postsDirectory).sort()
  const currentIndex = files.indexOf(slug + '.md')

  let prevData, nextData = null

  if (currentIndex != -1) {
    if (currentIndex > 0) {
      const { title } = matter(fs.readFileSync(join(postsDirectory, files[currentIndex - 1]), 'utf8')).data
      prevData = {
        title,
        slug: files[currentIndex - 1].replace(/\.md$/, '')
      }
    }

    if (currentIndex < files.length - 1) {
      const { title } = matter(fs.readFileSync(join(postsDirectory, files[currentIndex + 1]), 'utf8')).data
      nextData = {
        title,
        slug: files[currentIndex + 1].replace(/\.md$/, '')
      }
    }
  }

  return {
    ...data, prevData, nextData, slug: realSlug, content
  } as any
}

export type { SeasonType }