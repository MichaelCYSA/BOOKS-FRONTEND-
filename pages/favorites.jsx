import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import styles from '../styles/Main.module.scss'
import NavList from '../components/navLinks'

export default function Main({ search }) {

    const [dataBooks, setDataBooks] = React.useState(null)
    const router = useRouter()

    // favorite add logic
    React.useEffect(() => {
        if (localStorage.getItem('favorites')) {
            setDataBooks(JSON.parse(localStorage.getItem('favorites')))
        }
    }, [])

    return (
        <React.Fragment>
            <header className={styles.header}>
                <NavList
                    search={router.query.search}
                />
            </header>
            <main className={styles.main}>
                <section className={styles.main__wrapper}>
                    {
                        dataBooks ? Object.keys(dataBooks).map((book, index) => (

                            <div key={index} className={styles.main__wrapper__books}>
                                <Link href={`/book/${dataBooks[book].id}`}>
                                    <h1 className={styles.books__title}>{dataBooks[book].volumeInfo?.title}</h1>
                                </Link>
                                <div className={styles['add-favorite__container']}>
                                    <img className={styles['add-favorite']} src={'/2.svg'} />
                                </div>
                                {
                                    dataBooks[book].volumeInfo.imageLinks?.smallThumbnail &&
                                    <img src={dataBooks[book].volumeInfo.imageLinks?.smallThumbnail} className={styles.books__img} />
                                }
                                {
                                    dataBooks[book].volumeInfo.subtitle &&
                                    <p className={styles.books__subtitle}>{dataBooks[book].volumeInfo.subtitle}</p>
                                }
                                {
                                    dataBooks[book].searchInfo?.textSnippet &&
                                    <p className={styles['books__search-info']}>{dataBooks[book].searchInfo.textSnippet}</p>
                                }
                            </div>
                        ))
                        :
                        <div className={styles.empty}>
                                <h1
                                  onClick={() => router.push(`/?search=${search}`)}
                                  className={styles['empty__search']}
                                >
                                   Your favorites page is empty!
                                </h1>
                        </div>
                    }
                </section>
            </main>
        </React.Fragment>
    )
}

export async function getServerSideProps(context) {
    const { search } = context.query
    return {
        props: {
            search: search || null
        }
    }
}