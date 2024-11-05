import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { auth } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { setUser, clearUser } from '../redux/authSlice'

function useAuth() {
  const dispatch = useDispatch()
  const { currentUser, isAdmin } = useSelector((state) => state.auth)

  useEffect(() => {
    const unsubscribed = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser(user))
      } else {
        dispatch(clearUser())
      }
    })
    return unsubscribed
  }, [dispatch])

  return { currentUser, isAdmin }
}

export default useAuth
