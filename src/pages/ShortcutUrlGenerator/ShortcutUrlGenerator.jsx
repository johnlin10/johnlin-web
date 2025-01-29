import { useState } from 'react'
import style from './ShortcutUrlGenerator.module.scss'
import { useTranslation } from 'react-i18next'
import { db } from '../../firebase'
import { setDoc, doc } from 'firebase/firestore'
import { isValidUrl, generateNanoId } from '../../utils/helpers'

function ShortcutUrlGenerator() {
  const { t } = useTranslation()
  const [originalUrl, setOriginalUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [isInvalidUrl, setIsInvalidUrl] = useState(true)

  const generateShortUrl = async () => {
    const shortCode = generateNanoId()

    try {
      await setDoc(doc(db, 'shortUrls', shortCode), {
        originalUrl,
        createdAt: new Date(),
      })

      const domain = 'https://johnlin.me'
      setShortUrl(`${domain}/r/${shortCode}`)
    } catch (error) {
      console.error('add short url error', error)
    }
  }

  const urlInputChange = (e) => {
    const url = e.target.value
    setOriginalUrl(url)

    if (!isValidUrl(url)) {
      setIsInvalidUrl(true)
    } else {
      setIsInvalidUrl(false)
    }
  }

  return (
    <div className={style.shortcutUrlGenerator}>
      <h2>{t('title', { ns: 'shortcutUrlGenerator' })}</h2>
      <input
        type="text"
        value={originalUrl}
        onChange={urlInputChange}
        placeholder={t('inputUrl', { ns: 'shortcutUrlGenerator' })}
      />
      <button onClick={generateShortUrl} disabled={isInvalidUrl}>
        {t('generate', { ns: 'shortcutUrlGenerator' })}
      </button>
      {shortUrl && (
        <p>
          {t('shortUrl', { ns: 'shortcutUrlGenerator' })}:{' '}
          <a href={shortUrl} target="_blank" rel="noreferrer">
            {shortUrl}
          </a>
        </p>
      )}
    </div>
  )
}

export default ShortcutUrlGenerator
