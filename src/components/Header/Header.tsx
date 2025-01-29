import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import style from './Header.module.scss'

import moment from 'moment'

import { animated, easings, useSpring } from '@react-spring/web'

interface HeaderProps {
  title: string
  center: React.ReactNode
  right: React.ReactNode
  setIsOpenSetting: (isOpen: boolean) => void
}

interface SubtitleProps {
  content?: string
  children?: React.ReactNode
}

interface TimeDisplay {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function Header({
  title,
  center,
  right,
  setIsOpenSetting,
}: HeaderProps): JSX.Element {
  const [clickCount, setClickCount] = useState(0)
  const navigate = useNavigate()
  const { t } = useTranslation()
  const refresh = (): void => {
    window.location.reload()
  }

  // animation
  const _spring_header = useSpring({
    from: { opacity: 0, transform: 'translateY(-100%)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    delay: 1000,
    config: { duration: 1000, easing: easings.easeOutCubic },
  })

  // 2025 reverse count
  const [countdown, setCountdown] = useState<TimeDisplay>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  useEffect(() => {
    const calculateTimeLeft = () => {
      const endDate = moment('2025-01-01 00:00:00')
      const now = moment()
      const diff = endDate.diff(now, 'seconds')

      return {
        days: Math.floor(diff / (60 * 60 * 24)),
        hours: Math.floor((diff % (60 * 60 * 24)) / (60 * 60)),
        minutes: Math.floor((diff % (60 * 60)) / 60),
        seconds: diff % 60,
      }
    }
    setCountdown(calculateTimeLeft())

    const timer = setInterval(() => {
      setCountdown(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // login page
  const handleHeaderClick = (e: React.MouseEvent): void => {
    e.stopPropagation()
    setClickCount((prevCount) => prevCount + 1)
    setIsOpenSetting(false)
  }
  useEffect(() => {
    if (clickCount === 10) {
      navigate('/user')
      setClickCount(0)
    }
    const timer = setTimeout(() => setClickCount(0), 1000)
    return () => clearTimeout(timer)
  }, [clickCount, navigate])

  return (
    <animated.header
      className={style.header}
      style={_spring_header}
      onClick={handleHeaderClick}
    >
      <div className={style.header_nav}>
        <div
          className={style.title}
          onClick={(e) => {
            e.stopPropagation()
            refresh()
          }}
        >
          {/* <YearTransition /> */}
          <h1>{title || ''}</h1>
        </div>
        <div
          className={style.center_navigation}
          onClick={(e) => e.stopPropagation()}
        >
          {center}
        </div>
        <div
          className={style.right_action}
          onClick={(e) => e.stopPropagation()}
        >
          {right}
        </div>
      </div>
      {/* <Subtitle>
        <p className={style.countdown}>
          {countdown.days <= 0
            ? ''
            : `${countdown.days}${
                t('locale', { ns: 'common' }) === 'zh-TW' ? ' ' : ''
              }${t('time.days', { ns: 'common' })}`}{' '}
          {countdown.hours <= 0
            ? ''
            : `${countdown.hours}${
                t('locale', { ns: 'common' }) === 'zh-TW' ? ' ' : ''
              }${t('time.hours', { ns: 'common' })}`}{' '}
          {countdown.minutes <= 0
            ? ''
            : `${countdown.minutes}${
                t('locale', { ns: 'common' }) === 'zh-TW' ? ' ' : ''
              }${t('time.minutes', { ns: 'common' })}`}{' '}
          {countdown.seconds <= 0
            ? ''
            : `${countdown.seconds}${
                t('locale', { ns: 'common' }) === 'zh-TW' ? ' ' : ''
              }${t('time.seconds', { ns: 'common' })}`}
        </p>
      </Subtitle> */}
    </animated.header>
  )
}

function YearTransition() {
  const [isHovered, setIsHovered] = useState(false)
  const [showNextYear, setShowNextYear] = useState(false)
  const [isTimeUp, setIsTimeUp] = useState(false)

  useEffect(() => {
    const handleTimeUp = () => {
      setIsTimeUp(true)
      setShowNextYear(true)
    }

    window.addEventListener('countdownComplete', handleTimeUp)
    return () => window.removeEventListener('countdownComplete', handleTimeUp)
  }, [])

  useEffect(() => {
    if (!isHovered) {
      const timer = setInterval(
        () => {
          setShowNextYear((prev) => !prev)
        },
        showNextYear ? 7000 : 5000
      )
      return () => clearInterval(timer)
    }
  }, [showNextYear, isHovered])

  const currentYearOpacity = useSpring({
    opacity: 0,
    config: { duration: 1000, delay: 1000 },
  })
  const { opacity } = useSpring({
    opacity: 1,
    config: { duration: 1000 },
  })

  return (
    <div
      className={style.yearContainer}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <animated.p className={style.currentYear} style={currentYearOpacity}>
        2024
      </animated.p>
      <animated.p
        className={style.year}
        style={{
          opacity,
          position: 'absolute',
          top: 0,
        }}
      >
        2025
      </animated.p>
    </div>
  )
}

function Subtitle({ content, children }: SubtitleProps) {
  return (
    <div className={style.subtitle}>
      {content && <p>{content}</p>}
      {children && children}
    </div>
  )
}

export default Header
