import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import SystemControls, { Language } from '../utils/systemControls'

/**
 * 語言管理Hook
 *
 * 提供應用全局語言狀態管理，包含語言獲取和切換
 *
 * @returns {Object} 語言相關狀態與操作方法
 */
const useLanguage = () => {
  const { i18n, t } = useTranslation()
  const [language, setLanguage] = useState<Language>(
    SystemControls.language.get()
  )

  // 監聽語言變化
  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguage(SystemControls.language.get())
    }

    // 監聽i18n語言變化
    i18n.on('languageChanged', handleLanguageChange)

    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [i18n])

  // 切換語言
  const toggleLanguage = (): void => {
    SystemControls.language.toggle()
  }

  // 設置特定語言
  const setSpecificLanguage = (lang: Language): void => {
    SystemControls.language.set(lang)
  }

  // 獲取語言文字描述
  const getLanguageText = (): string => {
    return SystemControls.language.getText(language, t)
  }

  return {
    language,
    toggleLanguage,
    setLanguage: setSpecificLanguage,
    getLanguageText,
  }
}

export default useLanguage
