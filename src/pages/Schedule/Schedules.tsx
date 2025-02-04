import { useState, useEffect, useCallback, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import style from './Schedules.module.scss'
import Calendar from '../../components/Calendar/Calendar'
import useSchedule from '../../hooks/useSchedule'
import { Schedule } from '../../components/Calendar/schedule'
import ScheduleModal from '../../components/ScheduleModal/ScheduleModal'

function Schedules() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { t } = useTranslation()
  const {
    loading,
    error,
    schedules,
    addSchedule,
    updateSchedule,
    deleteSchedule,
  } = useSchedule()
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  )
  const [isModalOpen, setIsModalOpen] = useState(false)

  const memoizedSchedules = useMemo(() => schedules, [schedules])

  //* 監聽 URL 參數變化
  useEffect(() => {
    const scheduleId = searchParams.get('scheduleId')
    if (scheduleId && memoizedSchedules.length > 0) {
      const schedule = memoizedSchedules.find((s) => s.id === scheduleId)
      if (schedule) {
        setSelectedSchedule(schedule)
        setIsModalOpen(true)
      }
    }
  }, [searchParams, memoizedSchedules])

  // 日程點擊事件
  const handleEventClick = useCallback(
    (scheduleId: string) => {
      setSearchParams({ scheduleId })
    },
    [setSearchParams]
  )

  // 關閉日程視窗
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedSchedule(null)
    setSearchParams({})
  }, [setSearchParams])

  // 拖動日程
  const handleEventDrop = useCallback(
    async (scheduleId: string, start: Date, end: Date) => {
      try {
        await updateSchedule(scheduleId, { startTime: start, endTime: end })
      } catch (err) {
        console.error('更新日程失敗：', err)
      }
    },
    [updateSchedule]
  )

  // 日程縮放
  const handleEventResize = useCallback(
    async (scheduleId: string, start: Date, end: Date) => {
      try {
        await updateSchedule(scheduleId, { startTime: start, endTime: end })
      } catch (err) {
        console.error('更新日程失敗：', err)
      }
    },
    [updateSchedule]
  )

  //* 新增日程
  const handleAddSchedule = useCallback(async () => {
    const todayBegin = new Date().setHours(0, 0, 0, 0)
    const todayEnd = new Date(todayBegin).setHours(23, 59, 59, 99)

    try {
      const newScheduleId = await addSchedule({
        title: '',
        description: '',
        startTime: new Date(todayBegin),
        endTime: new Date(todayEnd),
        isAllDay: true,
        colorName: 'none',
        location: '',
        status: 'active',
      })

      if (newScheduleId) {
        setSearchParams({ scheduleId: newScheduleId, edit: 'true' })
      }
    } catch (err) {
      console.error('新增日程失敗：', err)
    }
  }, [addSchedule, setSearchParams])

  return (
    <div className={style.schedule}>
      <Calendar
        schedule={memoizedSchedules}
        onEventDrop={handleEventDrop}
        onEventResize={handleEventResize}
        onEventClick={handleEventClick}
      />
      {isModalOpen && selectedSchedule && (
        <ScheduleModal
          schedule={selectedSchedule}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onUpdate={updateSchedule}
          onDelete={deleteSchedule}
        />
      )}

      {loading && (
        <div className={style.loading}>
          {t('status.loading', { ns: 'common' })}...
        </div>
      )}
      {error && (
        <div className={style.error}>
          {error === 'NoLogin' ? (
            <Link to="/user">{t('alert.pls_login', { ns: 'common' })}</Link>
          ) : (
            error
          )}
        </div>
      )}
      <div className={style.toolbar}>
        <button className={style.addButton} onClick={handleAddSchedule}>
          {t('form.add_schedule', { ns: 'schedule' })}
        </button>
      </div>
    </div>
  )
}

export default Schedules
