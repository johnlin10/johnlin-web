import { useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import style from './Schedules.module.scss'
import Calendar from '../../../../components/Calendar/Calendar'
import {
  Schedule,
  ScheduleFormData,
} from '../../../../components/Calendar/schedule'
import ScheduleModal from '../../../../components/ScheduleModal/ScheduleModal'
// import ScheduleImageUploader from '../../../../components/ScheduleImageUploader/ScheduleImageUploader'
import ScheduleDetectedModal from '../../../../components/ScheduleDetectedModal/ScheduleDetectedModal'
import useSchedule from '../../../../hooks/useSchedule'

// Smart Calendar Page
function Schedules() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { schedules, addSchedule, updateSchedule, deleteSchedule } =
    useSchedule()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetectedModalOpen, setIsDetectedModalOpen] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  )
  const [detectedSchedules, setDetectedSchedules] = useState<
    ScheduleFormData[]
  >([])

  // 處理日期選擇
  const handleDateSelect = useCallback((date: Date) => {
    setSelectedSchedule({
      id: '',
      title: '',
      startTime: date,
      endTime: new Date(date.getTime() + 60 * 60 * 1000), // 預設一小時
      isAllDay: false,
      color: '',
      colorName: 'none',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: '',
    })
    setIsModalOpen(true)
  }, [])

  // 處理事件點擊
  const handleEventClick = useCallback(
    (scheduleId: string) => {
      const schedule = schedules.find((s) => s.id === scheduleId)
      if (schedule) {
        setSelectedSchedule(schedule)
        setIsModalOpen(true)
      }
    },
    [schedules]
  )

  // 處理事件拖動
  const handleEventDrop = useCallback(
    async (scheduleId: string, start: Date, end: Date) => {
      try {
        await updateSchedule(scheduleId, {
          startTime: start,
          endTime: end,
        })
      } catch (err) {
        console.error('更新日程時間失敗：', err)
      }
    },
    [updateSchedule]
  )

  // 處理事件縮放
  const handleEventResize = useCallback(
    async (scheduleId: string, start: Date, end: Date) => {
      try {
        await updateSchedule(scheduleId, {
          startTime: start,
          endTime: end,
        })
      } catch (err) {
        console.error('更新日程時間失敗：', err)
      }
    },
    [updateSchedule]
  )

  // 處理日程更新
  const handleScheduleUpdate = useCallback(
    async (scheduleId: string, data: Partial<ScheduleFormData>) => {
      try {
        await updateSchedule(scheduleId, data)
        return true
      } catch (err) {
        console.error('更新日程失敗：', err)
        return false
      }
    },
    [updateSchedule]
  )

  // 處理日程刪除
  const handleScheduleDelete = useCallback(
    async (scheduleId: string) => {
      try {
        await deleteSchedule(scheduleId)
        setIsModalOpen(false)
        return true
      } catch (err) {
        console.error('刪除日程失敗：', err)
        return false
      }
    },
    [deleteSchedule]
  )

  // 處理新增日程
  const handleAddSchedule = useCallback(async () => {
    const newSchedule: ScheduleFormData = {
      id: crypto.randomUUID(),
      title: t('form.new_schedule', { ns: 'schedule' }),
      startTime: new Date(),
      endTime: new Date(new Date().getTime() + 60 * 60 * 1000),
      isAllDay: false,
      colorName: 'none',
    }

    try {
      await addSchedule(newSchedule)
    } catch (err) {
      console.error('新增日程失敗：', err)
    }
  }, [addSchedule, t])

  // 處理檢測到的日程
  const handleSchedulesDetected = useCallback(
    (schedules: ScheduleFormData[]) => {
      setDetectedSchedules(schedules)
      setIsDetectedModalOpen(true)
    },
    []
  )

  // 處理確認新增檢測到的日程
  const handleConfirmDetectedSchedules = useCallback(
    async (selectedSchedules: ScheduleFormData[]) => {
      try {
        await Promise.all(
          selectedSchedules.map((schedule) => addSchedule(schedule))
        )
      } catch (err) {
        console.error('新增檢測到的日程失敗：', err)
      }
    },
    [addSchedule]
  )

  return (
    <div className={style.schedule}>
      <Calendar
        schedule={schedules}
        onDateSelect={handleDateSelect}
        onEventDrop={handleEventDrop}
        onEventResize={handleEventResize}
        onEventClick={handleEventClick}
      />
      {isModalOpen && selectedSchedule && (
        <ScheduleModal
          schedule={selectedSchedule}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onUpdate={handleScheduleUpdate}
          onDelete={handleScheduleDelete}
        />
      )}

      {isDetectedModalOpen && (
        <ScheduleDetectedModal
          isOpen={isDetectedModalOpen}
          onClose={() => setIsDetectedModalOpen(false)}
          detectedSchedules={detectedSchedules}
          onConfirm={handleConfirmDetectedSchedules}
        />
      )}

      {/* <div className={style.toolbar}>
        <button className={style.addButton} onClick={handleAddSchedule}>
          {t('form.add_schedule', { ns: 'schedule' })}
        </button>
        <ScheduleImageUploader onSchedulesDetected={handleSchedulesDetected} />
      </div> */}
    </div>
  )
}

export default Schedules
