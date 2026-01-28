import { notFound } from 'next/navigation'
import markdownToHtml from 'src/lib/markdownToHtml'
import { findPostBySlug, getAllPostsChronological } from 'src/api'
import Gallery from 'src/components/Gallery'
import Layout from 'src/components/Layout'
import PrevNextPagination from 'src/components/PrevNextPagination'
import ArticleLayout from 'src/components/ArticleLayout'

export default async function Post(props: Params) {
  const params = await props.params
  const post = findPostBySlug(params.slug)

  if (!post) {
    return notFound()
  }

  let content = await markdownToHtml(post.content || '')

  const { renderToString } = await import("react-dom/server")

  // if (post.galleries) {
  //   const regex = new RegExp("{{gallery}}", "g")
  //   const matches = content.match(regex)
  //   matches?.forEach((match, i) => {
  //     content = content.replace("{{gallery}}", renderToString(<Gallery gallery={post.galleries[i]} />))
  //   })
  // }

  const dateString = new Date(post.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <Layout>
      <div className='article-content'>
        <p className='text-base text-gray-500 dark:text-gray-400 article-date'>{dateString}</p>
        <h3 className='mb-4 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-4xl dark:text-white align-center self-center'>{post.title}</h3>
        {/* <div className="prose max-w-12xl mx-auto width-full article-content"
          dangerouslySetInnerHTML={{ __html: content }}
        /> */}
        <ArticleLayout post={{ ...post, content }} />
      </div>
      <PrevNextPagination post={post} />
    </Layout>
  )
}

type Params = {
  params: Promise<{
    slug: string
  }>
}
export async function generateStaticParams() {

  const posts = getAllPostsChronological()

  return posts.map((post: any, i) => ({
    slug: post.slug,
    prevTitle: i !== 0 ? posts[i - 1].title : null,
    nextTitle: i === posts.length - 1 ? null : posts[i + 1].title
  }))
}