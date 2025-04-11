import style from './ErrorMessage.module.scss'
import Icon from '../Icon/Icon'

function ErrorMessage({ message }) {
  return (
    <div className={style.errorMessage}>
      <Icon name="circle-exclamation" />
      <h2>發生錯誤</h2>
      <p>{message}</p>
    </div>
  )
}

export default ErrorMessage
