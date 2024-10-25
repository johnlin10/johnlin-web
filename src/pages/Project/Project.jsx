import React, { useEffect, useState, useRef } from 'react'
import style from './Project.module.scss'
import { useParams, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFilePdf,
  faFileZipper,
  faCircleExclamation,
  faFilePowerpoint,
  faFileWord,
  faFileExcel,
  faCode,
  faFile,
  faImage,
  faHeadphones,
  faPlay,
  faPause,
  faPlus,
  faLink,
  faSpinner,
  faArrowRotateRight,
  faArrowRotateLeft,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import { faPython, faSquareJs } from '@fortawesome/free-brands-svg-icons'
import { db } from '../../firebase'
import {
  collection,
  getDocs,
  onSnapshot,
  doc,
  deleteDoc,
} from 'firebase/firestore'
import { storage } from '../../firebase'
import { ref, deleteObject, listAll } from 'firebase/storage'
import useAuth from '../../hooks/useAuth'

function SchoolProject() {
  const { projectId } = useParams()
  const { isAdmin } = useAuth()
  const [projects, setProjects] = useState([])
  const [currentProject, setCurrentProject] = useState(null)

  // 修改这个 useEffect
  useEffect(() => {
    const fetchProjects = async () => {
      const projectsCollection = collection(db, 'projects')
      const projectSnapshot = await getDocs(projectsCollection)
      const projectList = projectSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setProjects(projectList)
    }

    fetchProjects()

    // 设置实时监听
    const projectsCollection = collection(db, 'projects')
    const unsubscribe = onSnapshot(projectsCollection, (snapshot) => {
      const updatedProjects = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setProjects(updatedProjects)
    })

    // 清理函数
    return () => unsubscribe()
  }, [])

  // 在有 projectId 時，設定 currentProject
  useEffect(() => {
    setCurrentProject(projects.find((p) => p.id === projectId))
  }, [projectId, projects])

  // const projects = [
  //   {
  //     id: '20241021001',
  //     name: '社群媒體上機實作考（一）',
  //     description: '於 10/21 社群媒體製作課程上的小考成品',
  //     publishDate: '2024-10-21',
  //     creationDate: '2024-10-21',
  //     author: '林昌龍',
  //     private: true,
  //     media: [
  //       {
  //         type: 'web_video',
  //         name: 'F11308063_林昌龍_社群媒體上機實作考（一）.mov',
  //         url: 'https://firebasestorage.googleapis.com/v0/b/johnlin10-web.appspot.com/o/assets%2Fschool_project%2Fvideo%2FF11308063_林昌龍_社群媒體上機實作考（一）.mov?alt=media&token=a7c34f94-d199-45f2-ae5f-27b0851f8388',
  //       },
  //       {
  //         type: 'audio',
  //         name: 'F11308063_林昌龍_社群媒體上機實作考（一）.AAC',
  //         url: 'https://firebasestorage.googleapis.com/v0/b/johnlin10-web.appspot.com/o/assets%2Fproject%2F20241021001%2FF11308063_林昌龍_社群媒體上機實作考（一）.AAC?alt=media&token=ef59d938-b3eb-43c5-a460-41e93c7b04eb',
  //       },
  //       {
  //         type: 'pdf',
  //         name: '社群媒體_(1021_小影片)_作業單_(班級_FM1A_座號_20_姓名_林昌龍).pdf',
  //         url: 'https://firebasestorage.googleapis.com/v0/b/johnlin10-web.appspot.com/o/assets%2Fproject%2F20241021001%2F社群媒體_(1021_小影片)_作業單_(班級_FM1A_座號_20_姓名_林昌龍).pdf?alt=media&token=95d4ed7d-f551-4194-8015-3b3dc6cbf29b',
  //       },
  //       {
  //         type: 'file',
  //         name: '社群媒體_(1021_小影片)_作業單_(班級_FM1A_座號_20_姓名_林昌龍).doc',
  //         url: 'https://firebasestorage.googleapis.com/v0/b/johnlin10-web.appspot.com/o/assets%2Fproject%2F20241021001%2F社群媒體_(1021_小影片)_作業單_(班級_FM1A_座號_20_姓名_林昌龍).doc?alt=media&token=9449e778-77d6-4bc6-abce-adaba3e73a72',
  //       },
  //       {
  //         type: 'website',
  //         name: 'SafeChat',
  //         url: 'https://safechat.com/post/3285821948192095054',
  //       },
  //     ],
  //   },
  //   // {
  //   //   id: 'test-project',
  //   //   name: 'Test Project',
  //   //   description: 'Test Description',
  //   //   publishDate: '2024-10-22',
  //   //   creationDate: '2024-10-22',
  //   //   author: 'John Lin',
  //   //   media: [
  //   //     {
  //   //       type: 'web_video',
  //   //       name: '',
  //   //       url: 'https://firebasestorage.googleapis.com/v0/b/johnlin10-web.appspot.com/o/assets%2Fschool_project%2Fvideo%2FF11308063_林昌龍_社群媒體上機實作考（一）.mov?alt=media&token=a7c34f94-d199-45f2-ae5f-27b0851f8388',
  //   //     },
  //   //     {
  //   //       type: 'file',
  //   //       name: 'test.doc',
  //   //       url: 'https://firebasestorage.googleapis.com/v0/b/johnlin10-web.appspot.com/o/assets%2Fproject%2F20241021001%2F社群媒體_(1021_小影片)_作業單_(班級_FM1A_座號_20_姓名_林昌龍).doc?alt=media&token=9449e778-77d6-4bc6-abce-adaba3e73a72',
  //   //     },
  //   //     {
  //   //       type: 'file',
  //   //       name: 'test.zip',
  //   //       url: 'https://firebasestorage.googleapis.com/v0/b/johnlin10-web.appspot.com/o/assets%2Fproject%2Ftest-project%2F1021_實作題材料(1).zip?alt=media&token=f6eeaf66-98d0-41df-b43b-bd2e6db2e431',
  //   //     },
  //   //     {
  //   //       type: 'audio',
  //   //       name: 'test.m4a',
  //   //       url: 'https://firebasestorage.googleapis.com/v0/b/johnlin10-web.appspot.com/o/assets%2Fproject%2Ftest-project%2F有形的翅膀.m4a?alt=media&token=d5fac707-dff1-4013-8f2f-07dd4029bed0',
  //   //     },
  //   //     {
  //   //       type: 'file',
  //   //       name: 'test.js',
  //   //       url: 'https://firebasestorage.googleapis.com/v0/b/johnlin10-web.appspot.com/o/assets%2Fproject%2Ftest-project%2Fmain.cf94dd57.js?alt=media&token=45be6891-924f-4934-aa1b-0de7df317c2b',
  //   //     },
  //   //     {
  //   //       type: 'pdf',
  //   //       name: 'test.pdf',
  //   //       url: 'https://firebasestorage.googleapis.com/v0/b/johnlin10-web.appspot.com/o/assets%2Fproject%2F20241021001%2F社群媒體_(1021_小影片)_作業單_(班級_FM1A_座號_20_姓名_林昌龍).pdf?alt=media&token=95d4ed7d-f551-4194-8015-3b3dc6cbf29b',
  //   //     },
  //   //     {
  //   //       type: 'pdf',
  //   //       name: 'test.jpg',
  //   //       url: 'https://firebasestorage.googleapis.com/v0/b/johnlin10-web.appspot.com/o/assets%2Fproject%2Ftest-project%2Fistockphoto-467367026-612x612.jpg?alt=media&token=65c5722c-337c-4705-a1b5-cb19b4cad85a',
  //   //     },
  //   //     {
  //   //       type: 'pdf',
  //   //       name: 'test.pptx',
  //   //       url: 'https://firebasestorage.googleapis.com/v0/b/johnlin10-web.appspot.com/o/assets%2Fproject%2Ftest-project%2F我們這一班系語新知簡報.pptx?alt=media&token=2e4342c5-150d-42eb-ab06-dad3818d44f6',
  //   //     },
  //   //     {
  //   //       type: 'pdf',
  //   //       name: 'test.xlsx',
  //   //       url: 'https://firebasestorage.googleapis.com/v0/b/johnlin10-web.appspot.com/o/assets%2Fproject%2Ftest-project%2F113-1資管系_fm1a_LINE群組核對名單.xlsx?alt=media&token=098a622e-e448-467a-89cf-b0fc4e737d0d',
  //   //     },
  //   //   ],
  //   // },
  // ]

  // find project

  // handle pdf click
  const handleFileClick = (url, type) => {
    window.open(url, '_blank')
  }

  // get file icon
  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase()
    switch (extension) {
      case 'pdf':
        return faFilePdf
      case 'py':
        return faPython
      case 'js':
        return faSquareJs
      case 'html':
      case 'css':
      case 'ts':
      case 'jsx':
      case 'tsx':
      case 'json':
      case 'xml':
      case 'php':
      case 'java':
      case 'cpp':
      case 'c':
        return faCode
      case 'doc':
      case 'docx':
        return faFileWord
      case 'ppt':
      case 'pptx':
        return faFilePowerpoint
      case 'xls':
      case 'xlsx':
      case 'csv':
        return faFileExcel
      case 'mp3':
      case 'wav':
      case 'ogg':
      case 'm4a':
      case 'avif':
      case 'aac':
        return faHeadphones
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return faImage
      case 'zip':
        return faFileZipper
      default:
        return faFile
    }
  }

  // render media
  const renderMedia = () => {
    return currentProject?.files.map((item, index) => {
      switch (item.type) {
        case 'youtube_video':
          return (
            <iframe
              key={index}
              width="100%"
              height="315"
              src={item.url}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )

        case 'web_video':
          return (
            <video
              key={index}
              controls
              width="100%"
              title={item.name || item.url}
            >
              <source src={item.url} type="video/mp4" />
            </video>
          )

        case 'file':
        case 'pdf':
          return item.url ? (
            <div className={style.fileContainer} title={item.name}>
              <div
                className={style.file}
                onClick={() => handleFileClick(item.url, item.type)}
              >
                <FontAwesomeIcon icon={getFileIcon(item.name)} />
                <p>{item.name || '未命名文件'}</p>
              </div>
            </div>
          ) : null
        case 'website':
          return (
            <div className={style.fileContainer} title={item.name || item.url}>
              <a
                className={style.file}
                href={item.url}
                target="_blank"
                rel="noreferrer"
              >
                <FontAwesomeIcon icon={faLink} />
                <p>{item.name || item.url}</p>
              </a>
            </div>
          )
        case 'image':
          return <img src={item.url} alt={item.name} />
        case 'audio':
          return <AudioPlayer src={item.url} name={item.name} />
        default:
          return null
      }
    })
  }

  if (!projectId) {
    return (
      <ProjectList
        isAdmin={isAdmin}
        projects={projects}
        setProjects={setProjects}
      />
    )
  }
  if (!currentProject) {
    // 如果正在尋找中，顯示 loading
    return <FontAwesomeIcon icon={faSpinner} />
  }
  if (!currentProject) {
    return (
      <div className={style.notFoundProject}>
        <FontAwesomeIcon icon={faCircleExclamation} />
        <h1>未找到項目</h1>
      </div>
    )
  }

  return (
    <div className={style.projectContainer}>
      <div className={style.projectContent}>
        <div className={style.mediaContainer}>{renderMedia()}</div>
        <div className={style.mediaInfo}>
          <div className={style.mediaInfoHeader}>
            <h2>{currentProject?.name}</h2>
            <p className={style.description}>{currentProject?.description}</p>
          </div>
          <div className={style.details}>
            <div className={style.detailsItem}>
              <p>Authors</p>
              <p>{currentProject?.authors?.join(', ') || '未署名作者'}</p>
            </div>
            <div className={style.detailsItem}>
              <p>Start Date</p>
              <p>{currentProject?.startDate || '--'}</p>
            </div>
            <div className={style.detailsItem}>
              <p>End Date</p>
              <p>{currentProject?.endDate || '--'}</p>
            </div>
            <div className={style.detailsItem}>
              <p>Tags</p>
              <p>{currentProject?.tags?.join(', ') || '--'}</p>
            </div>
            {currentProject?.customFields?.map((field, index) => (
              <div key={index} className={style.detailsItem}>
                <p>{field.key}</p>
                <p>{field.value || '--'}</p>
              </div>
            ))}
            <div className={style.detailsItem}>
              <p>Created At</p>
              <p>
                {currentProject?.createdAt?.toDate().toLocaleDateString() ||
                  '--'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProjectList({ isAdmin, projects, setProjects }) {
  const handleDelete = async (projectId) => {
    if (
      window.confirm(
        'Are you sure you want to delete this project? This action is irreversible.'
      )
    ) {
      try {
        // 删除 Firestore 中的项目文档
        await deleteDoc(doc(db, 'projects', projectId))

        // 删除 Storage 中的所有相关文件
        const storageRef = ref(storage, `projects/${projectId}`)
        const fileList = await listAll(storageRef)
        const deletePromises = fileList.items.map((fileRef) =>
          deleteObject(fileRef)
        )
        await Promise.all(deletePromises)

        // 更新本地状态
        setProjects(projects.filter((project) => project.id !== projectId))

        alert('Project deleted successfully')
      } catch (error) {
        console.error('Error deleting project:', error)
        alert('Error deleting project, please try again later')
      }
    }
  }

  return (
    <div className={style.projectList}>
      <div className={style.projectListContent}>
        <ul>
          {projects?.map((project) => {
            if (project.private && !isAdmin) {
              return null
            }
            return (
              <li key={project.id}>
                <Link to={`/project/${project.id}`}>
                  <h3>{project.name}</h3>
                  <p className={style.description}>{project.description}</p>
                  <p className={style.publishDate}>
                    {project.createdAt?.toDate().toLocaleDateString()}
                  </p>
                </Link>
                {isAdmin && (
                  <button
                    className={style.deleteButton}
                    onClick={() => handleDelete(project.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      </div>
      {isAdmin && (
        <Link to="/create-project" className={style.createProject}>
          <FontAwesomeIcon icon={faPlus} />
          Create New Project
        </Link>
      )}
    </div>
  )
}

const AudioPlayer = ({ src, name }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef(null)

  useEffect(() => {
    const audio = audioRef.current
    audio.addEventListener('loadedmetadata', () => setDuration(audio.duration))
    audio.addEventListener('timeupdate', () =>
      setCurrentTime(audio.currentTime)
    )
    return () => {
      audio.removeEventListener('loadedmetadata', () =>
        setDuration(audio.duration)
      )
      audio.removeEventListener('timeupdate', () =>
        setCurrentTime(audio.currentTime)
      )
    }
  }, [])

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e) => {
    const newTime = e.target.value
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  const skipTime = (seconds) => {
    const newTime = audioRef.current.currentTime + seconds
    audioRef.current.currentTime = Math.max(0, Math.min(newTime, duration))
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  return (
    <div className={style.audioPlayerContainer} title={name}>
      <p className={style.audioName}>
        <FontAwesomeIcon icon={faHeadphones} />
        {name}
      </p>
      <div className={style.audioPlayer}>
        <audio ref={audioRef} src={src} />
        <div className={style.controls}>
          <button onClick={() => skipTime(-5)} className={style.skipButton}>
            <FontAwesomeIcon icon={faArrowRotateLeft} />
          </button>
          <button onClick={togglePlay} className={style.playButton}>
            <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
          </button>
          <button onClick={() => skipTime(5)} className={style.skipButton}>
            <FontAwesomeIcon icon={faArrowRotateRight} />
          </button>
        </div>
        <div className={style.progressBar}>
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleSeek}
          />
          <div className={style.timeDisplay}>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
export default SchoolProject
