import React from "react"
import styles from '../../styles/Main.module.scss'
import { useRouter } from "next/router"

export default function BooksDetails({ id }) {

  const [bookDetails, setBookDetails] = React.useState(null)
  const router = useRouter()

  React.useEffect(() => {
    (async () => {
      const getResult = await fetch(`http://localhost:8000/api/books/${id}`)
      if (getResult) {
        const getJson = await getResult.json()
        if (getJson) {
          setBookDetails(getJson)
        }
      }
    })()
  }, [])

  return (
    <React.Fragment>
      <header className={styles.header}>
        <button
          className={styles.header__back}
          onClick={() => router.back()}
        >
          Back to main
        </button>
      </header>
      {
        bookDetails &&
        <div className={styles['book-details']}>
          <h1 className={styles.books__title}>{bookDetails.volumeInfo.title}</h1>
          {
            bookDetails.volumeInfo.subtitle &&
            <p className={styles.books__subtitle}>{bookDetails.volumeInfo.subtitle}</p>
          }
          {
            bookDetails.volumeInfo.imageLinks?.smallThumbnail &&
            <img src={bookDetails.volumeInfo.imageLinks?.smallThumbnail} className={styles['books__details-img']} />
          }
          <div className={styles.books__description}>
            {bookDetails.volumeInfo.description}
          </div>
        </div>
      }
    </React.Fragment>
  )
};

export async function getServerSideProps(context) {
  const { bookId } = context.params
  return {
    props: {
      id: bookId || null
    }
  }
}