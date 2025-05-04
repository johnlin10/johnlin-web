import React, { createContext, useContext, ReactNode } from 'react'
import useTheme from '../hooks/useTheme'
import useLanguage from '../hooks/useLanguage'
import useControlPanel from '../hooks/useControlPanel'
import { Theme, Language, ControlPanel } from '../utils/systemControls'

// 定義系統上下文類型
interface SystemContextType {
  // 主題相關
  theme: Theme
  toggleTheme: () => void
  getThemeText: (t: any) => string
  getThemeIcon: () => any

  // 語言相關
  language: Language
  toggleLanguage: () => void
  setLanguage: (lang: Language) => void
  getLanguageText: () => string

  // 特效面板相關
  activePanel: ControlPanel
  handleControlPanel: (panel: ControlPanel) => void
  closePanel: () => void
}

// 創建系統上下文
const SystemContext = createContext<SystemContextType | undefined>(undefined)

// 系統上下文提供者
export const SystemProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const themeHook = useTheme()
  const languageHook = useLanguage()
  const controlPanelHook = useControlPanel()

  // 組合所有系統狀態
  const systemContext: SystemContextType = {
    ...themeHook,
    ...languageHook,
    ...controlPanelHook,
  }

  return (
    <SystemContext.Provider value={systemContext}>
      {children}
    </SystemContext.Provider>
  )
}

// 自定義Hook用於訪問系統上下文
export const useSystem = (): SystemContextType => {
  const context = useContext(SystemContext)
  if (context === undefined) {
    throw new Error('useSystem must be used within a SystemProvider')
  }
  return context
}

export default SystemContext
