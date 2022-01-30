import React from 'react'
import Link from 'next/link'
import debounce from "lodash/debounce"
import { useRouter } from 'next/router'

import styles from '../styles/Main.module.scss'

export default function Main({ search }) {

  const searchInput = React.useRef(null)
  const [dataBooks, setDataBooks] = React.useState(null)
  const router = useRouter()

  // get books 
  const handlePageData = async (reqQuery) => {
    const getData = await fetch(`http://localhost:8000/api/books?search=${reqQuery}`)
    if (getData) {
      const getJson = await getData.json()
      if (getJson) {
        setDataBooks(getJson)
      }
    }
  }
  
  const handleSearch = debounce(async ({ target: { value } = {} }) => {
    router.push(
      {
        pathname: `/`,
        query: `search=${value}`,
      },
      undefined,
      { shallow: true }
    )
    handlePageData(value)
  }, 1000)

  React.useEffect(() => {
    if (search) {
      handlePageData(search)
      searchInput.current.value = search
    }
    searchInput.current.addEventListener("input", handleSearch, false);
  }, [])
  
  return (
    <React.Fragment>
      <header className={styles.header}>
        <nav className={styles.header__nav}></nav>
        <input
          ref={searchInput}
          className={styles.header__search}
          placeholder={'Search books...'}
        />
      </header>
      <main className={styles.main}>
        <section className={styles.main__wrapper}>
          {
            dataBooks?.items?.map((book, index) => (
              <Link key={index} href={`/book/${book.selfLink?.split('/').reverse()[0]}`}>
                <div className={styles.main__wrapper__books}>
                  <h1 className={styles.books__title}>{book.volumeInfo?.title}</h1>
                  {
                    book.volumeInfo.imageLinks?.smallThumbnail &&
                    <img src={book.volumeInfo.imageLinks?.smallThumbnail} className={styles.books__img} />
                  }
                  {
                    book.volumeInfo.subtitle &&
                    <p className={styles.books__subtitle}>{book.volumeInfo.subtitle}</p>
                  }
                  {
                    book.searchInfo?.textSnippet &&
                    <p className={styles['books__search-info']}>{book.searchInfo.textSnippet}</p>
                  }
                </div>
              </Link>
            ))
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