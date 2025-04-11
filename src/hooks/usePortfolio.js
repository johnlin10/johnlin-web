import { useState, useEffect } from 'react'
import { db } from '../firebase'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'

export const usePortfolio = (portfolioId) => {
  const [portfolios, setPortfolios] = useState([])
  const [currentPortfolio, setCurrentPortfolio] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 獲取所有作品集
  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setLoading(true)
        const projectsCollection = collection(db, 'projects')
        const projectSnapshot = await getDocs(projectsCollection)
        const projectList = projectSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setPortfolios(projectList)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPortfolios()
  }, [])

  // 如果有 portfolioId，獲取特定作品集
  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!portfolioId) return

      try {
        setLoading(true)
        const docRef = doc(db, 'projects', portfolioId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setCurrentPortfolio({
            id: docSnap.id,
            ...docSnap.data(),
          })
        } else {
          setError('Portfolio not found')
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPortfolio()
  }, [portfolioId])

  return {
    portfolios,
    currentPortfolio,
    loading,
    error,
    setPortfolios,
  }
}
