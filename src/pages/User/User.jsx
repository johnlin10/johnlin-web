import style from './User.module.scss'
import { useState, useEffect } from 'react'
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth'
import { auth, db } from '../../firebase'
import { getDoc, doc, setDoc } from 'firebase/firestore'
import useAuth from '../../hooks/useAuth'

// fontawesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

function User() {
  const { currentUser } = useAuth()

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider).then(async (result) => {
      const user = result.user
      console.log(user)

      const userRef = doc(db, 'users', user.uid)
      const userDoc = await getDoc(userRef)
      if (!userDoc.exists()) {
        setDoc(userRef, {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          uid: user.uid,
          createdAt: new Date(),
        })
      }
    })
  }
  const handleLogout = () => {
    signOut(auth)
  }

  return (
    <div className={style.userContainer}>
      <div className={style.userContent}>
        {currentUser ? (
          <>
            <div className={style.userInfo}>
              <img src={currentUser.photoURL} alt={currentUser.displayName} />
              <h2>{currentUser.displayName}</h2>
              <p>{currentUser.email}</p>
            </div>
            <div className={style.userActions}>
              <button className={style.logoutButton} onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} className={style.faIcon} />
                登出
              </button>
            </div>
          </>
        ) : (
          <div className={style.userActions}>
            <h2>登入選項</h2>
            <button onClick={handleLogin}>
              <FontAwesomeIcon icon={faGoogle} className={style.faIcon} />
              使用 Google 登入
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default User
