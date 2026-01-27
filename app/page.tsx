import seasons from 'src/constants/seasons'
import { redirect } from 'next/navigation'

export default function Home() {
  redirect(`${seasons[seasons.length - 1].url}`)
}