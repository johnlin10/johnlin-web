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
            <div className={style.image_content}>
              <img
                src={process.env.PUBLIC_URL + '/assets/images/johnlin.jpeg'}
                alt="who am i"
              />
            </div>
            <div className={style.intro_content}>
              <h2>{t('home.who_am_i.title')}</h2>
              <p>{t('home.who_am_i.p1')}</p>
              <div className={style.h_scroll}>
                <div className={style.h_block}>
                  <h3>{t('home.who_am_i.title_1')}</h3>
                  <p>{t('home.who_am_i.text_1')}</p>
                </div>
                <div className={style.h_block}>
                  <h3>{t('home.who_am_i.title_2')}</h3>
                  <p>{t('home.who_am_i.text_2')}</p>
                </div>
                <div className={style.h_block}>
                  <h3>{t('home.who_am_i.title_3')}</h3>
                  <p>{t('home.who_am_i.text_3')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Home
