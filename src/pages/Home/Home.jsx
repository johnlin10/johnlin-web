import style from './Home.module.scss'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className={style.home_container}>
      <div className={style.home_content}>
        <div className={style.top_content}>
          <code>Hi!</code>
          <code>I'm John Lin.</code>
          <code>A full stack web developer.</code>
          <code>There's nothing here for now.</code>
          <code>Coming soon...</code>
        </div>
        <div className={style.page_content}></div>
      </div>
    </div>
  )
}

export default Home
