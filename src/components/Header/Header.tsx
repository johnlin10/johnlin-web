import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import style from './Header.module.scss'

import { animated, easings, useSpring } from '@react-spring/web'

interface HeaderProps {
  title: string
  center: React.ReactNode
  right: React.ReactNode
  setIsOpenSetting: (isOpen: boolean) => void
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
      <div
        className={style.title}
        onClick={(e) => {
          e.stopPropagation()
          refresh()
        }}
      >
        <YearTransition />
        <h1>{title || t('header.title')}</h1>
      </div>
      <div
        className={style.center_navigation}
        onClick={(e) => e.stopPropagation()}
      >
        {center}
      </div>
      <div className={style.right_action} onClick={(e) => e.stopPropagation()}>
        {right}
      </div>
    </animated.header>
  )
}

function YearTransition() {
  const [isHovered, setIsHovered] = useState(false)
  const [showNextYear, setShowNextYear] = useState(false)

  useEffect(() => {
    if (!isHovered) {
      const timer = setInterval(
        () => {
          setShowNextYear((prev) => !prev)
        },
        showNextYear ? 5000 : 5000
      )
      return () => clearInterval(timer)
    }
  }, [showNextYear, isHovered])

  const currentYearOpacity = useSpring({
    opacity: isHovered || showNextYear ? 0 : 1,
    config: { duration: 500, delay: 500 },
  })
  const { opacity } = useSpring({
    opacity: isHovered || showNextYear ? 1 : 0,
    config: { duration: 500 },
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

export default Header
