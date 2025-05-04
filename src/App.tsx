//* base
import { useState, useEffect, Suspense } from 'react'
import { Routes, Route, useLocation, Link } from 'react-router-dom'
import './App.scss'

//* utils
import Metadata from './utils/metadata'
import { Theme, ControlPanel, Language } from './utils/systemControls'

//* i18n
import './i18n/i18n'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'

//* context
import { SystemProvider, useSystem } from './context/SystemContext'

//* pages
import Home from './pages/Home/Home'
// import Posts from './pages/Posts/Posts'
import User from './pages/User/User'
import Portfolio from './pages/Portfolio/Portfolio'
// import CreateProject from './pages/CreateProject/CreateProject'
import Laboratory from './pages/Laboratory/Laboratory'
import ShortcutUrlGenerator from './pages/Laboratory/Projects/ShortcutUrlGenerator/ShortcutUrlGenerator'
import Schedules from './pages/Laboratory/Projects/Schedule/Schedules'
import ColorJudgeGame from './pages/Laboratory/Projects/ColorJudgeGame'
import TextCounter from './pages/Laboratory/Projects/TextCounter/TextCounter'
import ToneGenerator from './pages/Laboratory/Projects/ToneGenerator/ToneGenerator'

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

//* icons
import Icon, { IconName } from './components/Icon/Icon'
// import { IconProp } from '@fortawesome/fontawesome-svg-core'

//* Interface and types
// HeaderActions interface
interface HeaderActions {
  type: 'page' | 'button'
  path: string
  icon: IconName
  label: string
  pathMatch: boolean
  onClick: () => void
  floatLabel?: {
    display: boolean
    label: string
    size: Size
    position: Position
  }
}
// FloatLabel props
type Position = 'top' | 'bottom' | 'left' | 'right' | 'center'
type Size = 'normal' | 'small'

//* App Wrapper
function AppWrapper(): JSX.Element {
  return (
    <SystemProvider>
      <AppContent />
    </SystemProvider>
  )
}

//* App Content
function AppContent(): JSX.Element {
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const { isViewerOpen } = useSelector((state: RootState) => state.viewer)
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const { activePanel, closePanel } = useSystem()

  //* Header
  // pathname and title mapping
  const PATH_TITLE_MAP: Record<string, string> = {
    '/': '',
    '/blog': t('title', { ns: 'blog' }),
    '/portfolio': t('title', { ns: 'portfolio' }),
    '/lab/schedules': t('title', { ns: 'schedule' }),
    '/lab/shortcut': t('title', { ns: 'shortcutUrlGenerator' }),
    '/lab/color-judge': t('title', { ns: 'colorJudgeGame' }),
    '/lab/text-counter': t('title', { ns: 'textCounter' }),
    '/lab/tone-generator': t('tools.toneGenerator.title', { ns: 'laboratory' }),
    '/lab': t('title', { ns: 'laboratory' }),
  }
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
  // actions links
  const actionsLinks: HeaderActions[] = [
    {
      type: 'page' as const,
      path: '/',
      icon: 'house',
      label: t('home', { ns: 'header' }),
      pathMatch: pathname === '/',
      onClick: () => {
        setIsMenuOpen(false)
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
      type: 'page' as const,
      path: '/lab',
      icon: 'flask',
      label: t('title', { ns: 'laboratory' }),
      pathMatch: pathname.startsWith('/lab'),
      onClick: () => {
        setIsMenuOpen(false)
      },
      floatLabel: {
        display: true,
        label: t('title', { ns: 'laboratory' }),
        size: 'small' as Size,
        position: 'bottom' as Position,
      },
    },
    {
      type: 'button' as const,
      path: '/user',
      icon: 'bars',
      label: t('menu', { ns: 'header' }),
      pathMatch: isMenuOpen,
      onClick: () => {
        setIsMenuOpen(!isMenuOpen)
      },
      floatLabel: {
        display: true,
        label: t('menu', { ns: 'header' }),
        size: 'small' as Size,
        position: 'bottom' as Position,
      },
    },
  ]
  // get Header right
  const getHeaderRight = (): JSX.Element | null => {
    return <HeaderActions list={actionsLinks} />
  }

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
        isMenuOpen={isMenuOpen}
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
            <Route path="color-judge" element={<ColorJudgeGame />} />
            <Route path="text-counter" element={<TextCounter />} />
            <Route path="tone-generator" element={<ToneGenerator />} />
          </Route>
        </Routes>
      </Suspense>
      <Snow
        showControls={activePanel === 'snow'}
        onCloseControls={closePanel}
      />
      <Fireworks
        showControls={activePanel === 'fireworks'}
        onCloseControls={closePanel}
      />
      {isViewerOpen && <ImageViewer />}
    </div>
  )
}

/**
 * Header Pages Links
 * @param list - HeaderActions[]
 * @returns JSX.Element
 */
const HeaderActions = ({ list }: { list: HeaderActions[] }) => {
  return (
    <>
      {list.map((action) =>
        action.type === 'page' ? (
          <Link
            to={action.path}
            className={action.pathMatch ? 'active' : ''}
            onClick={action.onClick}
          >
            <Icon name={action.icon} />
            {action.floatLabel && (
              <FloatLabel
                label={action.floatLabel.label}
                size={action.floatLabel.size}
                position={action.floatLabel.position}
              ></FloatLabel>
            )}
          </Link>
        ) : action.type === 'button' ? (
          <button className="button" onClick={action.onClick}>
            <Icon name={action.icon} />
            {action.floatLabel && (
              <FloatLabel
                label={action.floatLabel.label}
                size={action.floatLabel.size}
                position={action.floatLabel.position}
              ></FloatLabel>
            )}
          </button>
        ) : null
      )}
    </>
  )
}

export default AppWrapper
