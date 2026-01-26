import styles from './SeasonPage.module.css'

function SeasonPage ({ currentSeason }: {currentSeason: string}) {

    return (
        <div>
            <p> prev </p>
            {currentSeason}
            <p> prev </p>
        </div>
    )
}

export default SeasonPage