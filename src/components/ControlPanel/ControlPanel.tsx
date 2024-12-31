import style from './ControlPanel.module.scss'
import { ReactNode } from 'react'

import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

interface ControlPanelProps {
  title: string
  show: boolean
  onClose: () => void
  position: 'center' | 'bottom'
  children: ReactNode
}

interface ButtonGroupProps {
  label: string
  children: ReactNode
}

interface GroupProps {
  label?: string
  className?: string
  children: ReactNode
}

/**
 * 控制面板的按鈕群組，包含標籤和多個按鈕
 * @param label 標籤文字
 * @param children 按鈕群組
 * @returns
 * @example
 * <ButtonGroup label="Frequency">
 *   <button>Low</button>
 *   <button>Medium</button>
 *   <button>High</button>
 * </ButtonGroup>
 */
export function ButtonGroup({ label, children }: ButtonGroupProps) {
  return (
    <div className={style.buttonGroup}>
      <label>{label}</label>
      <div className={style.buttons}>{children}</div>
    </div>
  )
}

/**
 * 控制面板的群組，群組控制元件
 * @param label ? 標籤文字
 * @param children 控制項目
 * @returns
 * @example
 * <Group label="Fireworks Settings">
 *   <ControlGroup label="Frequency">
 *     <button>Low</button>
 *     <button>Medium</button>
 *     <button>High</button>
 *   </ControlGroup>
 *   <ControlGroup label="Amount">
 *     <button>Few</button>
 *     <button>Normal</button>
 *     <button>Many</button>
 *   </ControlGroup>
 * </Group>
 */
export function Group({ label, className, children }: GroupProps) {
  return (
    <div className={`${style.group} ${className}`}>
      {label && <label>{label}</label>}
      {children}
    </div>
  )
}

/**
 * 控制面板
 * @param title 標題
 * @param show 是否顯示
 * @param onClose 關閉事件
 * @param position 位置
 * @param children 子元件
 * @returns
 * @example
 * <ControlPanel title="Fireworks Settings" show={true} onClose={() => {}} position="bottom">
 *   <Group>
 *     <ButtonGroup label="Frequency">
 *       <button>Low</button>
 *       <button>Medium</button>
 *       <button>High</button>
 *     </ButtonGroup>
 *   </Group>
 * </ControlPanel>
 */
export function ControlPanel({
  title,
  show,
  onClose,
  position = 'bottom',
  children,
}: ControlPanelProps) {
  return (
    <div
      className={`${style.controls} ${show ? style.show : ''} ${
        style[position]
      }`}
    >
      <div className={style.controlsHeader}>
        <h3>{title}</h3>
        <button onClick={onClose} aria-label="Close">
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
      <div className={style.contents}>{children}</div>
    </div>
  )
}
