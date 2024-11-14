import React from 'react'
import style from './Home.module.scss'
import Footer from '../../components/Footer/Footer'
import { useTranslation } from 'react-i18next'

function Home(): JSX.Element {
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
                  <h3>{t('home.who_am_i.personality.title')}</h3>
                  <p>{t('home.who_am_i.personality.contents.0')}</p>
                  <p>{t('home.who_am_i.personality.contents.1')}</p>
                  <p>{t('home.who_am_i.personality.contents.2')}</p>
                  <p>{t('home.who_am_i.personality.contents.3')}</p>
                </div>
                <div className={style.h_block}>
                  <h3>{t('home.who_am_i.interest.title')}</h3>
                  <p>{t('home.who_am_i.interest.contents.0')}</p>
                  <p>{t('home.who_am_i.interest.contents.1')}</p>
                </div>
                <div className={style.h_block}>
                  <h3>{t('home.who_am_i.skills.title')}</h3>
                  <p>{t('home.who_am_i.skills.contents.0')}</p>
                </div>
                <div className={style.h_block}>
                  <h3>{t('home.who_am_i.beliefs_and_values.title')}</h3>
                  <p>{t('home.who_am_i.beliefs_and_values.contents.0')}</p>
                  <p>{t('home.who_am_i.beliefs_and_values.contents.1')}</p>
                  <p>{t('home.who_am_i.beliefs_and_values.contents.2')}</p>
                  <p>{t('home.who_am_i.beliefs_and_values.contents.3')}</p>
                </div>
                <div className={style.h_block}>
                  <h3>{t('home.who_am_i.dreams.title')}</h3>
                  <p>{t('home.who_am_i.dreams.contents.0')}</p>
                  <p>{t('home.who_am_i.dreams.contents.1')}</p>
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
