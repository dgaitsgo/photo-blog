import Layout from "src/components/Layout";
import { getPostSlugs, getPostBySlug } from "src/api"
import Card from "src/components/Card";

export default function Home() {

  const posts = getPostSlugs().map(p => getPostBySlug(p)).sort((post1, post2) => (post1.date > post2.date ? -1 : 1));

  return (
    <Layout>
        {posts.map(({title, date, excerpt, location, tags, cardCover, slug }, i) =>
          <Card key={i} title={title} date={date} excerpt={excerpt} location={location} tags={tags} cardCover={cardCover} slug={slug} />)
      }
    </Layout>
  );
}
