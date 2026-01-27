// import { Post } from '@/interfaces/post'
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

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory)
}

export function organizeBySeason(posts: any[]) {
  const organizedPosts: any[] = []
  for (const season of seasons) {
    const seasonPosts = posts.filter((post) => {
      const postDate = post.date
      return postDate >= season.after && postDate < season.before
    })
    organizedPosts.push({
      season,
      posts: seasonPosts
    })
  }
  return organizedPosts
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

export function getPostsBySeason(season: SeasonType | undefined) {

  if (!season) {
    return []
  }

  const slugs = getPostSlugs()

  const posts = slugs.filter((slug) => {
    const slugDate = slug.split('.')[0]
    return slugDate >= season.after && slugDate < season.before
  })
  return posts.map((slug) => getPostBySlug(slug)).sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
}

// export function getCurrentSeason(): SeasonType | undefined {

// const now = new Date()
// const today = now.toISOString().split('T')[0]

// for (const season of seasons) {
//   if (today >= season.after && today < season.before) {
//     return season
//   }
// }
// return undefined
// }

// export function getSeasonURL(season: SeasonType) {
//   const now = new Date()
//   const today = now.toISOString().split('T')[0]
//   if (season.label.includes('Winter')) {
//     const year = now.getFullYear()
//     console.log('year:', year, 'today:', today)
//     if (today < `${year}-01-01`) {
//       console.log('prev year - 1:', year - 1) 
//       return `${year - 1}/${season.label.split(' ')[0].toLowerCase()}`
//     } else {
//       return `${year}/${season.label.split(' ')[0].toLowerCase()}`
//     }
//   }
//   else {
//     return `${season.label.split(' ')[1]}/${season.label.split(' ')[0].toLowerCase()}`
//   }
// }

export function getAllPosts(): any[] {
  const slugs = getPostSlugs()
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
  return posts
}