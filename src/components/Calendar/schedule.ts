export interface Schedule {
  id: string
  title: string
  description?: string
  startTime: Date
  endTime: Date
  isAllDay: boolean
  color: string
  colorName: string
  createdAt: Date
  updatedAt: Date
  userId: string // 紀錄擁有者
  status?: 'active' | 'cancelled' | 'completed'
  location?: string
  reminder?: {
    enabled: boolean
    time: number // 提前提醒的分鐘數
  }
}

export interface ScheduleFormData {
  title: string
  description?: string
  startTime: Date
  endTime: Date
  isAllDay: boolean
  colorName: string
  location?: string
  reminder?: {
    enabled: boolean
    time: number
  }
  status?: 'active' | 'cancelled' | 'completed'
}

export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  allDay: boolean
  backgroundColor?: string
  borderColor?: string
  textColor?: string
  extendedProps?: {
    description?: string
    location?: string
    status?: string
  }
}
