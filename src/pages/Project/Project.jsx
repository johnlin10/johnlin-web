import React, { useEffect, useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { openViewer } from '../../redux/viewerSlice'
import { useTranslation } from 'react-i18next'
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
  faPenToSquare,
  faLink,
  faSpinner,
  faArrowRotateRight,
  faArrowRotateLeft,
  faTrash,
  faLock,
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

import { isYouTubeUrl, getYouTubeEmbedUrl } from '../../utils/helpers'

function Project() {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { projectId } = useParams()
  const { isAdmin } = useAuth()
  const [projects, setProjects] = useState([])
  const [currentProject, setCurrentProject] = useState(null)
  const [hasVideo, setHasVideo] = useState(false)

  // fetch projects from firestore
  useEffect(() => {
    // fetch projects once
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

    // set projects realtime listener
    const projectsCollection = collection(db, 'projects')
    const unsubscribe = onSnapshot(projectsCollection, (snapshot) => {
      const updatedProjects = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setProjects(updatedProjects)
    })
    return () => unsubscribe()
  }, [])

  // if have projectId, set currentProject
  useEffect(() => {
    const project = projects.find((p) => p.id === projectId)
    setCurrentProject(project)

    // fix: set hasVideo to true when youtube video is found
    const hasWebVideo = project?.files.some((file) => file.type === 'web_video')
    const hasYouTubeVideo = project?.files.some((file) =>
      isYouTubeUrl(file.url)
    )

    setHasVideo(hasWebVideo || hasYouTubeVideo)
  }, [projectId, projects])

  // handle pdf click
  const handleFileClick = (url) => {
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
              style={{ border: 'none' }}
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
                <p>{item.name || 'Untitled File'}</p>
              </div>
            </div>
          ) : null
        case 'website':
          if (isYouTubeUrl(item.url)) {
            return (
              <iframe
                key={item.id}
                src={getYouTubeEmbedUrl(item.url)}
                title="YouTube video player"
                style={{ border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )
          }
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
          return (
            <div
              key={index}
              className={style.img}
              onClick={() =>
                dispatch(
                  openViewer({
                    src: item.url,
                    fileName: item.name,
                  })
                )
              }
            >
              <img src={item.url} alt={item.name} />
            </div>
          )
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
    return <FontAwesomeIcon icon={faSpinner} />
  }
  if (!currentProject) {
    return (
      <div className={style.notFoundProject}>
        <FontAwesomeIcon icon={faCircleExclamation} />
        <h1>{t('project.projectNotFound')}</h1>
      </div>
    )
  }

  return (
    <div className={style.projectContainer}>
      <div
        className={`${style.projectContent} ${hasVideo ? style.hasVideo : ''}`}
      >
        <div className={style.mediaContainer}>{renderMedia()}</div>
        <div className={style.mediaInfo}>
          <div className={style.mediaInfoHeader}>
            <h3>{currentProject?.name}</h3>
            <p className={style.description}>{currentProject?.description}</p>
          </div>
          <div className={style.details}>
            <div className={style.detailsItem}>
              <p>{t('project.detail.author')}</p>
              <p>
                {currentProject?.authors?.join(', ') ||
                  t('project.detail.anonymous')}
              </p>
            </div>
            <div className={style.detailsItem}>
              <p>{t('project.detail.startDate')}</p>
              <p>{currentProject?.startDate || '--'}</p>
            </div>
            <div className={style.detailsItem}>
              <p>{t('project.detail.endDate')}</p>
              <p>{currentProject?.endDate || '--'}</p>
            </div>
            <div className={style.detailsItem}>
              <p>{t('project.detail.tags')}</p>
              <p>{currentProject?.tags?.join(', ') || '--'}</p>
            </div>
            {currentProject?.customFields?.map((field, index) => (
              <div key={index} className={style.detailsItem}>
                <p>{t(`project.detail.${field.key}`)}</p>
                <p>{field.value || '--'}</p>
              </div>
            ))}
            <div className={style.detailsItem}>
              <p>{t('project.detail.createdAt')}</p>
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
        // delete project document in firestore
        await deleteDoc(doc(db, 'projects', projectId))

        // delete all related files in storage
        const storageRef = ref(storage, `projects/${projectId}`)
        const fileList = await listAll(storageRef)
        const deletePromises = fileList.items.map((fileRef) =>
          deleteObject(fileRef)
        )
        await Promise.all(deletePromises)

        // update local state
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
          {projects
            ?.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate())
            .map((project) => {
              if (project.private && !isAdmin) {
                return null
              }
              return (
                <li
                  key={project.id}
                  className={project.private ? style.private : ''}
                >
                  <Link to={`/project/${project.id}`}>
                    <h3>
                      {project.private ? <FontAwesomeIcon icon={faLock} /> : ''}
                      {project.name}
                    </h3>
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
          <FontAwesomeIcon icon={faPenToSquare} />
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

  // set audio duration and current time
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
export default Project
