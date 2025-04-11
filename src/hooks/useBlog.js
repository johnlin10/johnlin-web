import { useState, useCallback, useEffect } from 'react'
import {
  setDoc,
  collection,
  doc,
  onSnapshot,
  getDoc,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../firebase'

const useBlog = () => {
  const [blogs, setBlogs] = useState([
    // {
    //   id: '1ef134t4',
    //   title: 'AI 時代下的省思：我們失去的，是不是比得到的更多？',
    //   publishDate: 1731628800000,
    //   subtitle: '從依賴 AI 的角度談學習與創作的本質',
    //   cover: '',
    //   content: [
    //     { type: 'title', text: '人工智慧如何改變我們' },
    //     {
    //       type: 'text',
    //       text: `
    //       人工智慧對我們一般人來說， 影響最大的是什麼？
    //       是那些可以提高生產力的 AI 工具， 讓我們完成更多的工作？ 還是那些讓生活更便利的智慧科技， 讓一切變得更加輕鬆？
    //       我覺得都不是。 人工智慧真正改變的，是我們自己。`,
    //     },
    //     { type: 'title', text: '我們與 AI 的依存關係' },
    //     {
    //       type: 'text',
    //       text: `
    //       當我們逐漸依賴 AI 時， 失去的是什麼？
    //       現在的 AI 技術進步， 確實讓生活和學習看起來更加方便， 但我認為， 它最大的影響不在技術進步帶來的便利， 而在於我們對它的依賴， 特別是在學習與創作的過程中， 這種依賴正悄悄侵蝕我們最珍貴的能力： 深度思考的能力， 以及學習與創作中的反思過程。`,
    //     },
    //     { type: 'title', text: '效率的代價' },
    //     {
    //       type: 'text',
    //       text: `
    //       很多人， 尤其是學生， 已經習慣用 AI 工具來快速完成作業或生成內容。 看似提高了效率， 但我們是否忽略了， 學習的真正意義從來不只是獲得答案。 它是一個過程， 是在探索與錯誤中建立自己的觀點與價值。 而這樣的過程， 正在被 AI 工具所取代。`,
    //     },
    //     { type: 'title', text: '從教育中觀察問題' },
    //     {
    //       type: 'text',
    //       text: `
    //       這個問題， 我是從身旁的同學身上看到的， 但追根究柢， 問題的源頭我認為是學校……
    //       學校是學生的第二個家， 它參與塑造了學生的價值觀與學習態度。 但現在許多教育機構為了跟上科技潮流， 開始推動 AI 工具進入教學環境， 成為學習與作業的主要輔助。`,
    //     },
    //     { type: 'title', text: 'AI 科技的兩面性' },
    //     {
    //       type: 'text',
    //       text: `
    //       表面上看， 這些工具提升了學習效率， 但在未經深思熟慮的情況下， 這種模式正在間接剝奪學生「學習如何學習」的能力。
    //       學生完成作業的速度更快了， 卻失去了深入思考的機會， 失去了在學習過程中獨立解決問題的挑戰， 甚至失去了用自己的經歷和感受來創作的熱情。`,
    //     },
    //     { type: 'title', text: '工具如何被善用' },
    //     {
    //       type: 'text',
    //       text: `
    //       AI 作為一種工具， 確實有它的價值。 但工具的價值， 永遠取決於使用者的目的與態度。
    //       教育的意義， 不是追趕科技潮流， 而是幫助學生、孩子建立自我成長的基礎。
    //       如果我們的教育體系只關注如何「教 AI」， 卻忽略了「教人」， 那麼，這樣的發展真的值得嗎？`,
    //     },
    //     { type: 'title', text: '重新定義我們的學習態度' },
    //     {
    //       type: 'text',
    //       text: `
    //       未來 AI 的發展方向， 或許不是我們能輕易掌控的， 但作為一個普通人， 特別是學生， 我們能掌控的， 是自己如何對待學習， 如何看待創作的價值。
    //       學習的意義在於探索與內化， 創作的意義在於表達與思考。`,
    //     },
    //     { type: 'title', text: '讓 AI 成為我們的助力，而非主導' },
    //     {
    //       type: 'text',
    //       text: `
    //       我們需要的， 不是讓 AI 代替我們學習與創作， 而是讓它成為一個幫助我們成長的工具， 而不是吞噬我們學習力與創造力的滔天巨浪。
    //       所以，我想問你： 面對這波 AI 浪潮， 你是否守住了屬於自己最珍貴的價值？`,
    //     },
    //     // { type: 'code', text: '程式碼' },
    //     // { type: 'image', url: 'https://picsum.photos/500/300' },
    //     // {
    //     //   type: 'video',
    //     //   url: 'https://firebasestorage.googleapis.com/v0/b/johnlin10-web.appspot.com/o/projects%2F2e3a1ea0bd03%2F%E7%94%B0%E9%87%8E%E6%95%B8%E6%93%9A%E7%A7%91%E5%AD%B8%E5%AE%B6_%E4%BD%9C%E5%93%81%E5%B1%95%E7%A4%BAv1.2.mov?alt=media&token=ec2dd4b5-9ccb-4325-a0ca-a8de8b44a6a9',
    //     // },
    //     // { type: 'yt_video', id: 'dQw4w9WgXcQ' },
    //     // { type: 'audio', url: 'https://example.com/audio.mp3' },
    //     // { type: 'link', url: 'https://johnlin.me' },
    //   ],
    //   tags: ['socialIssue', 'education', 'reflection', 'ai'],
    // },
    // {
    //   id: 'qwe4gr5f',
    //   title: '重新詮釋「吃苦」：從熱情中找到成長的力量',
    //   publishDate: 1731110400000,
    //   subtitle: '努力不一定等於痛苦，換個角度看挑戰',
    //   cover: '',
    //   content: [
    //     { type: 'title', text: '苦痛與成功的連結真的必要嗎？' },
    //     {
    //       type: 'text',
    //       text: `
    //       有時候社會讓我們覺得， 只有經歷苦痛才能成就自己。 但這真的是唯一的路嗎？
    //       也許， 與其強迫自己「吃苦」， 不如找到一個讓自己充滿熱情的目標， 這樣每一步的努力都會變成自然的過程， 而不只是忍耐痛苦。`,
    //     },
    //     { type: 'title', text: '傳統觀念中的「苦」' },
    //     {
    //       type: 'text',
    //       text: `
    //       「苦」這個字眼， 總讓人聯想到艱辛，甚至折磨。 有句老話「吃得苦中苦，方為人上人」 說得就好像成長必須和痛苦掛鉤， 才算得上成功。
    //       而這樣的觀念真的是適合每個人嗎？ 難道只有經歷痛苦， 才能換來美好嗎？ 如果我們換個角度來看「苦」的意義， 也許可以發現不同的可能……`,
    //     },
    //     { type: 'title', text: '重新定義「吃對苦」' },
    //     {
    //       type: 'text',
    //       text: `
    //       我認為所謂的「吃對苦」， 並不是去承受痛苦來換取未來的甜美， 而是找到自己熱愛的事情， 然後在這條路上， 自然而然的承擔它所帶來的挑戰。
    //       當我們跟隨內心的信念， 投入在自己相信的目標中時， 這些挑戰反而成為了助力， 而不再是負擔。`,
    //     },
    //     { type: 'title', text: '挑戰是否等於痛苦？' },
    //     {
    //       type: 'text',
    //       text: `
    //       也許我們真正要問自己的是： 我們是否真的把路上的阻礙視為「苦」？
    //       如果是， 那可能代表我們內心對這些挑戰並不認同， 只是被動的接受「吃苦就能換來甘甜」的說法。
    //       但如果這條路是我們自己選擇的， 且心甘情願地付出， 這樣的艱難反而會帶來內心的充實與成就感。`,
    //     },
    //     { type: 'title', text: '從熱愛中找到成長的動力' },
    //     {
    //       type: 'text',
    //       text: `
    //       當我們找到自己熱愛的方向時，所有的付出都會成為心靈的養分，帶來無法取代的收穫。與其勉強自己忍耐，不如放下「苦」的概念，專注在如何在過程中找到熱情與信念。這樣一來，所謂的「苦」就不再是苦，而是人生中最寶貴的成長經歷。`,
    //     },
    //   ],
    //   tags: ['selfGrowth', 'socialPhenomena', 'education', 'reflection'],
    // },
  ])
  const [currentBlog, setCurrentBlog] = useState(null)

  useEffect(() => {
    const blogsCollection = collection(db, 'blogs')

    const unsubscribe = onSnapshot(blogsCollection, (snapshot) => {
      const blogsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setBlogs(blogsData)
    })

    return () => unsubscribe()
  }, [])

  const updateBlog = useCallback(
    async (id, updatedBlog) => {
      try {
        console.log('updated blog', id)
        const blogRef = doc(db, 'blogs', id)
        const blogDoc = await getDoc(blogRef)

        // 確保更新的文章 ID 與傳入的 ID 相符
        if (updatedBlog.id !== id) {
          throw new Error('文章 ID 不匹配')
        }

        if (!blogDoc.exists()) {
          await setDoc(blogRef, {
            ...updatedBlog,
            id: id,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        } else {
          await updateDoc(blogRef, {
            ...updatedBlog,
            id: id,
            updatedAt: new Date(),
          })
        }

        setBlogs((prevBlogs) => {
          const newBlogs = prevBlogs.map((blog) =>
            blog.id === id ? updatedBlog : blog
          )
          return newBlogs
        })

        if (currentBlog?.id === id) {
          setCurrentBlog(updatedBlog)
        }
      } catch (error) {
        console.error('更新文章時發生錯誤：', error)
        throw error
      }
    },
    [currentBlog]
  )

  const setCurrentBlogById = (id) => {
    const blog = blogs.find((blog) => blog.id === id)
    setCurrentBlog(blog)
  }

  return {
    blogs,
    currentBlog,
    updateBlog,
    setCurrentBlogById,
  }
}

export default useBlog
