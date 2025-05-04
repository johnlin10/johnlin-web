import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { animated, useSpring } from '@react-spring/web'
import { Link, Outlet } from 'react-router-dom'
import Metadata from '../../utils/metadata'
import style from './Laboratory.module.scss'
import { labItems } from './LaboratoryItems'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function Laboratory(): JSX.Element {
  const { t } = useTranslation(['laboratory'])

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const _spring_container = useSpring({
    from: { opacity: 0, transform: 'translateY(15%)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  })

  const categories = useMemo(() => {
    const allCategories = labItems.map((item) => item.category)
    return ['all', ...Array.from(new Set(allCategories))]
  }, [])

  const filteredLabs = useMemo(() => {
    return labItems.filter((lab) => {
      const title = t(lab.title, { ns: 'laboratory' })
      const description = t(lab.description, { ns: 'laboratory' })

      const matchesSearch =
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory =
        selectedCategory === 'all' || lab.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory, t])

  return (
    <>
      <Metadata
        title={`${t('title')} | ${t('website.title', {
          ns: 'common',
        })}`}
        description={t('description')}
      />
      <div className={style.laboratory}>
        <animated.div className={style.container} style={_spring_container}>
          <div className={style.header}>
            <p>{t('description')}</p>
          </div>

          <div className={style.tools_grid}>
            {filteredLabs.length > 0 ? (
              filteredLabs.map((lab, index) => (
                <Link to={lab.path} className={style.tool_card} key={index}>
                  <div className={style.tool_card_header}>
                    <div className={style.tool_icon}>
                      <FontAwesomeIcon icon={lab.icon} />
                    </div>
                    {lab.tags && (
                      <div className={style.tags}>
                        {lab.tags.map((tag, idx) => (
                          <span key={idx} className={style.tag}>
                            {t(`tags.${tag}`)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className={style.tool_content}>
                    <div className={style.status}>
                      {lab.status?.isNew && (
                        <span className={style.new}>{t('status.new')}</span>
                      )}
                      {lab.status?.isPopular && (
                        <span className={style.popular}>
                          {t('status.popular')}
                        </span>
                      )}
                      {lab.status?.wip && (
                        <span className={style.wip}>{t('status.wip')}</span>
                      )}
                    </div>

                    <h2>{t(`tools.${lab.title}`)}</h2>
                    <p>{t(`tools.${lab.description}`)}</p>
                  </div>
                </Link>
              ))
            ) : (
              <div className={style.no_results}>{t('no_results')}</div>
            )}
          </div>
        </animated.div>
      </div>
      <Outlet />
    </>
  )
}

export default Laboratory
