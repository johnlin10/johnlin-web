import React, { useState } from 'react'
import style from './ShortcutUrlGenerator.module.scss'

import { db } from '../../firebase'
import { setDoc, doc } from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid'

function ShortcutUrlGenerator() {
  const [originalUrl, setOriginalUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')

  const generateShortUrl = async () => {
    const shortCode = uuidv4().replace(/-/g, '').substring(0, 12)
    try {
      await setDoc(doc(db, 'shortUrls', shortCode), {
        originalUrl,
        createdAt: new Date(),
      })
      setShortUrl(`https://johnlin.web.app/s/${shortCode}`)
    } catch (error) {
      console.error('add short url error', error)
    }
  }

  return (
    <div className={style.shortcutUrlGenerator}>
      <input
        type="text"
        value={originalUrl}
        onChange={(e) => setOriginalUrl(e.target.value)}
        placeholder="input the url you want to shorten"
      />
      <button onClick={generateShortUrl}>Generate short url</button>
      {shortUrl && (
        <p>
          short url:{' '}
          <a href={shortUrl} target="_blank" rel="noreferrer">
            {shortUrl}
          </a>
        </p>
      )}
    </div>
  )
}

export default ShortcutUrlGenerator
