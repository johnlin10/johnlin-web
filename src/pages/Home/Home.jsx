import style from './Home.module.scss'
import Footer from '../../components/Footer/Footer'
import { useTranslation } from 'react-i18next'

function Home() {
  const { t } = useTranslation()
  return (
    <div className={style.home_container}>
      <div className={style.home_content}>
        <div className={style.top_content}>
          <code>{t('home.top-content.p1')}</code>
          <code>{t('home.top-content.p2')}</code>
          <code>{t('home.top-content.p3')}</code>
          <code>{t('home.top-content.p4')}</code>
          <code>{t('home.top-content.p5')}</code>
        </div>
        <div className={style.page_content}></div>
      </div>
      <Footer />
    </div>
  )
}

export default Home
