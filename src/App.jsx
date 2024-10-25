import React, { useState, useEffect } from 'react'
import { Routes, Route, useLocation, Link } from 'react-router-dom'
import './App.scss'

// pages
import Home from './pages/Home/Home'
import Posts from './pages/Posts/Posts'
import SchoolProject from './pages/Project/Project'
import User from './pages/User/User'
import CreateProject from './pages/CreateProject/CreateProject'
import ShortcutUrlGenerator from './pages/ShortcutUrlGenerator/ShortcutUrlGenerator'

// components
import Header from './components/Header/Header'
// import ProtectedRoute from './utils/ProtectedRoute'

// fontawesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHouse,
  faFolder,
  faArrowLeft,
  faCircleHalfStroke,
} from '@fortawesome/free-solid-svg-icons'

function App() {
  const { pathname } = useLocation()

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
    if (pathname === '/') return 'John Lin'
    if (pathname === '/posts') return 'Posts'
    if (pathname.startsWith('/project')) return 'Project'
    return 'John Lin'
  }
  const getHeaderCenter = () => {
    return null
  }
  const getHeaderRight = () => {
    if (true) {
      return (
        <>
          <Link to="/" className={pathname === '/' ? 'active' : ''}>
            <FontAwesomeIcon icon={faHouse} />
          </Link>
          <Link
            to="/project"
            className={pathname.startsWith('/project') ? 'active' : ''}
          >
            <FontAwesomeIcon icon={faFolder} />
            {pathname.startsWith('/project/') && (
              <FontAwesomeIcon icon={faArrowLeft} className="back" />
            )}
          </Link>

          <button onClick={toggleTheme}>
            <FontAwesomeIcon icon={faCircleHalfStroke} />{' '}
          </button>
        </>
      )
    }
  }

  return (
    <div className="App">
      <Header
        title={getHeaderTitle()}
        center={getHeaderCenter()}
        right={getHeaderRight()}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user" element={<User />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/project" element={<SchoolProject />} />
        <Route path="/project/:projectId" element={<SchoolProject />} />
        <Route path="/create-project" element={<CreateProject />} />
        <Route path="/shortcut" element={<ShortcutUrlGenerator />} />
      </Routes>
    </div>
  )
}

export default App
