import { useState, useEffect } from 'react'
import SystemControls, { Theme } from '../utils/systemControls'

/**
 * 主題管理Hook
 *
 * 提供應用全局主題狀態管理，包含主題獲取、切換和監聽系統主題變化
 *
 * @returns {Object} 主題相關狀態與操作方法
 */
const useTheme = () => {
  // 從本地儲存獲取初始主題，若無則預設為自動
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'auto'
  })

  // 初始化主題
  useEffect(() => {
    SystemControls.theme.init(theme)
  }, [theme])

  // 監聽系統主題變化
  useEffect(() => {
    return SystemControls.theme.listen(theme, () => {
      // 可在此添加系統主題變更時的額外操作
    })
  }, [theme])

  // 切換主題
  const toggleTheme = (): void => {
    setTheme((prevTheme) => SystemControls.theme.cycle(prevTheme))
  }

  // 獲取主題文字描述
  const getThemeText = (t: any): string => {
    return SystemControls.theme.getText(theme, t)
  }

  // 獲取主題圖示
  const getThemeIcon = () => {
    return SystemControls.theme.getIcon(theme)
  }

  return {
    theme,
    toggleTheme,
    getThemeText,
    getThemeIcon,
  }
}

export default useTheme
