import { useState, useEffect, useCallback } from 'react'
import style from './ShortcutUrlGenerator.module.scss'
import { useTranslation } from 'react-i18next'
import { db } from '../../../../firebase'
import { setDoc, doc, getDoc } from 'firebase/firestore'
import { isValidUrl, generateNanoId } from '../../../../utils/helpers'
import useAuth from '../../../../hooks/useAuth'

import Switch from 'components/Switch/Switch'
import Icon from 'components/Icon/Icon'

import Metadata from '../../../../utils/metadata'

// 短網址生成器
function ShortcutUrlGenerator() {
  const { currentUser } = useAuth()
  const { t } = useTranslation()
  // url
  const [originalUrl, setOriginalUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [isInvalidUrl, setIsInvalidUrl] = useState(true)
  // custom code
  const [customCode, setCustomCode] = useState('')
  const [isCustomCode, setIsCustomCode] = useState(false) // is custom code input enabled
  const [isCustomCodeInvalid, setIsCustomCodeInvalid] = useState(false) // is custom code invalid
  // error message
  const [errorMessage, setErrorMessage] = useState('')

  // 驗證 URL 並更新狀態
  const validateAndUpdateUrl = useCallback(
    (url) => {
      const validUrl = isValidUrl(url)
      const urlLength = url.length
      setIsInvalidUrl(!validUrl || url.length < 32)
      setErrorMessage(
        !validUrl
          ? t('error.invalidUrl', { ns: 'shortcutUrlGenerator' })
          : url.length < 32
          ? t('error.lengthTooShort', { ns: 'shortcutUrlGenerator' })
          : urlLength > 100
          ? t('error.urlTooLong', { ns: 'shortcutUrlGenerator' })
          : ''
      )
    },
    [t]
  )

  // 自動貼上剪貼簿的網址
  useEffect(() => {
    // 當使用者聚焦視窗時，自動貼上剪貼簿的網址
    const handleFocus = async () => {
      const url = await navigator.clipboard.readText()
      const validUrl = isValidUrl(url)
      if (validUrl) {
        setOriginalUrl(url)
        setShortUrl('')
        validateAndUpdateUrl(url)
      }
    }
    window.addEventListener('focus', handleFocus)
    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [validateAndUpdateUrl])

  // 生成短網址
  const generateShortUrl = async () => {
    let shortCode = isCustomCode ? customCode : generateNanoId()

    // 如果是自訂代碼，先檢查格式是否正確
    if (isCustomCode && isCustomCodeInvalid) {
      setErrorMessage(
        t('error.invalidCustomCode', { ns: 'shortcutUrlGenerator' })
      )
      return
    }

    try {
      // 檢查短碼是否存在
      const docRef = doc(db, 'shortUrls', shortCode)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        console.warn(`Collision detected for ID: ${shortCode}`)
        setErrorMessage(
          t('error.customCodeExists', { ns: 'shortcutUrlGenerator' })
        )
        !isCustomCode && generateShortUrl() // 若非自訂碼則重新生成
        return
      }

      // 如果短碼不存在，則新增短網址
      await setDoc(docRef, {
        originalUrl,
        createdAt: new Date(),
        createdBy: currentUser.uid,
      })

      const domain = 'https://johnlin.me'
      setShortUrl(`${domain}/r/${shortCode}`)
      setErrorMessage('')
    } catch (error) {
      setShortUrl('')

      if (error.message === 'already-exists') {
        // 自訂代碼衝突處理
        isCustomCode &&
          setErrorMessage(
            t('error.customCodeExists', { ns: 'shortcutUrlGenerator' })
          )
        console.warn(`Collision detected for ID: ${shortCode}`)
      } else {
        // 未知錯誤處理
        console.error('add short url error', error)
        setErrorMessage(t('error.unknownError', { ns: 'shortcutUrlGenerator' }))
      }
    }
  }

  /**
   * 當輸入網址時，檢查是否為有效 URL
   * @param {*} e
   */
  const urlInputChange = (e) => {
    const url = e.target.value
    setOriginalUrl(url)
    setShortUrl('')
    validateAndUpdateUrl(url)
  }

  /**
   * 當輸入自訂代碼時，檢查是否為有效代碼
   * @param {*} e
   */
  const customCodeInputChange = (e) => {
    const code = e.target.value
    setCustomCode(code)

    // 只允許英文字母、數字和-，且長度至少3個字符
    const validCodePattern = /^[a-zA-Z0-9-]{3,}$/
    setIsCustomCodeInvalid(!validCodePattern.test(code))
  }

  return (
    <>
      <Metadata
        title={`${t('title', { ns: 'shortcutUrlGenerator' })} | ${t('title', {
          ns: 'laboratory',
        })}`}
        description={t('description', { ns: 'shortcutUrlGenerator' })}
      />
      <div className={style.shortcutUrlGenerator}>
        <div className={style.container}>
          {/* 輸入框 */}
          <input
            type="text"
            value={originalUrl}
            onChange={urlInputChange}
            placeholder={t('content.inputUrl', { ns: 'shortcutUrlGenerator' })}
            autoFocus
          />

          {/* 自訂短碼 */}
          {!isInvalidUrl && (
            //如果網址有效
            <>
              <div className={style.switchContainer}>
                <Switch
                  checked={isCustomCode}
                  onChange={() => setIsCustomCode(!isCustomCode)}
                />
                <p>{t('content.customCode', { ns: 'shortcutUrlGenerator' })}</p>
              </div>

              {isCustomCode && (
                // 如果自訂短碼開啟
                <>
                  <input
                    type="text"
                    value={customCode}
                    onChange={customCodeInputChange}
                    placeholder={t('content.inputCustomCode', {
                      ns: 'shortcutUrlGenerator',
                    })}
                    autoFocus
                  />
                  <p className={style.description}>
                    {t('content.customCodeLimit', {
                      ns: 'shortcutUrlGenerator',
                    })}
                  </p>
                </>
              )}
            </>
          )}
        </div>

        <div className={style.panelContainer}>
          {errorMessage && <p>{errorMessage}</p>}
          {shortUrl && (
            <div className={style.shortUrlContainer}>
              <h5>{t('content.shortUrl', { ns: 'shortcutUrlGenerator' })}</h5>
              <p className={style.shortUrl}>
                <a href={shortUrl} target="_blank" rel="noreferrer">
                  {shortUrl}
                </a>
              </p>
              <button
                className={style.copyButton}
                onClick={() => {
                  navigator.clipboard.writeText(shortUrl)
                  setErrorMessage(
                    t('content.copied', { ns: 'shortcutUrlGenerator' })
                  )
                }}
              >
                <Icon name="clipboard" />
              </button>
            </div>
          )}
          <button
            onClick={generateShortUrl}
            disabled={
              (isInvalidUrl && !isCustomCode) || // 網址無效且未啟用自訂代碼
              (isCustomCode && (!customCode || isCustomCodeInvalid)) // 啟用自訂代碼且代碼無效
            }
          >
            {t('content.generate', { ns: 'shortcutUrlGenerator' })}
          </button>
        </div>
      </div>
    </>
  )
}

export default ShortcutUrlGenerator
