import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import style from './ContentBlock.module.scss'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { openViewer } from '../../../../redux/viewerSlice'

import MediaThemeSutro from 'player.style/sutro/react'
import AudioPlayer from '../AudioPlayer/AudioPlayer'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFilePdf,
  faFileZipper,
  faFilePowerpoint,
  faFileWord,
  faFileExcel,
  faCode,
  faFile,
  faImage,
  faHeadphones,
  faLink,
} from '@fortawesome/free-solid-svg-icons'
import { faPython, faSquareJs } from '@fortawesome/free-brands-svg-icons'

import { isYouTubeUrl, getYouTubeEmbedUrl } from '../../../../utils/helpers'

import { useSpring, animated } from '@react-spring/web'

function ContentBlock({ projectId, currentProject }) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [hasVideo, setHasVideo] = useState(false)
  // animation
  const _spring_project_container = useSpring({
    from: { opacity: 0, transform: 'scale(0.9)' },
    to: { opacity: 1, transform: 'scale(1)' },
  })

  // if have projectId, set currentProject
  useEffect(() => {
    const hasWebVideo = currentProject?.files.some(
      (file) => file.type === 'web_video'
    )
    const hasYouTubeVideo = currentProject?.files.some((file) =>
      isYouTubeUrl(file.url)
    )

    setHasVideo(hasWebVideo || hasYouTubeVideo)
  }, [currentProject])

  return (
    <animated.div
      key={`project-${projectId}`}
      className={style.projectContainer}
      style={_spring_project_container}
    >
      <Helmet>
        <title>
          {currentProject?.name || t('header.project')} | {t('header.project')}
        </title>
      </Helmet>
      <div
        className={`${style.projectContent} ${hasVideo ? style.hasVideo : ''}`}
      >
        <div className={style.mediaContainer}>
          {renderMedia(currentProject, dispatch)}
        </div>
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
    </animated.div>
  )
}

const renderMedia = (currentProject, dispatch) => {
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
          <div className={style.video}>
            <MediaThemeSutro
              style={{
                '--media-primary-color': '#c2c2c2',
                '--media-secondary-color': '#474747',
                '--media-accent-color': '#ffffff',
                borderRadius: 'var(--border-radius-m)',
                overflow: 'hidden',
              }}
            >
              <video
                key={index}
                slot="media"
                src={item.url}
                playsInline
                crossOrigin
              />
            </MediaThemeSutro>
          </div>
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

export default ContentBlock
