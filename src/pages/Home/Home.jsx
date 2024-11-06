import style from './Home.module.scss'
import Footer from '../../components/Footer/Footer'
import { useTranslation } from 'react-i18next'

function Home() {
  const { t } = useTranslation()
  return (
    <div className={style.home_container}>
      <div className={style.home_content}>
        <div className={style.top_content}>
          <p>{t('home.top-content.p1')}</p>
          <p>{t('home.top-content.p2')}</p>
          <p>{t('home.top-content.p3')}</p>
          <p>{t('home.top-content.p4')}</p>
        </div>
        <div className={style.page_content}>
          <div className={style.who_am_i}>
            <div className={style.text_content}>
              <h2>{t('home.who_am_i.title')}</h2>
              <p>{t('home.who_am_i.p1')}</p>
              <p>{t('home.who_am_i.p2')}</p>
              <p>{t('home.who_am_i.p3')}</p>
              <p>{t('home.who_am_i.p4')}</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Home
