import React from 'react'
import style from './Footer.module.scss'
import { useTranslation } from 'react-i18next'

// fontawesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGithub,
  faInstagram,
  faThreads,
  faXTwitter,
} from '@fortawesome/free-brands-svg-icons'

function Footer(): JSX.Element {
  const { t } = useTranslation()

  return (
    <div className={style.footer}>
      <div className={style.social}>
        <a
          href="https://github.com/johnlin10"
          aria-label="John Lin's GitHub"
          target="_blank"
          rel="noreferrer"
        >
          <FontAwesomeIcon icon={faGithub} />
        </a>
        <a
          href="https://www.instagram.com/johnlin.me/"
          aria-label="John Lin's Instagram"
          target="_blank"
          rel="noreferrer"
        >
          <FontAwesomeIcon icon={faInstagram} />
        </a>
        <a
          href="https://www.threads.net/@johnlin.me"
          aria-label="John Lin's Threads"
          target="_blank"
          rel="noreferrer"
        >
          <FontAwesomeIcon icon={faThreads} />
        </a>
        <a
          href="https://x.com/Johnlin_10"
          aria-label="John Lin's X"
          target="_blank"
          rel="noreferrer"
        >
          <FontAwesomeIcon icon={faXTwitter} />
        </a>
      </div>
      <p className={style.copyright}>
        &copy; 2024-{new Date().getFullYear()} John Lin.{' '}
        {t('copyright', { ns: 'footer' })}
      </p>
    </div>
  )
}

export default Footer
