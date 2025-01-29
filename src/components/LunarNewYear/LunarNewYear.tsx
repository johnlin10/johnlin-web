import { useTranslation } from 'react-i18next'
import style from './LunarNewYear.module.scss'

interface LunarNewYearProps {
  showControls: boolean
  onCloseControls: () => void
}

function LunarNewYear({ showControls, onCloseControls }: LunarNewYearProps) {
  const { t } = useTranslation()

  return (
    <div className={style.lunarNewYear}>
      <div className={style.lunarNewYear__title}>
        <h2>農曆新年快樂</h2>
      </div>
    </div>
  )
}

export default LunarNewYear
