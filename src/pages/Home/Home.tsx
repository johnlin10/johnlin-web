import React from 'react'
import style from './Home.module.scss'
import Footer from '../../components/Footer/Footer'
import { useTranslation } from 'react-i18next'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { animated, useSpring, useSprings } from '@react-spring/web'

function Home(): JSX.Element {
  const { t } = useTranslation()

  const intro_blocks = [
    {
      title: 'personality',
      content_count: 4,
    },
    {
      title: 'interest',
      content_count: 2,
    },
    {
      title: 'skills',
      content_count: 1,
    },
    {
      title: 'beliefs_and_values',
      content_count: 4,
    },
    {
      title: 'dreams',
      content_count: 2,
    },
  ]

  //* animation
  const _spring_who_am_i = useSpring({
    from: { opacity: 0, transform: 'translateY(15%)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  })
  const _spring_avatar = useSpring({
    from: { opacity: 0, transform: 'scale(0.8)' },
    to: { opacity: 1, transform: 'scale(1)' },
  })
  const _springs_intro_block = useSprings(
    intro_blocks.length,
    intro_blocks.map((_, index) => ({
      from: { opacity: 0, transform: 'translateY(15%)' },
      to: { opacity: 1, transform: 'translateY(0)' },
      delay: 100 * index,
    }))
  )
  return (
    <div className={style.home_container}>
      <div className={style.home_content}>
        {/* <div className={style.top_content}>
          <p>{t('home.top-content.1')}</p>
          <p>{t('home.top-content.2')}</p>
        </div> */}
        <div className={style.page_content}>
          <animated.div className={style.who_am_i} style={_spring_who_am_i}>
            <div className={style.image_content}>
              <animated.div style={_spring_avatar}>
                <LazyLoadImage
                  src={process.env.PUBLIC_URL + '/assets/images/johnlin.jpeg'}
                  alt="John Lin's avatar"
                  effect="opacity"
                  width="100%"
                  height="100%"
                />
              </animated.div>
            </div>
            <div className={style.intro_content}>
              <h2>{t('who_am_i.title', { ns: 'home' })}</h2>
              <p>{t('who_am_i.p1', { ns: 'home' })}</p>

              {/* <div className={style.h_scroll}>
                {_springs_intro_block.map((spring, index) => (
                  <animated.div
                    className={style.h_block}
                    style={spring}
                    key={index}
                  >
                    <h3>
                      {t(`home.who_am_i.${intro_blocks[index].title}.title`)}
                    </h3>
                    {Array.from({
                      length: intro_blocks[index].content_count,
                    }).map((_, content_index) => (
                      <p key={content_index}>
                        {t(
                          `home.who_am_i.${intro_blocks[index].title}.contents.${content_index}`
                        )}
                      </p>
                    ))}
                  </animated.div>
                ))}
              </div> */}
            </div>
          </animated.div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Home
