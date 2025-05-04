import { TFunction } from 'i18next'
import { IconName } from '../components/Icon/Icon'
import i18n from 'i18next'

// 型別定義
export type Theme = 'light' | 'dark' | 'auto'
export type ControlPanel = 'snow' | 'fireworks' | null
export type Language = 'zh-TW' | 'en-US'

// 主題控制
export const getSystemTheme = (): 'light' | 'dark' => {
  return window.matchMedia('(prefers-color-scheme: light)').matches
    ? 'light'
    : 'dark'
}

export const getDisplayTheme = (theme: Theme): 'light' | 'dark' => {
  return theme === 'auto' ? getSystemTheme() : theme
}

export const getThemeText = (theme: Theme, t: TFunction): string => {
  if (theme === 'auto') {
    return `${t('theme.auto', { ns: 'settings' })}`
  }
  return theme === 'light'
    ? t('theme.light', { ns: 'settings' })
    : t('theme.dark', { ns: 'settings' })
}

export const getThemeIcon = (theme: Theme): IconName => {
  switch (theme) {
    case 'light':
      return 'sun'
    case 'dark':
      return 'moon'
    case 'auto':
      return 'circle-half-stroke'
    default:
      return 'circle-half-stroke'
  }
}

export const updateMetaThemeColor = (currentTheme: 'light' | 'dark'): void => {
  const metaThemeColor = document.querySelector("meta[name='theme-color']")
  if (metaThemeColor) {
    metaThemeColor.setAttribute(
      'content',
      currentTheme === 'light' ? '#ffffff' : '#131313'
    )
  }
}

export const cycleTheme = (currentTheme: Theme): Theme => {
  switch (currentTheme) {
    case 'light':
      return 'dark'
    case 'dark':
      return 'auto'
    case 'auto':
      return 'light'
    default:
      return 'light'
  }
}

// 初始化主題
export const initTheme = (theme: Theme): void => {
  const actualTheme = theme === 'auto' ? getSystemTheme() : theme
  document.documentElement.setAttribute('data-theme', actualTheme)
  localStorage.setItem('theme', theme)
  updateMetaThemeColor(actualTheme)
}

// 監聽系統主題變化
export const listenToSystemThemeChange = (
  theme: Theme,
  callback: () => void
): (() => void) => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handleChange = (): void => {
    if (theme === 'auto') {
      document.documentElement.setAttribute('data-theme', getSystemTheme())
      updateMetaThemeColor(getSystemTheme())
      callback()
    }
  }
  mediaQuery.addEventListener('change', handleChange)
  return () => {
    mediaQuery.removeEventListener('change', handleChange)
  }
}

// 語言控制
export const getCurrentLanguage = (): Language => {
  return i18n.language as Language
}

export const toggleLanguage = (): void => {
  const currentLang = getCurrentLanguage()
  const newLang = currentLang === 'zh-TW' ? 'en-US' : 'zh-TW'
  i18n.changeLanguage(newLang)
}

export const setLanguage = (lang: Language): void => {
  i18n.changeLanguage(lang)
}

export const getLanguageText = (lang: Language, t: TFunction): string => {
  return lang === 'zh-TW'
    ? t('language.zh-TW', { ns: 'settings' })
    : t('language.en-US', { ns: 'settings' })
}

// 特效控制
export const toggleControlPanel = (
  currentPanel: ControlPanel,
  panel: ControlPanel
): ControlPanel => {
  return currentPanel === panel ? null : panel
}

// 設定圖示變換
export const SETTING_ICON_TRANSFORM = {
  open: { transform: { rotate: 90 } },
  closed: { transform: { rotate: 0 } },
} as const

// 系統控制集合
export const SystemControls = {
  theme: {
    get: getSystemTheme,
    getDisplay: getDisplayTheme,
    getText: getThemeText,
    getIcon: getThemeIcon,
    update: updateMetaThemeColor,
    cycle: cycleTheme,
    init: initTheme,
    listen: listenToSystemThemeChange,
  },
  language: {
    get: getCurrentLanguage,
    toggle: toggleLanguage,
    set: setLanguage,
    getText: getLanguageText,
  },
  panel: {
    toggle: toggleControlPanel,
  },
  icons: {
    transform: SETTING_ICON_TRANSFORM,
  },
}

export default SystemControls
