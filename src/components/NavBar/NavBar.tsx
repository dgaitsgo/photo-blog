'use client'
import styles from './Navbar.module.css'
import { usePathname } from 'next/navigation'

function NavBar() {

    const pathName = usePathname()

    return (
        <div className={styles['header-announcement-bar-wrapper']}>
            <div className={styles['header-inner']}>
                <a href="/" className={styles['logo']}>dgaitsgo.pic</a>
                <div className={styles['nav-links']}>
                    <a href="/" className={`${pathName != '/about' ? 'underline' : ''}`}>
                        blog
                    </a>
                    <a href="/about" className={`${pathName == '/about' ? 'underline' : ''}`}>
                        about
                    </a>
                </div>
            </div>
        </div>
    )
}

export default NavBar