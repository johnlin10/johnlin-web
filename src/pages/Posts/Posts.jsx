// import { useEffect, useState } from 'react'
import style from './Posts.module.scss'
// import { db } from '../../firebase'
// import { collection, getDocs } from 'firebase/firestore'
import { useTranslation } from 'react-i18next'

function Posts() {
  const { t } = useTranslation()
  // const [post, setPost] = useState([
  //   {
  //     id: '',
  //     title: '標題',
  //     content: '',
  //     tags: ['tag1', 'tag2', 'tag3'],
  //   },
  // ])

  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     const postsCollection = collection(db, 'posts')
  //     const postsSnapshot = await getDocs(postsCollection)
  //     const postsList = postsSnapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }))
  //     setPost(postsList)
  //   }
  //   fetchPosts()
  // }, [])

  return (
    <div className={style.container}>
      <div>
        <p>{t('posts.content')}</p>
      </div>
    </div>
  )
}

export default Posts
