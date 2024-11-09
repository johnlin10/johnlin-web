import { useState, useRef, useCallback, useEffect } from 'react'
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

function ImageViewer() {
  const dispatch = useDispatch()
  const { t } = useTranslation('imageViewer')
  const { isViewerOpen, currentImage } = useSelector((state) => state.viewer)
  const [scale, setScale] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })

  const touchInfoRef = useRef({
    initialDistance: 0,
    initialScale: 1,
    lastCenter: { x: 0, y: 0 },
    lastScale: 1, // 新增：記錄上一次的縮放值
    lastTime: 0, // 新增：記錄上一次更新時間
  })

  useEffect(() => {
    return () => {
      touchInfoRef.current = {
        initialDistance: 0,
        initialScale: 1,
        lastCenter: { x: 0, y: 0 },
      }
    }
  }, [])

  const handleMouseDown = (e) => {
    setIsDragging(true)
    setStartPos({
      x: e.clientX - position.x * scale,
      y: e.clientY - position.y * scale,
    })
  }

  const handleMouseMove = (e) => {
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
    (e) => {
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
        }
      }
    },
    [scale, position]
  )

  const handleTouchMove = useCallback(
    (e) => {
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
            5
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

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
    touchInfoRef.current = {
      initialDistance: 0,
      initialScale: 1,
      lastCenter: { x: 0, y: 0 },
    }
  }, [])

  const handleZoom = (zoomIn) => {
    setScale((prevScale) => {
      const newScale = zoomIn ? prevScale + 0.2 : prevScale - 0.2
      return Math.min(Math.max(0.1, newScale), 5)
    })
  }

  useEffect(() => {
    const imageContainer = document.querySelector(`.${style.imageContainer}`)
    if (imageContainer) {
      imageContainer.addEventListener('wheel', handleWheel, { passive: false })
      return () => {
        imageContainer.removeEventListener('wheel', handleWheel)
      }
    }
  }, [])

  // 修改 handleWheel 的實作方式，移除 onWheel 綁定
  const handleWheel = useCallback((e) => {
    e.preventDefault()
    const resistance = 10
    const zoomDelta = 0.3 / resistance

    setScale((prevScale) => {
      if (prevScale <= 1 && e.deltaY > 0) {
        return prevScale
      }
      const newScale =
        e.deltaY < 0 ? prevScale + zoomDelta : prevScale - zoomDelta
      return Math.min(Math.max(0.1, newScale), 5)
    })
  }, [])

  // 如果檢視器未開啟，不渲染任何內容
  if (!isViewerOpen) return null

  return (
    <div className={style.imageViewer}>
      <div className={style.topBar}>
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
      </div>

      <div
        className={style.imageContainer}
        // onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <img
          src={currentImage.src}
          alt={currentImage.fileName}
          style={{
            transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
            transition: isDragging ? 'none' : 'transform 0.2s',
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
        />
      </div>

      <div className={style.zoomControls}>
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
          disabled={scale === 1}
        >
          <FontAwesomeIcon icon={faMaximize} />
        </button>
      </div>
    </div>
  )
}

export default ImageViewer
