import style from './Footer.module.scss'

function Footer() {
  return (
    <div className={style.footer}>
      {/* <h2>Footer</h2> */}
      <p className={style.copyright}>
        &copy; {new Date().getFullYear()} John Lin. All rights reserved.
      </p>
    </div>
  )
}

export default Footer
