import style from './ScheduleModal.module.scss'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import type { Schedule, ScheduleFormData } from '../Calendar/schedule'
import { useSpring, animated } from '@react-spring/web'

interface ScheduleModalProps {
  schedule: Schedule | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (schedule: string, date: Partial<ScheduleFormData>) => Promise<void>
  onDelete: (schedule: string) => Promise<void>
}

function ScheduleModal({
  schedule,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
}: ScheduleModalProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const { t } = useTranslation()
  const [isEditing, setIsEditing] = useState(false)
  const [blockColor, setBlockColor] = useState(schedule?.colorName || 'none')

  // Edit refs
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const locationRef = useRef<HTMLParagraphElement>(null)

  // Spring
  const _spring_modal = useSpring({
    from: { opacity: 0, y: 50 },
    to: { opacity: 1, y: 0 },
    config: { duration: 500 },
  })

  // 保存原始內容
  const originalContent = useRef({
    title: '',
    description: '',
    location: '',
  })

  const colorMap: { [key: string]: string } = {
    none: 'var(--schedule-block-none)',
    red: 'var(--schedule-block-red)',
    green: 'var(--schedule-block-green)',
    blue: 'var(--schedule-block-blue)',
    yellow: 'var(--schedule-block-yellow)',
    purple: 'var(--schedule-block-purple)',
    orange: 'var(--schedule-block-orange)',
    pink: 'var(--schedule-block-pink)',
  }

  // 根據 URL 參數開啟編輯模式
  useEffect(() => {
    if (searchParams.get('edit') === 'true') {
      setIsEditing(true)
    }
  }, [searchParams])

  // 當開啟編輯模式時，儲存原始內容
  useEffect(() => {
    if (isEditing && schedule) {
      originalContent.current = {
        title: schedule.title,
        description: schedule.description || '',
        location: schedule.location || '',
      }
    }
  }, [isEditing, schedule])

  // 日程方塊顏色更換
  const handleColorChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setBlockColor(e.target.value)
      if (schedule) {
        onUpdate(schedule.id, { colorName: e.target.value })
      }
    },
    [schedule, onUpdate]
  )

  const handleCancelEdit = () => {
    // 恢復原始內容
    if (titleRef.current) {
      titleRef.current.textContent = originalContent.current.title
    }
    if (descriptionRef.current) {
      descriptionRef.current.textContent = originalContent.current.description
    }
    if (locationRef.current) {
      locationRef.current.textContent = originalContent.current.location
    }
    setIsEditing(false)
    setSearchParams({ scheduleId: schedule?.id || '' })
  }

  // 保存日程
  const handleSave = useCallback(async () => {
    if (!schedule) return

    try {
      await onUpdate(schedule.id, {
        title: titleRef.current?.textContent || '',
        description: descriptionRef.current?.textContent || '',
        location: locationRef.current?.textContent || '',
        colorName: schedule?.colorName || 'none',
      })
      setIsEditing(false)
    } catch (err) {
      console.error('更新失敗：', err)
    }
  }, [schedule, onUpdate])

  const handleDelete = async () => {
    if (!schedule) return

    if (window.confirm(t('confirm.delete_schedule', { ns: 'schedule' }))) {
      try {
        await onDelete(schedule.id)
        onClose()
      } catch (err) {
        console.error('刪除失敗：', err)
      }
    }
  }

  if (!isOpen || !schedule) return null

  return (
    <div className={style.modal_overlay}>
      <animated.div className={style.modal} style={_spring_modal}>
        <div className={style.modal_header}>
          <h2
            ref={titleRef}
            contentEditable={isEditing}
            suppressContentEditableWarning
            className={isEditing ? style.editable : ''}
            autoFocus
          >
            {schedule.title}
          </h2>
          <button className={style.close_button} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={style.modal_content}>
          <div className={style.schedule_details}>
            <div className={style.schedule_details_block}>
              <strong>{t('form.modal.time', { ns: 'schedule' })}</strong>
              <p>
                {schedule.startTime.toLocaleString()} -{' '}
                {schedule.endTime.toLocaleString()}
              </p>
            </div>

            <div className={style.schedule_details_block}>
              <strong>{t('form.modal.location', { ns: 'schedule' })}</strong>
              <p
                ref={locationRef}
                contentEditable={isEditing}
                suppressContentEditableWarning
                className={isEditing ? style.editable : ''}
              >
                {schedule.location}
              </p>
            </div>

            <div className={style.schedule_details_block}>
              <strong>{t('form.modal.description', { ns: 'schedule' })}</strong>
              <p
                ref={descriptionRef}
                contentEditable={isEditing}
                suppressContentEditableWarning
                className={isEditing ? style.editable : ''}
              >
                {schedule.description}
              </p>
            </div>

            <div className={style.schedule_details_block}>
              <strong>{t('form.modal.color', { ns: 'schedule' })}</strong>
              <select
                name="color"
                id="color"
                value={blockColor || schedule?.colorName}
                onChange={handleColorChange}
                style={{
                  backgroundColor: colorMap[blockColor || schedule?.colorName],
                }}
              >
                {Object.keys(colorMap).map((color) => (
                  <option
                    key={color}
                    value={color}
                    style={{ backgroundColor: colorMap[color] }}
                  >
                    {t(`colors.${color}`, { ns: 'schedule' })}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={style.button_group}>
            {isEditing ? (
              <>
                <button onClick={handleSave} className={style.save_button}>
                  {t('button.save', { ns: 'common' })}
                </button>
                <button
                  onClick={handleCancelEdit}
                  className={style.cancel_button}
                >
                  {t('button.cancel', { ns: 'common' })}
                </button>
              </>
            ) : (
              <>
                <button onClick={handleDelete} className={style.delete_button}>
                  {t('button.delete', { ns: 'common' })}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(true)
                    // 保留現有參數，並新增 edit 參數
                    setSearchParams({ scheduleId: schedule.id, edit: 'true' })
                  }}
                  className={style.edit_button}
                >
                  {t('button.edit', { ns: 'common' })}
                </button>
              </>
            )}
          </div>
        </div>
      </animated.div>
    </div>
  )
}

export default ScheduleModal
