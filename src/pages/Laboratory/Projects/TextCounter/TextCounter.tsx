import style from './TextCounter.module.scss'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

function TextCounter(): JSX.Element {
  const { t } = useTranslation(['textCounter'])
  const [textStats, setTextStats] = useState({
    totalChars: 0,
    chineseChars: 0,
    chinesePunctuation: 0,
    englishChars: 0,
    spaces: 0,
    numbers: 0,
    paragraphs: 0,
  })

  const countTextStats = (text: string) => {
    const totalChars = text.length
    const chineseCharsMatch = text.match(/[\u4e00-\u9fa5]/g)
    const chineseChars = chineseCharsMatch ? chineseCharsMatch.length : 0

    const chinesePunctuationMatch = text.match(/[\u3000-\u303F\uFF00-\uFFEF]/g)
    const chinesePunctuation = chinesePunctuationMatch
      ? chinesePunctuationMatch.length
      : 0

    const englishCharsMatch = text.match(/[a-zA-Z]/g)
    const englishChars = englishCharsMatch ? englishCharsMatch.length : 0

    const spacesMatch = text.match(/\s/g)
    const spaces = spacesMatch ? spacesMatch.length : 0

    const numbersMatch = text.match(/[0-9]/g)
    const numbers = numbersMatch ? numbersMatch.length : 0

    const paragraphs = text ? text.split('\n').length : 0

    setTextStats({
      totalChars,
      chineseChars,
      chinesePunctuation,
      englishChars,
      spaces,
      numbers,
      paragraphs,
    })
  }

  return (
    <div className={style.text_counter}>
      <div className={style.container}>
        <div className={style.text_input}>
          <textarea
            placeholder={t('placeholder')}
            onChange={(e) => {
              countTextStats(e.target.value)
            }}
          />
        </div>
        <div className={style.text_counter_result}>
          <div className={style.stat_item}>
            <span className={style.label}>{t('totalChars')}</span>
            <span className={style.value}>{textStats.totalChars}</span>
          </div>
          <div className={style.stat_item}>
            <span className={style.label}>{t('chineseChars')}</span>
            <span className={style.value}>{textStats.chineseChars}</span>
          </div>
          <div className={style.stat_item}>
            <span className={style.label}>{t('chinesePunctuation')}</span>
            <span className={style.value}>{textStats.chinesePunctuation}</span>
          </div>
          <div className={style.stat_item}>
            <span className={style.label}>{t('englishChars')}</span>
            <span className={style.value}>{textStats.englishChars}</span>
          </div>
          <div className={style.stat_item}>
            <span className={style.label}>{t('spaces')}</span>
            <span className={style.value}>{textStats.spaces}</span>
          </div>
          <div className={style.stat_item}>
            <span className={style.label}>{t('numbers')}</span>
            <span className={style.value}>{textStats.numbers}</span>
          </div>
          <div className={style.stat_item}>
            <span className={style.label}>{t('paragraphs')}</span>
            <span className={style.value}>{textStats.paragraphs}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TextCounter
