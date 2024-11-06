import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import style from './Header.module.scss'

function Header({ title, center, right, setIsOpenSetting }) {
  const [clickCount, setClickCount] = useState(0)
  const navigate = useNavigate()
  const { t } = useTranslation()
  const refresh = () => {
    window.location.reload(true)
  }

  const handleHeaderClick = (e) => {
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
    <header className={style.header} onClick={handleHeaderClick}>
      <div
        className={style.title}
        onClick={(e) => {
          e.stopPropagation()
          refresh()
        }}
      >
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
    </header>
  )
}

export default Header
