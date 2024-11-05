import styles from './FloatLabel.module.scss'

/**
 * Float label component
 * @param {string} label - The label text
 * @param {'top' | 'bottom' | 'left' | 'right' | 'center'} position - The position of the label
 * @param {React.ReactNode} children - The content to be displayed
 * @returns
 */
export default function FloatLabel({ label, position = 'top', children }) {
  return (
    <div className={`label ${styles.container} ${styles[position]}`}>
      {label && <p className={styles.label}>{label}</p>}
      {children}
    </div>
  )
}
