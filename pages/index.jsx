import React from 'react'
import Link from 'next/link'
import debounce from "lodash/debounce"
import { useRouter } from 'next/router'

import styles from '../styles/Main.module.scss'
import NavList from '../components/navLinks'

export default function Main({ search }) {

  const searchInput = React.useRef(null)
  const [dataBooks, setDataBooks] = React.useState(null)
  const [favoriteItem, setFavoriteItem] = React.useState(null)
  const [favoriteList, setFavoriteList] = React.useState({})
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

  // favorite add logic
  React.useEffect(() => {
    if (localStorage.getItem('favorites')) {
      setFavoriteList(JSON.parse(localStorage.getItem('favorites')))
    }
    if (favoriteItem) {
      let favoriteListObject = {}
      if (favoriteList[favoriteItem.id]) {
        Object.keys(favoriteList).map((favoriteEl) => {
          if (favoriteEl === favoriteItem.id) {
            return
          }
          favoriteListObject[favoriteEl] = favoriteList[favoriteEl]
        })
      } else {
        favoriteListObject = { ...favoriteList, [favoriteItem.id]: favoriteItem }
      }
      localStorage.setItem('favorites', JSON.stringify(favoriteListObject))
      setFavoriteItem(null)
    }
  }, [favoriteItem])

  return (
    <React.Fragment>
      <header className={styles.header}>
        <NavList
          search={router.query.search}
        />
        <input
          ref={searchInput}
          className={styles.header__search}
          placeholder={'Search books...'}
        />
      </header>
      <main className={styles.main}>
        <section className={styles.main__wrapper}>
          {
            dataBooks && dataBooks.items ? dataBooks.items.map((book, index) => (

              <div key={index} className={styles.main__wrapper__books}>
                <Link href={`/book/${book.id}`}>
                  <h1 className={styles.books__title}>{book.volumeInfo?.title}</h1>
                </Link>
                <div className={styles['add-favorite__container']}>
                  {
                    favoriteList[book.id] ?
                      <img className={styles['add-favorite']} onClick={() => { setFavoriteItem(book) }} src={'/2.svg'} />
                      :
                      <img className={styles['add-favorite']} onClick={() => { setFavoriteItem(book) }} src={'/1.svg'} />
                  }
                </div>
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

            ))
              :
              <div className={styles.empty}>
                <h1
                  onClick={() => searchInput.current.focus()}
                  className={styles['empty__search']}
                >
                  This page is empty click for starting search!
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