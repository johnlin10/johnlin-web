import { useState, useCallback, useEffect, useRef } from 'react'
import { ColorName, ColorQuestion, GameRecord } from '../types'

const COLORS: ColorName[] = [
  'red',
  'green',
  'blue',
  'yellow',
  'purple',
  'orange',
  'black',
  'white',
]
const QUESTION_TIME = 5 // 每題秒數
const GAME_TIME = 60 // 遊戲總秒數
const OPTION_COUNT = 4
const LOCAL_STORAGE_KEY = 'colorJudgeGameHistory'

export function useColorJudgeGame() {
  const [isStarted, setIsStarted] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_TIME)
  const [question, setQuestion] = useState<ColorQuestion | null>(null)
  const [lastResult, setLastResult] = useState<'correct' | 'wrong' | null>(null)
  const [gameRecords, setGameRecords] = useState<GameRecord[]>([])
  const [gameStartTime, setGameStartTime] = useState<number>(0)
  const [questionTimeLeft, setQuestionTimeLeft] = useState(QUESTION_TIME)

  // 使用 useRef 保存遊戲開始時間和問題開始時間的時間戳
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const questionTimerRef = useRef<NodeJS.Timeout | null>(null)
  const gameStartTimeRef = useRef<number>(0)
  const questionStartTimeRef = useRef<number>(0)
  const gameEndTimeRef = useRef<number>(0)

  // 從 localStorage 載入歷史紀錄
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (savedHistory) {
        setGameRecords(JSON.parse(savedHistory))
      }
    } catch (error) {
      console.error('載入遊戲紀錄失敗', error)
    }
  }, [])

  // 產生一題
  const generateQuestion = useCallback((): ColorQuestion => {
    // 重置問題計時器
    setQuestionTimeLeft(QUESTION_TIME)
    questionStartTimeRef.current = Date.now()

    // 隨機選一個顏色作為文字內容（背景色）
    const textContent = COLORS[Math.floor(Math.random() * COLORS.length)]
    const backgroundColor = textContent
    // 隨機選一個不同於背景色的顏色作為文字顏色
    let textColor: ColorName
    do {
      textColor = COLORS[Math.floor(Math.random() * COLORS.length)]
    } while (textColor === backgroundColor)
    // 選項：包含正確答案，其他為不重複顏色
    const options = [textColor]
    while (options.length < OPTION_COUNT) {
      const c = COLORS[Math.floor(Math.random() * COLORS.length)]
      if (!options.includes(c)) options.push(c)
    }
    // 洗牌
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[options[i], options[j]] = [options[j], options[i]]
    }
    return {
      backgroundColor,
      textColor,
      textContent,
      options,
      correctAnswer: textColor,
    }
  }, [])

  // 儲存遊戲紀錄
  const saveGameRecord = useCallback(
    (score: number, playTime: number) => {
      const newRecord: GameRecord = {
        id: Date.now().toString(),
        date: new Date().toLocaleString(),
        score,
        timePlayed: playTime,
      }

      const updatedRecords = [newRecord, ...gameRecords].slice(0, 10) // 最多保留 10 筆
      setGameRecords(updatedRecords)

      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedRecords))
      } catch (error) {
        console.error('儲存遊戲紀錄失敗', error)
      }
    },
    [gameRecords]
  )

  // 開始遊戲
  const startGame = useCallback(() => {
    const now = Date.now()
    setIsStarted(true)
    setIsGameOver(false)
    setScore(0)
    setTimeLeft(GAME_TIME)
    setLastResult(null)
    setQuestionTimeLeft(QUESTION_TIME)

    // 設定遊戲和問題的開始時間
    gameStartTimeRef.current = now
    questionStartTimeRef.current = now
    setGameStartTime(now)

    setQuestion(generateQuestion())
  }, [generateQuestion])

  // 答題
  const handleAnswer = useCallback(
    (color: ColorName) => {
      if (!question) return

      if (color === question.correctAnswer) {
        setScore((s) => s + 1)
        setLastResult('correct')
      } else {
        setLastResult('wrong')
      }

      // 清除當前問題計時器
      if (questionTimerRef.current) {
        clearInterval(questionTimerRef.current)
        questionTimerRef.current = null
      }

      setTimeout(() => {
        setLastResult(null)
        setQuestion(generateQuestion())
      }, 1000)
    },
    [question, generateQuestion]
  )

  // 清除歷史紀錄
  const clearGameRecords = useCallback(() => {
    setGameRecords([])
    localStorage.removeItem(LOCAL_STORAGE_KEY)
  }, [])

  // 更新問題倒數時間
  const updateQuestionTime = useCallback(() => {
    if (!isStarted || isGameOver || !question) return

    const now = Date.now()
    const elapsed = Math.floor((now - questionStartTimeRef.current) / 1000)
    const remaining = Math.max(0, QUESTION_TIME - elapsed)

    setQuestionTimeLeft(remaining)

    // 如果時間到，標記為答錯並前往下一題
    if (remaining === 0) {
      setLastResult('wrong')

      setTimeout(() => {
        setLastResult(null)
        setQuestion(generateQuestion())
      }, 0)
    }
  }, [isStarted, isGameOver, question, generateQuestion])

  // 更新遊戲倒數時間
  const updateGameTime = useCallback(() => {
    if (!isStarted || isGameOver) return

    const now = Date.now()
    const elapsed = Math.floor((now - gameStartTimeRef.current) / 1000)
    const remaining = Math.max(0, GAME_TIME - elapsed)

    setTimeLeft(remaining)

    // 如果遊戲時間到，結束遊戲
    if (remaining === 0) {
      gameEndTimeRef.current = now
      setIsGameOver(true)
      setIsStarted(false)

      // 清除計時器
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }

      if (questionTimerRef.current) {
        clearInterval(questionTimerRef.current)
        questionTimerRef.current = null
      }

      // 計算遊戲時間並儲存紀錄
      const playTime = Math.round((now - gameStartTimeRef.current) / 1000)
      saveGameRecord(score, playTime)
    }
  }, [isStarted, isGameOver, score, saveGameRecord])

  // 設定計時器
  useEffect(() => {
    if (!isStarted || isGameOver) return

    // 問題計時器 - 每 100ms 更新一次，提高精確度
    questionTimerRef.current = setInterval(updateQuestionTime, 100)

    // 遊戲計時器 - 每 100ms 更新一次，提高精確度
    timerRef.current = setInterval(updateGameTime, 100)

    return () => {
      if (questionTimerRef.current) {
        clearInterval(questionTimerRef.current)
        questionTimerRef.current = null
      }

      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [isStarted, isGameOver, updateQuestionTime, updateGameTime])

  // 遊戲結束時清除題目
  useEffect(() => {
    if (isGameOver) setQuestion(null)
  }, [isGameOver])

  return {
    question,
    score,
    timeLeft,
    questionTimeLeft,
    isGameOver,
    isStarted,
    handleAnswer,
    startGame,
    lastResult,
    gameRecords,
    clearGameRecords,
  }
}
