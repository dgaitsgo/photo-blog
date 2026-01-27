import Layout from 'src/components/Layout'
import Card from 'src/components/Card'
import seasons from 'src/constants/seasons'
import type { SeasonType as seasonType } from 'src/api'
import { getPostsByYearAndSeason } from 'src/api'
import SeasonPagination from 'src/components/SeasonPagination'

export async function generateStaticParams() {
    return (
        seasons.map((season: seasonType) => {
            const year = season.label.split(' ')[1] || season.label.split(' ')[0].split('/')[1]
            const seasonName = season.label.split(' ')[0].toLowerCase()
            return {
                year: year,
                season: seasonName
            }
        })
    )
}

export default async function Home({ params }: { params: { year: string, season: string } }) {

    const { year, season } = await params
    const posts = getPostsByYearAndSeason(year, season)

    return (
        <Layout>
            <SeasonPagination year={year} season={season} />
            {posts.map(({ title, date, excerpt, location, tags, cardCover, slug }, i) =>
                <Card key={i} title={title} date={date} excerpt={excerpt} location={location} tags={tags} cardCover={cardCover} articlePath={`/post/${slug.split('/')[2]}`} />)
            }
        </Layout>
    )

}
