import { useEffect, useRef, useState } from 'react'
import style from './Snow.module.scss'
import { useTranslation } from 'react-i18next'

import Matter, { Engine, Render, Bodies, World, Runner } from 'matter-js'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faSnowflake } from '@fortawesome/free-solid-svg-icons'

interface SnowProps {
  density?: number
  speed?: number
  wind?: number
  showControls?: boolean
  onCloseControls?: () => void
}

interface Snowflake {
  x: number
  y: number
  size: number
  speedY: number
  baseSpeedX: number
  opacity: number
  scale: number
  isSpecial: boolean
}

interface SnowSettings {
  density: 'light' | 'medium' | 'heavy'
  speed: 'slow' | 'medium' | 'fast'
  wind: number
}

const DENSITY_MAP = {
  light: 15,
  medium: 30,
  heavy: 70,
}

const SPEED_MAP = {
  slow: 0.3,
  medium: 0.7,
  fast: 1.5,
}

function Snow({
  wind = 0.5,
  showControls = false,
  onCloseControls,
}: SnowProps): JSX.Element {
  const { t } = useTranslation()
  const [settings, setSettings] = useState<SnowSettings>({
    density: 'medium',
    speed: 'medium',
    wind: -0.3,
  })

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const snowflakesRef = useRef<Snowflake[]>([])
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const initSnowflakes = () => {
      snowflakesRef.current = Array.from(
        { length: DENSITY_MAP[settings.density] },
        () => {
          const isSpecial = Math.random() < 0.15
          const size = isSpecial ? Math.random() * 2 + 1 : Math.random() * 3 + 2

          return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size,
            speedY: (Math.random() * 1 + 0.5) * SPEED_MAP[settings.speed],
            baseSpeedX: Math.random() * 0.4 - 0.2,
            scale: 1,
            opacity: 1,
            isSpecial,
          }
        }
      )
    }
    initSnowflakes()

    const animate = () => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const snowColor = getComputedStyle(
        document.documentElement
      ).getPropertyValue('--snow-color')

      snowflakesRef.current.forEach((snowflake) => {
        ctx.globalAlpha = snowflake.opacity

        // 根據雪花大小計算風力影響
        const windEffect = settings.wind * (1 - snowflake.size * 1.25) // 越大的雪花受風力影響越小
        snowflake.x +=
          snowflake.baseSpeedX + windEffect * SPEED_MAP[settings.speed]

        if (snowflake.isSpecial) {
          ctx.save()
          ctx.translate(snowflake.x, snowflake.y)
          const scale = snowflake.size * 0.015 * snowflake.scale // 調整大小比例
          ctx.scale(scale, scale)
          ctx.translate(-256, -256) // faSnowflake 的中心點

          const path = new Path2D(faSnowflake.icon[4] as string)
          ctx.fillStyle = snowColor
          ctx.fill(path)
          ctx.restore()
        } else {
          ctx.beginPath()
          ctx.arc(
            snowflake.x,
            snowflake.y,
            snowflake.size * snowflake.scale,
            0,
            Math.PI * 2
          )
          ctx.fillStyle = snowColor
          ctx.fill()
        }

        ctx.globalAlpha = 1

        snowflake.y += snowflake.speedY
        snowflake.x += snowflake.baseSpeedX

        // 根據雪花在畫面中的位置更新縮放和透明度
        const fadeStartPoint = canvas.height * 0
        if (snowflake.y > fadeStartPoint) {
          const progress =
            (snowflake.y - fadeStartPoint) / (canvas.height - fadeStartPoint)
          const fadeOutDuration = snowflake.size / 1.5
          snowflake.scale = Math.max(1 - progress * fadeOutDuration, 0)
          snowflake.opacity = Math.max(1 - progress * fadeOutDuration, 0)
        }

        // 當雪花完全消失或超出畫面時重置
        if (
          snowflake.opacity <= 0 ||
          snowflake.y > canvas.height + snowflake.size
        ) {
          snowflake.y = -snowflake.size
          snowflake.x = Math.random() * canvas.width
          snowflake.scale = 1
          snowflake.opacity = 1
        }

        if (snowflake.x > canvas.width + snowflake.size) {
          snowflake.x = -snowflake.size
        } else if (snowflake.x < -snowflake.size) {
          snowflake.x = canvas.width + snowflake.size
        }
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [settings, wind])

  return (
    <>
      <canvas ref={canvasRef} className={style.snow} />
      <div className={`${style.controls} ${showControls ? style.show : ''}`}>
        <div className={style.controlsHeader}>
          <h3>{t('snow.controls')}</h3>
          <button onClick={onCloseControls}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        <div className={style.controlsContent}>
          <div className={style.controlGroup}>
            <label>{t('snow.density')}</label>
            <div className={style.buttons}>
              {(['light', 'medium', 'heavy'] as const).map((density) => (
                <button
                  key={density}
                  className={settings.density === density ? style.active : ''}
                  onClick={() => setSettings({ ...settings, density })}
                >
                  {t(`snow.density_${density}`)}
                </button>
              ))}
            </div>
          </div>
          <div className={style.controlGroup}>
            <label>{t('snow.speed')}</label>
            <div className={style.buttons}>
              {(['slow', 'medium', 'fast'] as const).map((speed) => (
                <button
                  key={speed}
                  className={settings.speed === speed ? style.active : ''}
                  onClick={() => setSettings({ ...settings, speed })}
                >
                  {t(`snow.speed_${speed}`)}
                </button>
              ))}
            </div>
          </div>
          <div className={style.controlGroup}>
            <label>
              {/* {t('snow.wind.title')}{' '} */}
              {settings.wind > 0
                ? t('snow.wind.right')
                : settings.wind < 0
                ? t('snow.wind.left')
                : t('snow.wind.center')}
              {settings.wind < -0.5
                ? t('snow.wind.level.strong')
                : settings.wind > 0.5
                ? t('snow.wind.level.strong')
                : settings.wind === 0
                ? ''
                : t('snow.wind.level.light')}
            </label>
            <span className={style.sliderValue}></span>
            <div className={style.sliderContainer}>
              <input
                type="range"
                min="-1"
                max="1"
                step="0.1"
                value={settings.wind}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    wind: parseFloat(e.target.value),
                  })
                }
                className={style.slider}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Snow
