import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { type IconProp } from '@fortawesome/fontawesome-svg-core'
import {
  faHouse,
  faLayerGroup,
  faLanguage,
  faCircleHalfStroke,
  faGear,
  faBook,
  faFlask,
  faSnowflake,
  faFire,
  faSun,
  faMoon,
  faCopy,
  faClipboard,
  faCircleExclamation,
  faBars,
} from '@fortawesome/free-solid-svg-icons'

//* 定義可用的圖標名稱類型
export type IconName =
  | 'house'
  | 'language'
  | 'gear'
  | 'book'
  | 'flask'
  | 'snowflake'
  | 'fire'
  | 'sun'
  | 'moon'
  | 'copy'
  | 'bars'
  | 'clipboard'
  | 'layer-group'
  | 'circle-half-stroke'
  | 'circle-exclamation'
//* 圖標映射表
const iconMap: Record<IconName, IconProp> = {
  house: faHouse,
  language: faLanguage,
  gear: faGear,
  book: faBook,
  flask: faFlask,
  snowflake: faSnowflake,
  fire: faFire,
  sun: faSun,
  moon: faMoon,
  copy: faCopy,
  bars: faBars,
  clipboard: faClipboard,
  'layer-group': faLayerGroup,
  'circle-half-stroke': faCircleHalfStroke,
  'circle-exclamation': faCircleExclamation,
}

interface IconProps {
  name: IconName
  className?: string
  size?: 'xs' | 'sm' | 'lg' | 'xl' | '2x'
  color?: string
}

const Icon = ({ name, className = '', size = 'sm', color }: IconProps) => {
  const icon = iconMap[name]

  if (!icon) {
    console.error(`Icon "${name}" not found`)
    return null
  }

  return (
    <FontAwesomeIcon
      icon={icon}
      className={className}
      size={size}
      color={color}
    />
  )
}

export default Icon
