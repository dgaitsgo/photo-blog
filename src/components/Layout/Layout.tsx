import { NavBar } from '../NavBar'
import styles from './Layout.module.css'

function Layout({ children }: { children: React.ReactNode }) {

    return (
        <div className={`${styles['page-wrapper']} bg-zinc-50 font-sans dark:bg-black`}>
            <NavBar />
            <div className={styles['page-content-wrapper']}>
                {children}
            </div>
        </div>
    )

}

export default Layout