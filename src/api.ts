// import { Post } from "@/interfaces/post";
import fs from "fs";
import matter from "gray-matter";
import { join } from "path";

const postsDirectory = join(process.cwd(), "_posts");

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, "")
  const fullPath = join(postsDirectory, `${realSlug}.md`)
  const fileContents = fs.readFileSync(fullPath, "utf8")
  const { data, content } = matter(fileContents)

  const files = fs.readdirSync(postsDirectory).sort()
  const currentIndex = files.indexOf(slug + '.md')

  let prevData, nextData = null

  if (currentIndex != -1) {
    if (currentIndex > 0) {
      const { title } = matter(fs.readFileSync(join(postsDirectory, files[currentIndex - 1]), "utf8")).data
      prevData = {
        title,
        slug: files[currentIndex - 1].replace(/\.md$/, "")
      }
    }

    if (currentIndex < files.length - 1) {
      const { title } = matter(fs.readFileSync(join(postsDirectory, files[currentIndex + 1]), "utf8")).data
      nextData = {
        title,
        slug: files[currentIndex + 1].replace(/\.md$/, "")
      }
    }
  }

  return {
    ...data, prevData, nextData, slug: realSlug, content
  } as any;
}

export function getAllPosts(): any[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}