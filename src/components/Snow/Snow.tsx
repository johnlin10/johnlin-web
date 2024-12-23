import { useEffect, useRef, useState } from 'react'
import style from './Snow.module.scss'
import { useTranslation } from 'react-i18next'

import Matter, { Engine, Render, Bodies, World, Runner } from 'matter-js'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

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
  speedX: number
}

interface SnowSettings {
  density: 'light' | 'medium' | 'heavy'
  speed: 'slow' | 'medium' | 'fast'
  accumulate: boolean
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
    accumulate: true,
  })

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const snowflakesRef = useRef<Snowflake[]>([])
  const animationFrameRef = useRef<number>()
  const accumulatedSnowRef = useRef<Snowflake[]>([])

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
        () => ({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 2,
          speedY: (Math.random() * 1 + 0.5) * SPEED_MAP[settings.speed],
          speedX: Math.random() * wind - wind / 2,
        })
      )
    }
    initSnowflakes()

    const animate = () => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const snowColor = getComputedStyle(
        document.documentElement
      ).getPropertyValue('--snow-color')
      ctx.fillStyle = snowColor

      // 繪製已堆積的雪
      if (settings.accumulate) {
        accumulatedSnowRef.current.forEach((snow) => {
          ctx.beginPath()
          ctx.arc(snow.x, snow.y, snow.size, 0, Math.PI * 2)
          ctx.fill()
        })
      }

      snowflakesRef.current.forEach((snowflake) => {
        ctx.beginPath()
        ctx.arc(snowflake.x, snowflake.y, snowflake.size, 0, Math.PI * 2)
        ctx.fill()

        snowflake.y += snowflake.speedY
        snowflake.x += snowflake.speedX

        if (settings.accumulate) {
          // 檢查是否觸底或碰到已堆積的雪
          const hitBottom = snowflake.y > canvas.height - snowflake.size / 2
          const hitAccumulated = accumulatedSnowRef.current.some((snow) => {
            const dx = snow.x - snowflake.x
            const dy = snow.y - snowflake.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            return distance < (snow.size + snowflake.size) * 0.8 // 允許80%重疊
          })

          if (hitBottom || hitAccumulated) {
            // 將雪花加入堆積數組
            accumulatedSnowRef.current.push({
              ...snowflake,
              speedX: 0,
              speedY: 0,
            })
            // 重置雪花位置
            snowflake.y = -snowflake.size
            snowflake.x = Math.random() * canvas.width
          }
        } else {
          // 原有的重置邏輯
          if (snowflake.y > canvas.height + snowflake.size) {
            snowflake.y = -snowflake.size
            snowflake.x = Math.random() * canvas.width
          }
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
        </div>
      </div>
    </>
  )
}

export default Snow
