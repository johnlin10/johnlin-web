import { useState, useEffect, useCallback, useMemo } from 'react'
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
  orderBy,
} from 'firebase/firestore'
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

  const colorMap = useMemo(
    () =>
      ({
        none: 'var(--schedule-block-none)',
        red: 'var(--schedule-block-red)',
        green: 'var(--schedule-block-green)',
        blue: 'var(--schedule-block-blue)',
        yellow: 'var(--schedule-block-yellow)',
        purple: 'var(--schedule-block-purple)',
        orange: 'var(--schedule-block-orange)',
        pink: 'var(--schedule-block-pink)',
      } as { [key: string]: string }),
    []
  )

  const translateColor = useCallback(
    (color: string) => colorMap[color as keyof typeof colorMap],
    [colorMap]
  )

  // 監聽日程表
  useEffect(() => {
    if (!currentUser) {
      setSchedules([])
      return
    }

    // 取得日程表
    const schedulesRef = collection(db, `users/${currentUser.uid}/schedules`)
    const q = query(
      schedulesRef,
      where('status', '==', 'active'),
      orderBy('startTime', 'asc')
    )

    // 監聽日程表
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const scheduleData = snapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            ...data,
            startTime: data.startTime?.toDate(),
            endTime: data.endTime?.toDate(),
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate(),
            colorName: data.colorName || 'none',
            color: translateColor(data.colorName || 'none'),
          }
        }) as Schedule[]
        setSchedules(scheduleData)
        setError(null)
      },
      (err) => {
        console.error('監聽日程失敗：', err)
        setError('載入日程失敗')
      }
    )
    return () => unsubscribe()
  }, [currentUser, translateColor])

  // 新增日程表
  const addSchedule = useCallback(
    async (data: ScheduleFormData) => {
      if (!currentUser) {
        setError('請先登入')
        return
      }

      setLoading(true)
      setError(null)
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
        console.error('新增日程失敗：', err)
        setError('新增日程失敗')
        throw err
      } finally {
        setLoading(false)
      }
    },
    [currentUser]
  )

  // 更新日程表
  const updateSchedule = useCallback(
    async (scheduleId: string, data: Partial<ScheduleFormData>) => {
      if (!currentUser) {
        setError('請先登入')
        return
      }

      setLoading(true)
      setError(null)
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
        console.error('更新日程失敗：', err)
        setError('更新日程失敗')
        throw err
      } finally {
        setLoading(false)
      }
    },
    [currentUser]
  )

  // 刪除日程表
  const deleteSchedule = useCallback(
    async (scheduleId: string) => {
      if (!currentUser) {
        setError('請先登入')
        return
      }

      setLoading(true)
      setError(null)
      try {
        const scheduleRef = doc(
          db,
          `users/${currentUser.uid}/schedules/${scheduleId}`
        )
        await updateDoc(scheduleRef, {
          status: 'cancelled',
          updatedAt: serverTimestamp(),
        })
      } catch (err) {
        console.error('刪除日程失敗：', err)
        setError('刪除日程失敗')
        throw err
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
