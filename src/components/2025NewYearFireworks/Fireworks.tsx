import { useEffect, useState, useRef, useCallback } from 'react'
import styles from './Fireworks.module.scss'
import { useTranslation } from 'react-i18next'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFire,
  faPause,
  faPlay,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'

interface FireworksProps {
  showControls: boolean
  onCloseControls: () => void
}

interface FireworksParticle {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  alpha: number
  lifetime: number
}

interface FireworkShell {
  x: number
  y: number
  targetY: number
  vy: number
  color: string
  size: number
  hasExploded: boolean
}

interface FireworksSettings {
  frequency: 'low' | 'medium' | 'high'
  amount: 'few' | 'normal' | 'many'
  isAutoLaunch: boolean
}

const FREQUENCY_MAP = {
  low: 2500,
  medium: 1500,
  high: 500,
}

const AMOUNT_MAP = {
  few: 20,
  normal: 50,
  many: 100,
}

const COLORS = [
  '#ff0000',
  '#00ff00',
  '#0000ff',
  '#ffff00',
  '#ff00ff',
  '#ffffff',
]

function Fireworks({ showControls, onCloseControls }: FireworksProps) {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<FireworksParticle[]>([])
  const shellsRef = useRef<FireworkShell[]>([])
  const animationFrameRef = useRef<number>()

  const [settings, setSettings] = useState<FireworksSettings>({
    frequency: 'medium',
    amount: 'normal',
    isAutoLaunch: true,
  })

  const createFirework = useCallback(
    (x: number, y: number) => {
      const particles: FireworksParticle[] = []
      const color = COLORS[Math.floor(Math.random() * COLORS.length)]
      const particleCount = AMOUNT_MAP[settings.amount]

      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount
        const velocity = 2 + Math.random() * 2
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          color,
          size: 2,
          alpha: 1,
          lifetime: 100,
        })
      }
      particlesRef.current = [...particlesRef.current, ...particles]
    },
    [settings.amount]
  )

  const createFireworkShell = useCallback((x: number, y: number) => {
    // 調整大小範圍，讓差異更明顯
    const size = Math.random() * 0.1 + 0.2

    // 根據大小動態計算目標高度
    // 較大的煙火會飛得更高，但有一定的隨機性
    const heightFactor = size * 1.5 // 0.4 ~ 0.7
    const randomHeight = Math.random() * 0.5 - 0.3 // ±5% 的隨機變化
    const targetY = window.innerHeight * (1 - (heightFactor + randomHeight))

    const shell: FireworkShell = {
      x,
      y,
      targetY,
      vy: -15 - size * 8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: size * 3,
      hasExploded: false,
    }
    shellsRef.current.push(shell)
  }, [])
  const createExplosion = useCallback(
    (x: number, y: number, size: number, color: string) => {
      const particles: FireworksParticle[] = []
      // 較大的煙火產生更多粒子
      const particleCount = Math.floor(
        AMOUNT_MAP[settings.amount] * (size * 1.5)
      )

      // 主要爆炸圖案
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount
        // 較大的煙火爆炸速度更快，範圍更大
        const velocity = (2 + Math.random() * 2.5) * (size * 2)
        const randomOffset = Math.random() * 0.3 - 0.15

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * velocity * (1 + randomOffset),
          vy: Math.sin(angle) * velocity * (1 + randomOffset),
          color,
          size: 1 + Math.random() * size,
          alpha: 1,
          // 較大的煙火持續時間更長
          lifetime: 80 + size * 40 + Math.random() * 20,
        })
      }

      // 添加額外的散射粒子
      const scatterCount = Math.floor(particleCount * 0.4)
      for (let i = 0; i < scatterCount; i++) {
        const angle = Math.random() * Math.PI * 2
        const velocity = Math.random() * size * 3

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          color,
          size: 0.5 + Math.random() * (size * 0.5),
          alpha: 1,
          lifetime: 40 + size * 20 + Math.random() * 20,
        })
      }

      particlesRef.current = [...particlesRef.current, ...particles]
    },
    [settings.amount]
  )

  // 主要動畫邏輯
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

    let lastFireworkTime = 0
    const animate = (timestamp: number) => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (
        settings.isAutoLaunch &&
        timestamp - lastFireworkTime > FREQUENCY_MAP[settings.frequency]
      ) {
        const x = Math.random() * canvas.width
        createFireworkShell(x, canvas.height)
        lastFireworkTime = timestamp
      }

      // 更新和繪製粒子
      shellsRef.current = shellsRef.current.filter((shell) => {
        if (!shell.hasExploded) {
          // 繪製發光核心
          ctx.beginPath()
          ctx.arc(shell.x, shell.y, shell.size * 2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 220, 180, 0.8)`
          ctx.fill()

          // 繪製外部光暈
          const gradient = ctx.createRadialGradient(
            shell.x,
            shell.y,
            0,
            shell.x,
            shell.y,
            shell.size
          )
          gradient.addColorStop(0, 'rgba(200, 200, 200, 1)')
          // gradient.addColorStop(1, 'rgba(200, 200, 200, 0)')

          ctx.beginPath()
          ctx.arc(shell.x, shell.y, shell.size * 4, 0, Math.PI * 2)
          ctx.fillStyle = gradient
          ctx.fill()

          // 繪製上升軌跡
          const trailLength = 10
          for (let i = 0; i < trailLength; i++) {
            const trailY = shell.y + i * 3
            const alpha = (1 - i / trailLength) * 0.4

            ctx.beginPath()
            ctx.arc(
              shell.x,
              trailY,
              shell.size * (1 - i / trailLength),
              0,
              Math.PI * 2
            )
            ctx.fillStyle = `rgba(200, 200, 200, ${alpha})`
            ctx.fill()
          }

          // 更新位置
          shell.y += shell.vy
          shell.vy += 0.2

          if (shell.y <= shell.targetY) {
            createExplosion(shell.x, shell.y, shell.size, shell.color)
            shell.hasExploded = true
            return false
          }
          return true
        }
        return false
      })

      // 更新和繪製爆炸粒子
      particlesRef.current = particlesRef.current.filter((particle) => {
        // 更新位置
        particle.x += particle.vx
        particle.y += particle.vy
        particle.vy += 0.15
        particle.vx *= 0.99
        particle.vy *= 0.99
        particle.alpha = Math.max(0, particle.alpha - 0.01)
        particle.lifetime -= 1

        if (particle.alpha > 0 && particle.lifetime > 0) {
          // 使用 globalCompositeOperation 來增強發光效果
          ctx.globalCompositeOperation = 'lighter'

          // 創建發光效果
          const gradient = ctx.createRadialGradient(
            particle.x,
            particle.y,
            0,
            particle.x,
            particle.y,
            particle.size
          )
          gradient.addColorStop(
            0,
            `rgba(${hexToRgb(particle.color)}, ${particle.alpha})`
          )
          // gradient.addColorStop(
          //   0.4,
          //   `rgba(${hexToRgb(particle.color)}, ${particle.alpha * 0.3})`
          // )
          // gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fillStyle = gradient
          ctx.fill()

          // 重置混合模式
          ctx.globalCompositeOperation = 'source-over'

          return true
        }
        return false
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate(0)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [settings, createFirework, createFireworkShell, createExplosion])

  // 手動發射煙火
  const handleManualLaunch = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const x = Math.random() * canvas.width
    createFireworkShell(x, canvas.height)
  }, [createFireworkShell])

  return (
    <>
      <canvas ref={canvasRef} className={styles.fireworks_canvas} />
      <div className={`${styles.controls} ${showControls ? styles.show : ''}`}>
        <div className={styles.controlsHeader}>
          <h3>{t('fireworks.title')}</h3>
          <button onClick={onCloseControls}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        <div className={styles.contents}>
          <div className={styles.controlsContent}>
            <div className={styles.controlGroup}>
              <label>{t('fireworks.frequency.title')}</label>
              <div className={styles.buttons}>
                {(['low', 'medium', 'high'] as const).map((frequency) => (
                  <button
                    key={frequency}
                    className={
                      settings.frequency === frequency ? styles.active : ''
                    }
                    onClick={() => setSettings({ ...settings, frequency })}
                  >
                    {t(`fireworks.frequency.level.${frequency}`)}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.controlGroup}>
              <label>{t('fireworks.amount.title')}</label>
              <div className={styles.buttons}>
                {(['few', 'normal', 'many'] as const).map((amount) => (
                  <button
                    key={amount}
                    className={settings.amount === amount ? styles.active : ''}
                    onClick={() => setSettings({ ...settings, amount })}
                  >
                    {t(`fireworks.amount.level.${amount}`)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.controlActions}>
            <button
              className={styles.autoButton}
              onClick={() =>
                setSettings({
                  ...settings,
                  isAutoLaunch: !settings.isAutoLaunch,
                })
              }
            >
              <FontAwesomeIcon
                icon={settings.isAutoLaunch ? faPause : faPlay}
              />
            </button>
            <button
              onClick={handleManualLaunch}
              className={styles.launchButton}
            >
              <FontAwesomeIcon icon={faFire} />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

// 輔助函數：將十六進制顏色轉換為 RGB
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16
      )}`
    : '255, 255, 255'
}

export default Fireworks
