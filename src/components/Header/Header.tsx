import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
// import { useTranslation } from 'react-i18next'
import style from './Header.module.scss'

// import moment from 'moment'

import Menu from '../Menu/Menu'

import { animated, easings, useSpring } from '@react-spring/web'
import { Theme } from '../../utils/systemControls'
import { useSystem } from '../../context/SystemContext'

interface HeaderProps {
  title: string
  center: React.ReactNode
  right: React.ReactNode
  isMenuOpen: boolean
}

interface SubtitleProps {
  content?: string
  children?: React.ReactNode
}

// interface TimeDisplay {
//   days: number
//   hours: number
//   minutes: number
//   seconds: number
// }

function Header({
  title,
  center,
  right,
  isMenuOpen,
}: HeaderProps): JSX.Element {
  const [clickCount, setClickCount] = useState(0)
  const navigate = useNavigate()
  const { theme } = useSystem()

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

  // login page
  const handleHeaderClick = (e: React.MouseEvent): void => {
    e.stopPropagation()
    setClickCount((prevCount) => prevCount + 1)
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
      className={`${style.header} ${isMenuOpen ? style.menu_open : ''}`}
      style={_spring_header}
      onClick={handleHeaderClick}
    >
      <div className={style.container}>
        {title && (
          <div
            className={style.title}
            onClick={(e) => {
              e.stopPropagation()
              refresh()
            }}
          >
            <h1>{title}</h1>
          </div>
        )}
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
      <Menu isMenuOpen={isMenuOpen} />
    </animated.header>
  )
}

// function YearTransition() {
//   const [isHovered, setIsHovered] = useState(false)
//   const [showNextYear, setShowNextYear] = useState(false)
//   const [isTimeUp, setIsTimeUp] = useState(false)

//   useEffect(() => {
//     const handleTimeUp = () => {
//       setIsTimeUp(true)
//       setShowNextYear(true)
//     }

//     window.addEventListener('countdownComplete', handleTimeUp)
//     return () => window.removeEventListener('countdownComplete', handleTimeUp)
//   }, [])

//   useEffect(() => {
//     if (!isHovered) {
//       const timer = setInterval(
//         () => {
//           setShowNextYear((prev) => !prev)
//         },
//         showNextYear ? 7000 : 5000
//       )
//       return () => clearInterval(timer)
//     }
//   }, [showNextYear, isHovered])

//   const currentYearOpacity = useSpring({
//     opacity: 0,
//     config: { duration: 1000, delay: 1000 },
//   })
//   const { opacity } = useSpring({
//     opacity: 1,
//     config: { duration: 1000 },
//   })

//   return (
//     <div
//       className={style.yearContainer}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <animated.p className={style.currentYear} style={currentYearOpacity}>
//         2024
//       </animated.p>
//       <animated.p
//         className={style.year}
//         style={{
//           opacity,
//           position: 'absolute',
//           top: 0,
//         }}
//       >
//         2025
//       </animated.p>
//     </div>
//   )
// }

export default Header
