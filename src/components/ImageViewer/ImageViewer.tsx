import React, { useState, useRef, useCallback, useEffect } from 'react'
import { RootState } from '../../redux/store'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { closeViewer } from '../../redux/viewerSlice'
import style from './ImageViewer.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faXmark,
  faPlus,
  faMinus,
  faMaximize,
} from '@fortawesome/free-solid-svg-icons'

import { useSpring, animated } from '@react-spring/web'

function ImageViewer(): JSX.Element {
  const dispatch = useDispatch()
  const { t } = useTranslation('imageViewer')
  const { isViewerOpen, currentImage } = useSelector(
    (state: RootState) => state.viewer
  )
  const [scale, setScale] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })

  const touchInfoRef = useRef({
    initialDistance: 0,
    initialScale: 1,
    lastCenter: { x: 0, y: 0 },
    lastScale: 1,
    lastTime: 0,
  })

  // animation
  const _spring_image_container = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 100 },
  })
  const _spring_header = useSpring({
    from: { transform: 'translateY(-100%)' },
    to: { transform: 'translateY(0)' },
  })
  const _spring_zoom_controls = useSpring({
    from: { transform: 'translateY(100%)' },
    to: { transform: 'translateY(0)' },
  })

  useEffect(() => {
    return () => {
      touchInfoRef.current = {
        initialDistance: 0,
        initialScale: 1,
        lastCenter: { x: 0, y: 0 },
        lastScale: 1,
        lastTime: 0,
      }
    }
  }, [])

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true)
    setStartPos({
      x: e.clientX - position.x * scale,
      y: e.clientY - position.y * scale,
    })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return
    setPosition({
      x: (e.clientX - startPos.x) / scale,
      y: (e.clientY - startPos.y) / scale,
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0]
        setIsDragging(true)
        setStartPos({
          x: touch.clientX - position.x * scale,
          y: touch.clientY - position.y * scale,
        })
      } else if (e.touches.length === 2) {
        const touch1 = e.touches[0]
        const touch2 = e.touches[1]

        const distance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        )

        const centerX = (touch1.clientX + touch2.clientX) / 2
        const centerY = (touch1.clientY + touch2.clientY) / 2

        touchInfoRef.current = {
          initialDistance: distance,
          initialScale: scale,
          lastCenter: { x: centerX, y: centerY },
          lastScale: scale,
          lastTime: Date.now(),
        }
      }
    },
    [scale, position]
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (e.touches.length === 1 && isDragging) {
        const touch = e.touches[0]
        setPosition({
          x: (touch.clientX - startPos.x) / scale,
          y: (touch.clientY - startPos.y) / scale,
        })
      } else if (e.touches.length === 2) {
        const touch1 = e.touches[0]
        const touch2 = e.touches[1]
        const { initialDistance, initialScale, lastCenter } =
          touchInfoRef.current

        // 計算新的中心點和距離
        const currentCenterX = (touch1.clientX + touch2.clientX) / 2
        const currentCenterY = (touch1.clientY + touch2.clientY) / 2
        const currentDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        )

        // 計算新的縮放比例（最小為 1，最大為 5）
        const newScale = Math.max(
          1,
          Math.min(
            Math.max(1, (currentDistance / initialDistance) * initialScale),
            10
          )
        )

        // 計算位移
        const deltaX = currentCenterX - lastCenter.x
        const deltaY = currentCenterY - lastCenter.y

        // 批次更新狀態以提高效能
        requestAnimationFrame(() => {
          setScale(newScale)
          setPosition((prev) => ({
            x: prev.x + deltaX / newScale,
            y: prev.y + deltaY / newScale,
          }))
        })

        // 更新最後的中心點
        touchInfoRef.current.lastCenter = {
          x: currentCenterX,
          y: currentCenterY,
        }
      }
    },
    [isDragging, scale, startPos]
  )

  const handleTouchEnd = useCallback((): void => {
    setIsDragging(false)
    touchInfoRef.current = {
      initialDistance: 0,
      initialScale: 1,
      lastCenter: { x: 0, y: 0 },
      lastScale: 1,
      lastTime: 0,
    }
  }, [])

  const handleZoom = (zoomIn: boolean): void => {
    setScale((prevScale) => {
      const newScale = zoomIn ? prevScale + 0.2 : prevScale - 0.2
      return Math.min(Math.max(0.1, newScale), 10)
    })
  }

  // useEffect(() => {
  //   const imageContainer = document.querySelector(`.${style.imageContainer}`)
  //   if (imageContainer) {
  //     const wheelHandler = (e: WheelEvent) => {
  //       e.preventDefault()
  //       const resistance = 10
  //       const zoomDelta = 0.3 / resistance

  //       setScale((prevScale) => {
  //         if (prevScale <= 1 && e.deltaY > 0) return prevScale
  //         const newScale =
  //           e.deltaY < 0 ? prevScale + zoomDelta : prevScale - zoomDelta
  //         return Math.min(Math.max(0.1, newScale), 5)
  //       })
  //     }

  //     imageContainer.addEventListener('wheel', wheelHandler as EventListener, {
  //       passive: false,
  //     })

  //     return () => {
  //       imageContainer.removeEventListener(
  //         'wheel',
  //         wheelHandler as EventListener
  //       )
  //     }
  //   }
  // }, [])

  // 修改 handleWheel 的實作方式，移除 onWheel 綁定
  const handleWheel = useCallback((e: React.WheelEvent<HTMLElement>): void => {
    e.preventDefault()
    const resistance = 10
    const zoomDelta = 0.3 / resistance

    setScale((prevScale) => {
      if (prevScale <= 1 && e.deltaY > 0) {
        return prevScale
      }
      const newScale =
        e.deltaY < 0 ? prevScale + zoomDelta : prevScale - zoomDelta
      return Math.min(Math.max(0.1, newScale), 10)
    })
  }, [])

  // 如果檢視器未開啟，不渲染任何內容
  if (!isViewerOpen) return <></>

  return (
    <animated.div className={style.imageViewer} style={_spring_image_container}>
      <animated.div className={style.topBar} style={_spring_header}>
        <span className={style.fileName}>{currentImage.fileName}</span>
        <button
          className={style.closeButton}
          onClick={() => {
            setScale(1)
            setIsDragging(false)
            setPosition({ x: 0, y: 0 })
            setStartPos({ x: 0, y: 0 })
            dispatch(closeViewer())
          }}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </animated.div>

      <div
        className={style.imageContainer}
        onWheel={(e) => {
          e.preventDefault()
          handleWheel(e)
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <animated.img
          src={currentImage.src}
          alt={currentImage.fileName}
          style={{
            transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
            transition: isDragging ? 'none' : 'transform 0.2s',
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
        />
      </div>

      <animated.div
        className={style.zoomControls}
        style={_spring_zoom_controls}
      >
        <button onClick={() => handleZoom(true)} title={t('zoomIn')}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
        <p>{scale.toFixed(1)}</p>
        <button
          onClick={() => handleZoom(false)}
          title={t('zoomOut')}
          disabled={scale <= 1}
        >
          <FontAwesomeIcon icon={faMinus} />
        </button>
        <button
          className={style.reset}
          onClick={() => {
            setScale(1)
            setIsDragging(false)
            setPosition({ x: 0, y: 0 })
            setStartPos({ x: 0, y: 0 })
          }}
          title={t('reset')}
          disabled={scale === 1 && (position.x === 0 || position.y === 0)}
        >
          <FontAwesomeIcon icon={faMaximize} />
        </button>
      </animated.div>
    </animated.div>
  )
}

export default ImageViewer
