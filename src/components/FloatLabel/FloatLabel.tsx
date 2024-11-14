import React from 'react'
import styles from './FloatLabel.module.scss'

type Position = 'top' | 'bottom' | 'left' | 'right' | 'center'
type Align = 'center' | 'left' | 'right' | 'top' | 'bottom'
type Size = 'normal' | 'small'

interface FloatLabelProps {
  label: string
  position?: Position
  align?: Align
  size?: Size
  children?: React.ReactNode
}

export default function FloatLabel({
  label,
  position = 'top',
  align = 'center',
  size = 'normal',
  children,
}: FloatLabelProps): JSX.Element {
  return (
    <div
      className={`label ${
        styles.container
      } ${`position-${position}`} ${`align-${align}`} ${`size-${size}`}`}
    >
      {label && <p className={styles.label}>{label}</p>}
      {children}
    </div>
  )
}
