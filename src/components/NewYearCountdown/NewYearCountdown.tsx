import { useEffect, useState } from 'react'
import style from './NewYearCountdown.module.scss'

import moment from 'moment'
import { animated, easings, useSpring } from '@react-spring/web'

function NewYearCountdown() {
  const [targetTime] = useState(moment('2025-1-1 00:00:00'))
  // const [targetTime] = useState(moment(moment().add(10, 'seconds')))
  const [count, setCount] = useState<number | null>(null)
  const [isTimeUp, setIsTimeUp] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      const now = moment()
      const diff = targetTime.diff(now, 'seconds')

      if (diff <= 60 && diff > 0) {
        setCount(diff)
      } else if (diff <= 0) {
        setCount(0)
        setIsTimeUp(true)
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [targetTime])

  useEffect(() => {
    if (isTimeUp) {
      const event = new CustomEvent('countdownComplete')
      window.dispatchEvent(event)
    }
  }, [isTimeUp])

  if (count === null) return null
  return (
    <div className={style.newYearCountdown}>
      <CountdownNumber key={count} count={count} />
    </div>
  )
}

const CountdownNumber = ({ count }: { count: number }) => {
  const _spring_countdown = useSpring({
    from: { opacity: 1, transform: 'scale(1)' },
    to: { opacity: 0, transform: 'scale(15)' },
    config: { duration: 1000, easing: easings.easeOutCubic },
  })

  return (
    <animated.p className={style.countdownNumber} style={_spring_countdown}>
      {count}
    </animated.p>
  )
}

export default NewYearCountdown
