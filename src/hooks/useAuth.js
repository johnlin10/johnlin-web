import { useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

function useAuth() {
  const [currentUser, setCurrentUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const unsubscribed = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      if (user?.uid === process.env.REACT_APP_ADMIN_UID) {
        setIsAdmin(true)
      }
    })
    return unsubscribed
  }, [])

  return { currentUser, isAdmin }
}

export default useAuth
