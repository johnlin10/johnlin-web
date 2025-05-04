import { useState } from 'react'
import SystemControls, { ControlPanel } from '../utils/systemControls'

/**
 * 特效控制面板Hook
 *
 * 提供應用特效面板狀態管理，包含面板顯示和切換
 *
 * @returns {Object} 特效面板相關狀態與操作方法
 */
const useControlPanel = () => {
  const [activePanel, setActivePanel] = useState<ControlPanel>(null)

  // 切換特效面板
  const handleControlPanel = (panel: ControlPanel): void => {
    setActivePanel(SystemControls.panel.toggle(activePanel, panel))
  }

  // 關閉所有特效面板
  const closePanel = (): void => {
    setActivePanel(null)
  }

  return {
    activePanel,
    handleControlPanel,
    closePanel,
  }
}

export default useControlPanel
