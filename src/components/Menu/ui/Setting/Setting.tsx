import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { useTranslation } from 'react-i18next'
import { faSnowflake, faFire } from '@fortawesome/free-solid-svg-icons'

import FloatLabel from '../../../FloatLabel/FloatLabel'
import SystemControls from '../../../../utils/systemControls'
import { useSystem } from '../../../../context/SystemContext'

import style from './Setting.module.scss'

import Icon from '../../../Icon/Icon'

/**
 * Header Setting 元件
 *
 * 用於顯示和控制系統設定，包含主題切換、語言切換和特效控制
 *
 * @returns JSX.Element
 */
const Setting = () => {
  // 從系統上下文獲取狀態與操作
  const { theme, toggleTheme, language, toggleLanguage, handleControlPanel } =
    useSystem()

  // 取得主題文字和圖示
  const { t } = useTranslation(['settings'])
  const themeText = SystemControls.theme.getText(theme, t)
  const themeIcon = SystemControls.theme.getIcon(theme)

  // 顯示特效控制
  const showEffectControls = true

  return (
    <div className={style.setting}>
      <div className={style.actions}>
        {/* 主題切換 */}
        <div
          className={style.theme_container}
          onClick={toggleTheme}
          title={`${t('theme.title', { ns: 'settings' })} - ${themeText}`}
        >
          <div className={style.theme_icon}>
            <Icon name={themeIcon} />
          </div>
          <div className={style.theme_text}>{themeText}</div>
        </div>

        {/* 語言切換 */}
        <div
          className={style.language_container}
          onClick={toggleLanguage}
          title={`${t('language.title', {
            ns: 'settings',
          })} - ${SystemControls.language.getText(language, t)}`}
        >
          <div className={style.language_icon}>
            <Icon name="language" />
          </div>
          <div className={style.language_text}>
            {SystemControls.language.getText(language, t)}
          </div>
        </div>

        {/* 特效控制 */}
        {showEffectControls && (
          <>
            {/* <hr /> */}
            {/* <button
              onClick={() => handleControlPanel('snow')}
              aria-label={t('snow.title')}
              title={t('snow.title')}
            >
              <Icon name="snowflake" />
              <FloatLabel label={t('snow.title')} position="left"></FloatLabel>
            </button>
            <button
              onClick={() => handleControlPanel('fireworks')}
              aria-label={t('fireworks.title')}
              title={t('fireworks.title')}
            >
              <Icon name="fire" />
              <FloatLabel
                label={t('fireworks.title')}
                position="left"
              ></FloatLabel>
            </button> */}
          </>
        )}
      </div>
    </div>
  )
}

export default Setting
