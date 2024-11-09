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

function Footer() {
  const { t } = useTranslation()

  return (
    <div className={style.footer}>
      {/* <h2>Footer</h2> */}
      <div className={style.social}>
        <a href="https://github.com/johnlin10" target="_blank" rel="noreferrer">
          <FontAwesomeIcon icon={faGithub} />
        </a>
        <a
          href="https://www.instagram.com/johnlin.me/"
          target="_blank"
          rel="noreferrer"
        >
          <FontAwesomeIcon icon={faInstagram} />
        </a>
        <a
          href="https://www.threads.net/@johnlin.me"
          target="_blank"
          rel="noreferrer"
        >
          <FontAwesomeIcon icon={faThreads} />
        </a>
        <a href="https://x.com/Johnlin_10" target="_blank" rel="noreferrer">
          <FontAwesomeIcon icon={faXTwitter} />
        </a>
      </div>
      <p className={style.copyright}>
        &copy; {new Date().getFullYear()} John Lin. {t('footer.copyright')}
      </p>
    </div>
  )
}

export default Footer
