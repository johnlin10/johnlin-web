import { useEffect, useRef, useState } from 'react'
import style from './Snow.module.scss'
import { useTranslation } from 'react-i18next'
import { ControlPanel, ButtonGroup, Group } from '../ControlPanel/ControlPanel'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faSnowflake } from '@fortawesome/free-solid-svg-icons'

interface SnowProps {
  density?: number
  speed?: number
  wind?: number
  showControls?: boolean
  onCloseControls: () => void
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
  density: 'off' | 'light' | 'medium' | 'heavy'
  speed: 'slow' | 'medium' | 'fast'
  wind: number
}

const DENSITY_MAP = {
  off: 0,
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
    density: 'off',
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
      <ControlPanel
        title={t('title', { ns: 'snow' })}
        show={showControls}
        onClose={onCloseControls}
        position="bottom"
      >
        <ButtonGroup label={t('density', { ns: 'snow' })}>
          {(['off', 'light', 'medium', 'heavy'] as const).map((density) => (
            <button
              key={density}
              className={settings.density === density ? 'active' : ''}
              onClick={() => setSettings({ ...settings, density })}
            >
              {t(`density_${density}`, { ns: 'snow' })}
            </button>
          ))}
        </ButtonGroup>
        <ButtonGroup label={t('speed', { ns: 'snow' })}>
          {(['slow', 'medium', 'fast'] as const).map((speed) => (
            <button
              key={speed}
              className={settings.speed === speed ? 'active' : ''}
              onClick={() => setSettings({ ...settings, speed })}
            >
              {t(`speed_${speed}`, { ns: 'snow' })}
            </button>
          ))}
        </ButtonGroup>
        <ButtonGroup
          label={`${
            settings.wind > 0
              ? t('wind.right', { ns: 'snow' })
              : settings.wind < 0
              ? t('wind.left', { ns: 'snow' })
              : t('wind.center', { ns: 'snow' })
          }
              ${
                settings.wind < -0.5
                  ? t('wind.level.strong', { ns: 'snow' })
                  : settings.wind > 0.5
                  ? t('wind.level.strong', { ns: 'snow' })
                  : settings.wind === 0
                  ? ''
                  : t('wind.level.light', { ns: 'snow' })
              }`}
        >
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
        </ButtonGroup>
      </ControlPanel>
    </>
  )
}

export default Snow
