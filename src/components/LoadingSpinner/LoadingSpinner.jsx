import style from './LoadingSpinner.module.scss'

function LoadingSpinner() {
  return (
    <div className={style.loadingSpinner}>
      <div className={style.spinner}></div>
    </div>
  )
}

export default LoadingSpinner
