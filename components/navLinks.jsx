import styles from '../styles/Main.module.scss'

export default function NavList({ search }) {
    return (
        <nav className={styles.header__nav}>
            <ul className={styles.nav__ul}>
                <li className={styles.nav__li}>
                    <a href={`/?search=${search ? search : ''}`} className={styles.nav__a}>Search</a>
                </li>
                <li className={styles.nav__li}>
                    <a href={`/favorites/?search=${search ? search : ''}`} className={styles.nav__a}>Favorites</a>
                </li>
            </ul>
        </nav>
    )
}