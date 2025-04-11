import style from '../../Portfolio.module.scss'
import { Link } from 'react-router-dom'

import { db } from '../../../../firebase'
import { doc, deleteDoc } from 'firebase/firestore'
import { storage } from '../../../../firebase'
import { ref, deleteObject, listAll } from 'firebase/storage'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faLock,
  faTrash,
  faPenToSquare,
} from '@fortawesome/free-solid-svg-icons'

import { useSprings, animated } from '@react-spring/web'

function List({ isAdmin, portfolios, setPortfolios }) {
  // animation
  const _spring_portfolio_list = useSprings(
    portfolios.filter((portfolio) => !(portfolio.private && !isAdmin)).length,
    portfolios
      .filter((portfolio) => !(portfolio.private && !isAdmin))
      .map((_, index) => ({
        from: { opacity: 0, transform: 'translateY(20%)' },
        to: { opacity: 1, transform: 'translateY(0)' },
        delay: 70 * index,
      }))
  )

  const handleDelete = async (portfolioId) => {
    if (
      window.confirm(
        'Are you sure you want to delete this portfolio? This action is irreversible.'
      )
    ) {
      try {
        // delete project document in firestore
        await deleteDoc(doc(db, 'projects', portfolioId))

        // delete all related files in storage
        const storageRef = ref(storage, `projects/${portfolioId}`)
        const fileList = await listAll(storageRef)
        const deletePromises = fileList.items.map((fileRef) =>
          deleteObject(fileRef)
        )
        await Promise.all(deletePromises)

        // update local state
        setPortfolios(
          portfolios.filter((portfolio) => portfolio.id !== portfolioId)
        )

        alert('Portfolio deleted successfully')
      } catch (error) {
        console.error('Error deleting portfolio:', error)
        alert('Error deleting portfolio, please try again later')
      }
    }
  }

  return (
    <div className={style.projectList}>
      <div className={style.container}>
        <ul>
          {portfolios
            ?.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate())
            .filter((portfolio) => !(portfolio.private && !isAdmin))
            .map((portfolio, index) => {
              return (
                <animated.li
                  key={portfolio.id}
                  style={_spring_portfolio_list[index]}
                  className={portfolio.private ? style.private : ''}
                >
                  <Link to={`/portfolio/${portfolio.id}`}>
                    <h3>
                      {portfolio.private ? (
                        <FontAwesomeIcon icon={faLock} />
                      ) : (
                        ''
                      )}
                      {portfolio.name}
                    </h3>
                    <p className={style.description}>{portfolio.description}</p>
                    <p className={style.publishDate}>
                      {portfolio.createdAt?.toDate().toLocaleDateString()}
                    </p>
                  </Link>
                  {isAdmin && (
                    <button
                      className={style.deleteButton}
                      onClick={() => handleDelete(portfolio.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  )}
                </animated.li>
              )
            })}
        </ul>
      </div>
      {/* {isAdmin && (
        <Link to="/portfolio/create" className={style.createPortfolio}>
          <FontAwesomeIcon icon={faPenToSquare} />
        </Link>
      )} */}
    </div>
  )
}

export default List
