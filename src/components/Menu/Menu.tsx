import style from './Menu.module.scss'
import Setting from './ui/Setting/Setting'

const Menu = ({ isMenuOpen }: { isMenuOpen: boolean }) => {
  return (
    <div className={`${style.menu} ${!isMenuOpen ? style.menu_close : ''}`}>
      <div className={style.menu_container}>
        <div className={style.menu_item}>
          <Setting />
        </div>
      </div>
    </div>
  )
}

export default Menu
