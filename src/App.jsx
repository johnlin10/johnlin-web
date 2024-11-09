import './i18n/i18n'
import { useTranslation } from 'react-i18next'
import React, { useState, useEffect } from 'react'
import { Routes, Route, useLocation, Link } from 'react-router-dom'
import './App.scss'

// pages
import Home from './pages/Home/Home'
import Posts from './pages/Posts/Posts'
import Project from './pages/Project/Project'
import User from './pages/User/User'
import CreateProject from './pages/CreateProject/CreateProject'
import ShortcutUrlGenerator from './pages/ShortcutUrlGenerator/ShortcutUrlGenerator'

// components
import Header from './components/Header/Header'
import FloatLabel from './components/FloatLabel/FloatLabel'
import ImageViewer from './components/ImageViewer/ImageViewer'
// import ProtectedRoute from './utils/ProtectedRoute'

// fontawesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHouse,
  faLayerGroup,
  faLanguage,
  faCircleHalfStroke,
  faGear,
} from '@fortawesome/free-solid-svg-icons'

function App() {
  const { t, i18n } = useTranslation()
  const { pathname } = useLocation()
  const [isOpenSetting, setIsOpenSetting] = useState(false)

  //* Language
  const toggleLanguage = () => {
    const currentLang = i18n.language
    const newLang = currentLang === 'zh-TW' ? 'en-US' : 'zh-TW'
    i18n.changeLanguage(newLang)
  }

  //* Theme
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light'
  })
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)

    // update meta theme-color
    const metaThemeColor = document.querySelector("meta[name='theme-color']")
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        theme === 'light' ? '#ffffff' : '#131313'
      )
    }
  }, [theme])
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  //* Header
  const getHeaderTitle = () => {
    if (pathname === '/') return t('header.title')
    if (pathname === '/posts') return t('header.posts')
    if (pathname.startsWith('/project')) return t('header.project')
    return t('header.title')
  }
  const getHeaderCenter = () => {
    return null
  }
  const getHeaderRight = () => {
    if (true) {
      return (
        <>
          <Link
            to="/"
            className={pathname === '/' ? 'active' : ''}
            onClick={() => {
              setIsOpenSetting(false)
            }}
          >
            <FontAwesomeIcon icon={faHouse} />
            <FloatLabel
              label={t('header.home')}
              size="small"
              position="bottom"
            ></FloatLabel>
          </Link>
          <Link
            to="/project"
            className={pathname.startsWith('/project') ? 'active' : ''}
            onClick={() => {
              setIsOpenSetting(false)
            }}
          >
            <FontAwesomeIcon icon={faLayerGroup} />
            <FloatLabel
              label={t('header.project')}
              size="small"
              position="bottom"
            ></FloatLabel>
          </Link>

          <div className={`actions-container ${isOpenSetting ? 'active' : ''}`}>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsOpenSetting(!isOpenSetting)
              }}
            >
              <FontAwesomeIcon
                icon={faGear}
                rotation={isOpenSetting ? 90 : 0}
              />
              <FloatLabel
                label={t('header.setting')}
                size="small"
                position={isOpenSetting ? 'left' : 'bottom'}
                align={isOpenSetting ? 'top' : 'right'}
              ></FloatLabel>
            </button>
            <div className={`actions ${isOpenSetting ? 'active' : ''}`}>
              <button onClick={toggleTheme}>
                <FontAwesomeIcon icon={faCircleHalfStroke} />
                <FloatLabel
                  label={`${t('settings.theme.title')} - ${
                    theme === 'light'
                      ? t('settings.theme.light')
                      : t('settings.theme.dark')
                  }`}
                  position="left"
                ></FloatLabel>
              </button>
              <button onClick={toggleLanguage}>
                <FontAwesomeIcon icon={faLanguage} />
                <FloatLabel
                  label={`${t('settings.language.title')} - ${
                    i18n.language === 'zh-TW'
                      ? t('settings.language.zh-TW')
                      : t('settings.language.en-US')
                  }`}
                  position="left"
                ></FloatLabel>
              </button>
            </div>
          </div>
        </>
      )
    }
  }
  useEffect(() => {
    const handleClickOutside = (event) => {
      const container = document.querySelector('.actions-container')
      if (container && !container.contains(event.target) && isOpenSetting) {
        setIsOpenSetting(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpenSetting])

  return (
    <div className="App">
      <Header
        title={getHeaderTitle()}
        center={getHeaderCenter()}
        right={getHeaderRight()}
        setIsOpenSetting={setIsOpenSetting}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user" element={<User />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/project" element={<Project />} />
        <Route path="/project/:projectId" element={<Project />} />
        <Route path="/create-project" element={<CreateProject />} />
        <Route path="/shortcut" element={<ShortcutUrlGenerator />} />
      </Routes>
      <ImageViewer />
    </div>
  )
}

export default App
