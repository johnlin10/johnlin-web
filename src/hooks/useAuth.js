import { useEffect } from 'react'
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
        // 只提取必要的用戶資訊
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        }
        dispatch(setUser(userData))
      } else {
        dispatch(clearUser())
      }
    })
    return unsubscribed
  }, [dispatch])

  return { currentUser, isAdmin }
}

export default useAuth
