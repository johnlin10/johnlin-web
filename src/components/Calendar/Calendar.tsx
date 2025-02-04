import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
// import { EventDragStartArg } from '@fullcalendar/interaction'
import zhTWLocale from '@fullcalendar/core/locales/zh-tw'
import enGBLocale from '@fullcalendar/core/locales/en-gb'

import useSchedule from '../../hooks/useSchedule'
import style from './Calendar.module.scss'

import type { Schedule, CalendarEvent } from './schedule'
import { EventDropArg } from '@fullcalendar/core'

interface CalendarProps {
  schedule: Schedule[]
  selectedDate?: Date
  onDateSelect?: (date: Date) => void
  onEventClick?: (scheduleId: string) => void
  onEventDrop?: (scheduleId: string, start: Date, end: Date) => void
  onEventResize?: (scheduleId: string, start: Date, end: Date) => void
}

function Calendar({
  schedule,
  selectedDate = new Date(),
  onDateSelect,
  onEventClick,
  onEventDrop,
  onEventResize,
}: CalendarProps) {
  const { i18n } = useTranslation()
  const { updateSchedule } = useSchedule()

  const events: CalendarEvent[] = useMemo(
    () =>
      schedule.map((item) => ({
        id: item.id,
        title: item.title,
        start:
          item.startTime instanceof Date
            ? item.startTime
            : new Date(item.startTime),
        end:
          item.endTime instanceof Date ? item.endTime : new Date(item.endTime),
        allDay: item.isAllDay,
        backgroundColor: item.color || '#4CAF50',
        borderColor: item.color || '#4CAF50',
        extendedProps: {
          description: item.description,
          location: item.location,
          status: item.status,
        },
      })),
    [schedule]
  )

  // 日程拖動
  const handleEventDrop = useCallback(
    (dropInfo: any) => {
      const { event } = dropInfo

      // 確保有新的開始和結束時間
      if (!event.start) return

      // 呼叫父組件的回調
      onEventDrop?.(event.id, event.start, event.end)
    },
    [onEventDrop]
  )

  // 日程縮放
  const handleEventResize = useCallback(
    (info: any) => {
      onEventResize?.(
        info.event.id,
        info.event.start || new Date(),
        info.event.end || new Date()
      )
      updateSchedule(info.event.id, {
        startTime: info.event.start || new Date(),
        endTime: info.event.end || new Date(),
      })
    },
    [onEventResize, updateSchedule]
  )

  return (
    <div className={style.calendar}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        initialDate={selectedDate}
        dateClick={(info) => onDateSelect?.(info.date)}
        headerToolbar={{
          left: 'title',
          right: 'today prev,next',
        }}
        locale={i18n.language === 'en-US' ? enGBLocale : zhTWLocale}
        selectable={true}
        editable={true}
        // 拖動功能開發出現一些技術問題，暫時停用
        // droppable={true}
        // eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        eventClick={(info) => onEventClick?.(info.event.id)}
      />
    </div>
  )
}

export default Calendar
