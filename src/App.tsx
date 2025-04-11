//* base
import { useState, useEffect, Suspense } from 'react'
import { Routes, Route, useLocation, Link } from 'react-router-dom'
import './App.scss'

//* utils
import Metadata from './utils/metadata'

//* i18n
import './i18n/i18n'
import { useTranslation } from 'react-i18next'

//* pages
import Home from './pages/Home/Home'
// import Posts from './pages/Posts/Posts'
import User from './pages/User/User'
import Portfolio from './pages/Portfolio/Portfolio'
// import CreateProject from './pages/CreateProject/CreateProject'
import Laboratory from './pages/Laboratory/Laboratory'
import ShortcutUrlGenerator from './pages/Laboratory/Projects/ShortcutUrlGenerator/ShortcutUrlGenerator'
import Schedules from './pages/Laboratory/Projects/Schedule/Schedules'

//* redux
import { RootState } from './redux/store'
import { useSelector } from 'react-redux'

//* components
import Header from './components/Header/Header'
import FloatLabel from './components/FloatLabel/FloatLabel'
import ImageViewer from './components/ImageViewer/ImageViewer'
// import NewYearCountdown from './components/NewYearCountdown/NewYearCountdown'
// import CreatePost from './pages/Posts/ui/CreatePost/CreatePost'
// import DisplayWithEditor from './pages/Posts/components/DisplayWithEditor/DisplayWithEditor'

//* controls
import Snow from './components/Snow/Snow'
import Fireworks from './components/2025NewYearFireworks/Fireworks'
// import ProtectedRoute from './utils/ProtectedRoute'

//* fontawesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Transform, type IconProp } from '@fortawesome/fontawesome-svg-core'
import {
  faHouse,
  faLayerGroup,
  faLanguage,
  faCircleHalfStroke,
  faGear,
  faBook,
  faFlask,
  faSnowflake,
  faFire,
  faSun,
  faMoon,
} from '@fortawesome/free-solid-svg-icons'
import { TFunction } from 'i18next'

//* theme
type Theme = 'light' | 'dark' | 'auto'

//* Interface and types
// HeaderLinks interface
interface HeaderLinks {
  path: string
  icon: IconProp
  label: string
  pathMatch: boolean
  onClick: () => void
  floatLabel: {
    display: boolean
    label: string
    size: Size
    position: Position
  }
}
// FloatLabel props
type Position = 'top' | 'bottom' | 'left' | 'right' | 'center'
type Size = 'normal' | 'small'
// Control Panel
type ControlPanel = 'snow' | 'fireworks' | null

//* Setting icon transform
const SETTING_ICON_TRANSFORM: Record<
  'open' | 'closed',
  { transform: Transform }
> = {
  open: { transform: { rotate: 90 } },
  closed: { transform: { rotate: 0 } },
} as const

//* Icon transform
const icons: Record<string, IconProp> = {
  home: faHouse,
  project: faLayerGroup,
  language: faLanguage,
  theme: faCircleHalfStroke,
  settings: faGear,
  book: faBook,
} as const

//* App
function App(): JSX.Element {
  const { pathname } = useLocation()
  const { i18n } = useTranslation()
  const { t } = useTranslation()
  const { isViewerOpen } = useSelector((state: RootState) => state.viewer)
  const [isOpenSetting, setIsOpenSetting] = useState<boolean>(false)

  //* Control Panel
  const [activePanel, setActivePanel] = useState<ControlPanel>(null)
  // Handle control panel
  const handleControlPanel = (panel: ControlPanel): void => {
    setActivePanel(activePanel === panel ? null : panel)
  }

  //* Language
  const toggleLanguage = (): void => {
    const currentLang = i18n.language
    const newLang = currentLang === 'zh-TW' ? 'en-US' : 'zh-TW'
    i18n.changeLanguage(newLang)
  }

  //* Theme
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'auto'
  })
  // get system theme
  const getSystemTheme = (): 'light' | 'dark' => {
    return window.matchMedia('(prefers-color-scheme: light)').matches
      ? 'light'
      : 'dark'
  }
  // listen system theme change
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (): void => {
      if (theme === 'auto') {
        document.documentElement.setAttribute('data-theme', getSystemTheme())
        updateMetaThemeColor(getSystemTheme())
      }
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])
  // update meta theme color
  const updateMetaThemeColor = (currentTheme: 'light' | 'dark'): void => {
    const metaThemeColor = document.querySelector("meta[name='theme-color']")
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        currentTheme === 'light' ? '#ffffff' : '#131313'
      )
    }
  }
  // update theme
  useEffect(() => {
    const actualTheme = theme === 'auto' ? getSystemTheme() : theme
    document.documentElement.setAttribute('data-theme', actualTheme)
    localStorage.setItem('theme', theme)
    updateMetaThemeColor(actualTheme)
  }, [theme])
  // toggle theme
  const toggleTheme = (): void => {
    setTheme((prevTheme) => {
      switch (prevTheme) {
        case 'light':
          return 'dark'
        case 'dark':
          return 'auto'
        case 'auto':
          return 'light'
        default:
          return 'light'
      }
    })
  }
  // get display theme
  const getDisplayTheme = (): 'light' | 'dark' => {
    return theme === 'auto' ? getSystemTheme() : theme
  }
  // get theme text
  const getThemeText = (): string => {
    if (theme === 'auto') {
      return `${t('theme.auto', { ns: 'settings' })} (${t(
        `theme.${getDisplayTheme()}`,
        {
          ns: 'settings',
        }
      )})`
    }
    return theme === 'light'
      ? t('theme.light', { ns: 'settings' })
      : t('theme.dark', { ns: 'settings' })
  }
  // get theme icon
  const getThemeIcon = (): IconProp => {
    switch (theme) {
      case 'light':
        return faSun
      case 'dark':
        return faMoon
      case 'auto':
        return faCircleHalfStroke // 或使用 faCircleHalfStroke
      default:
        return faCircleHalfStroke
    }
  }

  //* Header
  // pathname and title mapping
  const PATH_TITLE_MAP: Record<string, string> = {
    '/': '',
    '/blog': t('title', { ns: 'blog' }),
    '/portfolio': t('title', { ns: 'portfolio' }),
    '/lab/schedules': t('title', { ns: 'schedule' }),
    '/lab/shortcut': t('title', { ns: 'shortcutUrlGenerator' }),
    '/lab': t('title', { ns: 'laboratory' }),
  }
  // Page links
  const pageLinks = [
    {
      path: '/',
      icon: icons.home,
      label: t('home', { ns: 'header' }),
      pathMatch: pathname === '/',
      onClick: () => {
        setIsOpenSetting(false)
      },
      floatLabel: {
        display: true,
        label: t('home', { ns: 'header' }),
        size: 'small' as Size,
        position: 'bottom' as Position,
      },
    },
    // {
    //   path: '/portfolio',
    //   icon: icons.project,
    //   label: t('portfolio', { ns: 'header' }),
    //   pathMatch: pathname.startsWith('/portfolio'),
    //   onClick: () => {
    //     setIsOpenSetting(false)
    //   },
    //   floatLabel: {
    //     display: true,
    //     label: t('portfolio', { ns: 'header' }),
    //     size: 'small' as Size,
    //     position: 'bottom' as Position,
    //   },
    // },
    {
      path: '/lab',
      icon: faFlask,
      label: t('title', { ns: 'laboratory' }),
      pathMatch: pathname.startsWith('/lab'),
      onClick: () => {
        setIsOpenSetting(false)
      },
      floatLabel: {
        display: true,
        label: t('title', { ns: 'laboratory' }),
        size: 'small' as Size,
        position: 'bottom' as Position,
      },
    },
  ]
  // get Header title
  const getHeaderTitle = (): string => {
    // find matched path prefix
    const matchedPath = Object.keys(PATH_TITLE_MAP).find((path) =>
      path === '/' ? pathname === '/' : pathname.startsWith(path)
    )

    return matchedPath ? PATH_TITLE_MAP[matchedPath] : ''
  }
  // get Header center
  const getHeaderCenter = (): null => {
    return null
  }
  // get Header right
  const getHeaderRight = (): JSX.Element | null => {
    return (
      <>
        <HeaderPagesLinks list={pageLinks} />
        <HeaderSetting
          t={t}
          currentLanguage={i18n.language}
          settingState={isOpenSetting}
          toggleSetting={toggleSetting}
          toggleTheme={toggleTheme}
          toggleLanguage={toggleLanguage}
          getThemeIcon={getThemeIcon}
          getThemeText={getThemeText}
          handleControlPanel={handleControlPanel}
        />
      </>
    )
  }

  /**
   ** Toggle setting
   * @param command - boolean
   */
  const toggleSetting = (command?: boolean): void => {
    if (command) {
      setIsOpenSetting(command)
    } else {
      setIsOpenSetting(!isOpenSetting)
    }
  }

  //* Close setting when click outside
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
      <Metadata
        title={t('website.title', { ns: 'common' })}
        description={t('website.description', { ns: 'common' })}
      />
      <Header
        title={getHeaderTitle()}
        center={getHeaderCenter()}
        right={getHeaderRight()}
        toggleSetting={toggleSetting}
      />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user" element={<User />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/portfolio/:portfolioId" element={<Portfolio />}></Route>
          <Route path="/lab" element={<Laboratory />}>
            <Route path="shortcut" element={<ShortcutUrlGenerator />} />
            <Route path="schedules" element={<Schedules />} />
          </Route>
        </Routes>
      </Suspense>
      <Snow
        showControls={activePanel === 'snow'}
        onCloseControls={() => setActivePanel(null)}
      />
      <Fireworks
        showControls={activePanel === 'fireworks'}
        onCloseControls={() => setActivePanel(null)}
      />
      {isViewerOpen && <ImageViewer />}
    </div>
  )
}

/**
 * Header Pages Links
 * @param list - HeaderLinks[]
 * @returns JSX.Element
 */
const HeaderPagesLinks = ({ list }: { list: HeaderLinks[] }) => {
  return (
    <>
      {list.map((pageLink) => (
        <Link
          to={pageLink.path}
          className={pageLink.pathMatch ? 'active' : ''}
          onClick={pageLink.onClick}
        >
          <FontAwesomeIcon icon={pageLink.icon} />
          <FloatLabel
            label={pageLink.floatLabel.label}
            size={pageLink.floatLabel.size}
            position={pageLink.floatLabel.position}
          ></FloatLabel>
        </Link>
      ))}
      {/* <Link
        to="/"
        className={pathname === '/' ? 'active' : ''}
        onClick={() => {
          setIsOpenSetting(false)
        }}
      >
        <FontAwesomeIcon icon={icons.home} />
        <FloatLabel
          label={t('home', { ns: 'header' })}
          size="small"
          position="bottom"
        ></FloatLabel>
      </Link>
      <Link
        to="/portfolio"
        className={pathname.startsWith('/portfolio') ? 'active' : ''}
        onClick={() => {
          setIsOpenSetting(false)
        }}
      >
        <FontAwesomeIcon icon={icons.project} />
        <FloatLabel
          label={t('portfolio', { ns: 'header' })}
          size="small"
          position="bottom"
        ></FloatLabel>
      </Link>
      <Link
        to="/lab"
        className={pathname.startsWith('/lab') ? 'active' : ''}
        onClick={() => {
          setIsOpenSetting(false)
        }}
      >
        <FontAwesomeIcon icon={faFlask} />
        <FloatLabel
          label={t('title', { ns: 'laboratory' })}
          size="small"
          position="bottom"
        ></FloatLabel>
      </Link> */}
    </>
  )
}

/**
 * Header Setting
 * @param t - TFunction
 * @param currentLanguage - string
 * @param settingState - boolean
 * @param toggleSetting - () => void
 * @param toggleTheme - () => void
 * @param toggleLanguage - () => void
 * @param getThemeIcon - () => IconProp
 * @param getThemeText - () => string
 * @param handleControlPanel - (panel: ControlPanel) => void
 */
const HeaderSetting = ({
  t,
  currentLanguage,
  settingState,
  toggleSetting,
  toggleTheme,
  toggleLanguage,
  getThemeIcon,
  getThemeText,
  handleControlPanel,
}: {
  t: TFunction
  currentLanguage: string
  settingState: boolean
  toggleSetting: () => void
  toggleTheme: () => void
  toggleLanguage: () => void
  getThemeIcon: () => IconProp
  getThemeText: () => string
  handleControlPanel: (panel: ControlPanel) => void
}) => {
  return (
    <div className={`actions-container ${settingState ? 'active' : ''}`}>
      <button
        onClick={(e) => {
          e.stopPropagation()
          toggleSetting()
        }}
      >
        <FontAwesomeIcon
          icon={icons.settings}
          {...SETTING_ICON_TRANSFORM[settingState ? 'open' : 'closed']}
        />
        <FloatLabel
          label={t('setting', { ns: 'header' })}
          size="small"
          position={settingState ? 'left' : 'bottom'}
          align={settingState ? 'top' : 'right'}
        ></FloatLabel>
      </button>

      <div className={`actions ${settingState ? 'active' : ''}`}>
        <button onClick={toggleTheme}>
          <FontAwesomeIcon icon={getThemeIcon()} />
          <FloatLabel
            label={`${t('theme.title', {
              ns: 'settings',
            })} - ${getThemeText()}`}
            position="left"
          ></FloatLabel>
        </button>
        <button onClick={toggleLanguage}>
          <FontAwesomeIcon icon={icons.language} />
          <FloatLabel
            label={`${t('language.title', { ns: 'settings' })} - ${
              currentLanguage === 'zh-TW'
                ? t('language.zh-TW', { ns: 'settings' })
                : t('language.en-US', { ns: 'settings' })
            }`}
            position="left"
          ></FloatLabel>
        </button>
        {/* <hr />
        <button onClick={() => handleControlPanel('snow')}>
          <FontAwesomeIcon icon={faSnowflake} />
          <FloatLabel
            label={t('snow.title', { ns: 'settings' })}
            position="left"
          ></FloatLabel>
        </button>
        <button onClick={() => handleControlPanel('fireworks')}>
          <FontAwesomeIcon icon={faFire} />
          <FloatLabel
            label={t('fireworks.title', { ns: 'settings' })}
            position="left"
          ></FloatLabel>
        </button> */}
      </div>
    </div>
  )
}

export default App
