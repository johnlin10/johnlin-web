import { useTranslation } from 'react-i18next'
import { animated, useSpring } from '@react-spring/web'
import { Link } from 'react-router-dom'
import style from './Laboratory.module.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink } from '@fortawesome/free-solid-svg-icons'

function Laboratory(): JSX.Element {
  const { t } = useTranslation()

  const _spring_container = useSpring({
    from: { opacity: 0, transform: 'translateY(15%)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  })

  const labs = [
    {
      title: t('tools.shortcut.title', { ns: 'laboratory' }),
      description: t('tools.shortcut.description', { ns: 'laboratory' }),
      icon: faLink,
      path: '/shortcut',
    },
  ]

  return (
    <div className={style.laboratory_container}>
      <animated.div
        className={style.laboratory_content}
        style={_spring_container}
      >
        <div className={style.header}>
          <p>{t('description', { ns: 'laboratory' })}</p>
        </div>

        <div className={style.tools_grid}>
          {labs.map((lab) => (
            <Link to={lab.path} className={style.tool_card}>
              <FontAwesomeIcon icon={lab.icon} />
              <h2>{lab.title}</h2>
              <p>{lab.description}</p>
            </Link>
          ))}
        </div>
      </animated.div>
    </div>
  )
}

export default Laboratory
