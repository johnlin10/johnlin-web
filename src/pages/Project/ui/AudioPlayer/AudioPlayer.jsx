import style from './AudioPlayer.module.scss'
import { useState, useEffect, useRef } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHeadphones,
  faPlay,
  faPause,
  faArrowRotateLeft,
  faArrowRotateRight,
} from '@fortawesome/free-solid-svg-icons'

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

export default AudioPlayer
