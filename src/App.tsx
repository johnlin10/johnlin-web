import './i18n/i18n'
import { useTranslation } from 'react-i18next'
import React, { useState, useEffect, Suspense } from 'react'
import { Routes, Route, useLocation, Link } from 'react-router-dom'
import './App.scss'
import { Helmet } from 'react-helmet-async'

// pages
import Home from './pages/Home/Home'
// import Posts from './pages/Posts/Posts'
// import Project from './pages/Project/Project'
import User from './pages/User/User'
import CreateProject from './pages/CreateProject/CreateProject'
// import ShortcutUrlGenerator from './pages/ShortcutUrlGenerator/ShortcutUrlGenerator'

// redux
import { RootState } from './redux/store'
import { useSelector } from 'react-redux'

// components
import Header from './components/Header/Header'
import FloatLabel from './components/FloatLabel/FloatLabel'
import ImageViewer from './components/ImageViewer/ImageViewer'
import NewYearCountdown from './components/NewYearCountdown/NewYearCountdown'
// import CreatePost from './pages/Posts/ui/CreatePost/CreatePost'
// import DisplayWithEditor from './pages/Posts/components/DisplayWithEditor/DisplayWithEditor'

//
import Snow from './components/Snow/Snow'
import Fireworks from './components/2025NewYearFireworks/Fireworks'
// import ProtectedRoute from './utils/ProtectedRoute'

// fontawesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Transform, type IconProp } from '@fortawesome/fontawesome-svg-core'
import {
  faHouse,
  faLayerGroup,
  faLanguage,
  faCircleHalfStroke,
  faGear,
  faBook,
  faSnowflake,
  faFire,
} from '@fortawesome/free-solid-svg-icons'

// theme
type Theme = 'light' | 'dark'

const Project = React.lazy(() => import('./pages/Project/Project'))

function App(): JSX.Element {
  const { t, i18n } = useTranslation()
  const { isViewerOpen } = useSelector((state: RootState) => state.viewer)
  const { pathname } = useLocation()
  const [isOpenSetting, setIsOpenSetting] = useState<boolean>(false)

  type ControlPanel = 'snow' | 'fireworks' | null
  const [activePanel, setActivePanel] = useState<ControlPanel>(null)

  const handleControlPanel = (panel: ControlPanel): void => {
    setActivePanel(activePanel === panel ? null : panel)
  }

  //* Icon
  const SETTING_ICON_TRANSFORM: Record<
    'open' | 'closed',
    { transform: Transform }
  > = {
    open: { transform: { rotate: 90 } },
    closed: { transform: { rotate: 0 } },
  } as const
  const icons: Record<string, IconProp> = {
    home: faHouse,
    project: faLayerGroup,
    language: faLanguage,
    theme: faCircleHalfStroke,
    settings: faGear,
    book: faBook,
  } as const

  //* Language
  const toggleLanguage = (): void => {
    const currentLang = i18n.language
    const newLang = currentLang === 'zh-TW' ? 'en-US' : 'zh-TW'
    i18n.changeLanguage(newLang)
  }

  //* Theme
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'dark'
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
  const toggleTheme = (): void => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  //* Header
  const getHeaderTitle = (): string => {
    if (pathname === '/') return ''
    if (pathname.startsWith('/posts')) return t('header.posts')
    if (pathname.startsWith('/project')) return t('header.project')
    return ''
  }
  const getHeaderCenter = (): null => {
    return null
  }
  const getHeaderRight = (): JSX.Element | null => {
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
            <FontAwesomeIcon icon={icons.home} />
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
            <FontAwesomeIcon icon={icons.project} />
            <FloatLabel
              label={t('header.project')}
              size="small"
              position="bottom"
            ></FloatLabel>
          </Link>
          {/* <Link
            to="/posts"
            className={pathname.startsWith('/posts') ? 'active' : ''}
            onClick={() => {
              setIsOpenSetting(false)
            }}
          >
            <FontAwesomeIcon icon={icons.book} />
            <FloatLabel
              label={t('header.posts')}
              size="small"
              position="bottom"
            ></FloatLabel>
          </Link> */}

          <div className={`actions-container ${isOpenSetting ? 'active' : ''}`}>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsOpenSetting(!isOpenSetting)
              }}
            >
              <FontAwesomeIcon
                icon={icons.settings}
                {...SETTING_ICON_TRANSFORM[isOpenSetting ? 'open' : 'closed']}
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
                <FontAwesomeIcon icon={icons.theme} />
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
                <FontAwesomeIcon icon={icons.language} />
                <FloatLabel
                  label={`${t('settings.language.title')} - ${
                    i18n.language === 'zh-TW'
                      ? t('settings.language.zh-TW')
                      : t('settings.language.en-US')
                  }`}
                  position="left"
                ></FloatLabel>
              </button>
              <hr />
              <button onClick={() => handleControlPanel('snow')}>
                <FontAwesomeIcon icon={faSnowflake} />
                <FloatLabel
                  label={t('settings.snow.title')}
                  position="left"
                ></FloatLabel>
              </button>
              <button onClick={() => handleControlPanel('fireworks')}>
                <FontAwesomeIcon icon={faFire} />
                <FloatLabel
                  label={t('settings.fireworks.title')}
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
    const handleClickOutside = (event: MouseEvent): void => {
      const container = document.querySelector('.actions-container')
      if (
        container &&
        !container.contains(event.target as Node) &&
        isOpenSetting
      ) {
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
      <Helmet>
        <title>{t('header.title')}</title>
      </Helmet>

      <NewYearCountdown />
      <Snow
        showControls={activePanel === 'snow'}
        onCloseControls={() => setActivePanel(null)}
      />
      <Fireworks
        showControls={activePanel === 'fireworks'}
        onCloseControls={() => setActivePanel(null)}
      />

      <Header
        title={getHeaderTitle()}
        center={getHeaderCenter()}
        right={getHeaderRight()}
        setIsOpenSetting={setIsOpenSetting}
      />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user" element={<User />} />
          {/* <Route path="/posts" element={<Posts />} />
        <Route path="/posts/:postId" element={<Posts />} />
        <Route path="/posts/test" element={<DisplayWithEditor />} />
        <Route path="/posts/create" element={<CreatePost />} /> */}
          <Route path="/project" element={<Project />} />
          <Route path="/project/:projectId" element={<Project />} />
          <Route path="/create-project" element={<CreateProject />} />
          {/* <Route path="/shortcut" element={<ShortcutUrlGenerator />} /> */}
        </Routes>
      </Suspense>
      {isViewerOpen && <ImageViewer />}
    </div>
  )
}

export default App
