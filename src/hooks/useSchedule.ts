import { useState, useEffect, useCallback } from 'react'
import { db } from '../firebase'
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  onSnapshot,
  deleteDoc,
  serverTimestamp,
  query,
  where,
} from 'firebase/firestore'
import { Link } from 'react-router-dom'
import useAuth from './useAuth'
import type {
  Schedule,
  ScheduleFormData,
} from '../components/Calendar/schedule'

export default function useSchedule() {
  const { currentUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [schedules, setSchedules] = useState<Schedule[]>([])

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
  const translateColor = (color: string) => colorMap[color]

  useEffect(() => {
    if (!currentUser) {
      setSchedules([])
      return
    }

    const schedulesRef = collection(db, `users/${currentUser.uid}/schedules`)
    const q = query(schedulesRef, where('status', '==', 'active'))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const scheduleData = snapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            ...data,
            // 確保日期資料被正確轉換為 Date 物件
            startTime: data.startTime?.toDate(),
            endTime: data.endTime?.toDate(),
            colorName: data.colorName || 'none',
            color: translateColor(data.colorName || 'none'),
          }
        }) as Schedule[]
        setSchedules(scheduleData)
      },
      (err) => {
        console.error('監聽日程失敗：', err)
        setError('載入日程失敗')
      }
    )
    return () => unsubscribe()
  }, [currentUser, translateColor])

  const addSchedule = useCallback(
    async (data: ScheduleFormData) => {
      if (!currentUser) {
        setError('NoLogin')
        return
      }

      setLoading(true)
      try {
        const scheduleRef = collection(db, `users/${currentUser.uid}/schedules`)
        const docRef = await addDoc(scheduleRef, {
          ...data,
          userId: currentUser.uid,
          status: 'active',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
        return docRef.id
      } catch (err) {
        setError('新增日程失敗')
        console.error(err)
      } finally {
        setLoading(false)
      }
    },
    [currentUser]
  )

  const updateSchedule = useCallback(
    async (scheduleId: string, data: Partial<ScheduleFormData>) => {
      if (!currentUser) {
        setError('請先登入')
        return
      }

      setLoading(true)
      try {
        const scheduleRef = doc(
          db,
          `users/${currentUser.uid}/schedules/${scheduleId}`
        )

        await updateDoc(scheduleRef, {
          ...data,
          updatedAt: serverTimestamp(),
        })
      } catch (err) {
        setError('更新日程失敗')
        console.error(err)
      } finally {
        setLoading(false)
      }
    },
    [currentUser]
  )

  const deleteSchedule = useCallback(
    async (scheduleId: string) => {
      if (!currentUser) {
        setError('請先登入')
        return
      }

      setLoading(true)
      try {
        const scheduleRef = doc(
          db,
          `users/${currentUser.uid}/schedules/${scheduleId}`
        )
        await deleteDoc(scheduleRef)
      } catch (err) {
        setError('刪除日程失敗')
        console.error(err)
      } finally {
        setLoading(false)
      }
    },
    [currentUser]
  )

  return {
    loading,
    error,
    schedules,
    addSchedule,
    updateSchedule,
    deleteSchedule,
  }
}
