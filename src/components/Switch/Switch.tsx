import React from 'react'
import style from './Switch.module.scss'

interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
}

/**
 * 開關
 * @param {SwitchProps} props
 * @returns
 */
const Switch: React.FC<SwitchProps> = ({ checked, onChange }) => {
  return (
    <div
      className={`${style.switch} ${checked ? style.checked : ''}`}
      onClick={() => onChange(!checked)}
    >
      <input type="checkbox" checked={checked} />
      <span className={style.slider}></span>
    </div>
  )
}

export default Switch
