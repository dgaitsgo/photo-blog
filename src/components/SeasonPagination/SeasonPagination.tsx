'use client'

import { useRouter } from 'next/navigation'
import seasons from 'src/constants/seasons'

function SeasonPagination({ year, season }: { year: string, season: string }) {

    const router = useRouter()

    const nextSeasonIndex = seasons.findIndex(s => s.url === `/${year}/${season}`) + 1
    const prevSeasonIndex = seasons.findIndex(s => s.url === `/${year}/${season}`) - 1

    function onClickPrevious() {
        router.push(`${seasons[prevSeasonIndex].url}`, { scroll: false });
    }

    function onClickNext() {
        router.push(`${seasons[nextSeasonIndex].url}`, { scroll: false });
    }

    return (
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 my-8">
            <div className="flex justify-end">
                <div className='w-12'>
                    {nextSeasonIndex < seasons.length && (
                        <button className="text-sm w-12" onClick={onClickNext}>
                            next
                        </button>
                    )}
                </div>
            </div>

            <h2 key={`${season}-${year}`}
                className="text-xl w-48 justify-center font-bold whitespace-nowrap text-center animate-fade-in">
                {season.toLocaleUpperCase()} {year}
            </h2>

            <div className="flex justify-start">
                <div className='w-12'>
                    {prevSeasonIndex >= 0 && (
                        <button className="text-sm" onClick={onClickPrevious}>
                            prev
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SeasonPagination;