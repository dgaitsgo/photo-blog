import Layout from 'src/components/Layout'
import Image from 'next/image'

export default async function AboutPage() {
    return (
        <Layout>
            <Image src="/assets/photos/selfie.avif" alt="About Me" width={150} height={150} className="rounded-b-sm mb-2" />
            <p style={{maxWidth: '65ch'}}>
                Capturing life's collisions in the frame. Here I share my adventure through the photography:
                what I'm capturing, what's inspiring me and what I'm learning along the way.
                <br />
                Thank you for visiting.
            </p>
            <p>Say hi: <a className='underline text-blue-600' href="https://www.instagram.com/dgaitsgo.pic">instagram</a></p>
        </Layout>
    )
}