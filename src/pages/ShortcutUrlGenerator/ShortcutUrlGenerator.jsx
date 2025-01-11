import { useState, useEffect } from 'react'
import style from './ShortcutUrlGenerator.module.scss'
import { useTranslation } from 'react-i18next'
import { db } from '../../firebase'
import { setDoc, doc } from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid'
import { isValidUrl } from '../../utils/helpers'

function ShortcutUrlGenerator() {
  const { t } = useTranslation()
  const [originalUrl, setOriginalUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [isInvalidUrl, setIsInvalidUrl] = useState(false)

  const generateShortUrl = async () => {
    const shortCode = uuidv4().replace(/-/g, '').substring(0, 12)

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

  useEffect(() => {
    if (!isValidUrl(originalUrl)) {
      setIsInvalidUrl(true)
    } else {
      setIsInvalidUrl(false)
    }
  }, [originalUrl])

  return (
    <div className={style.shortcutUrlGenerator}>
      <h2>{t('shortcutUrlGenerator.title')}</h2>
      <input
        type="text"
        value={originalUrl}
        onChange={(e) => setOriginalUrl(e.target.value)}
        placeholder={t('shortcutUrlGenerator.inputUrl')}
      />
      <button onClick={generateShortUrl} disabled={isInvalidUrl}>
        {t('shortcutUrlGenerator.generate')}
      </button>
      {shortUrl && (
        <p>
          {t('shortcutUrlGenerator.shortUrl')}:{' '}
          <a href={shortUrl} target="_blank" rel="noreferrer">
            {shortUrl}
          </a>
        </p>
      )}
    </div>
  )
}

export default ShortcutUrlGenerator
