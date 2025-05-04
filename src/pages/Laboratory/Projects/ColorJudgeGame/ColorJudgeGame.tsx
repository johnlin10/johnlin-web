import React from 'react'
import style from './ColorJudgeGame.module.scss'
import { useTranslation } from 'react-i18next'
import { useColorJudgeGame } from './hooks/useColorJudgeGame'
import { ColorName, GameRecord } from './types'

const ColorJudgeGame: React.FC = () => {
  const { t } = useTranslation(['colorJudgeGame'])
  const {
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
  } = useColorJudgeGame()

  // 格式化日期時間
  const formatDate = (dateStr: string) => {
    return dateStr
  }

  return (
    <div className={style.color_judge_game}>
      {!isStarted ? (
        // Game start
        <>
          <div className={style.intro_panel}>
            <p className={style.game_desc}>{t('description')}</p>
            <button className={style.start_btn} onClick={startGame}>
              {t('start')}
            </button>
          </div>

          {gameRecords.length > 0 && (
            <div className={style.history_panel}>
              <h3>{t('history')}</h3>
              <div className={style.history_list}>
                <div className={style.history_header}>
                  <span>{t('date')}</span>
                  <span>{t('score')}</span>
                  {/* <span>{t('time_played')}</span> */}
                </div>
                {gameRecords.map((record: GameRecord) => (
                  <div key={record.id} className={style.history_item}>
                    <span>{formatDate(record.date)}</span>
                    <span>{record.score}</span>
                    {/* <span>{record.timePlayed}s</span> */}
                  </div>
                ))}
              </div>
              <button className={style.clear_btn} onClick={clearGameRecords}>
                {t('clear_history')}
              </button>
            </div>
          )}
        </>
      ) : isGameOver ? (
        // Game over
        <div className={style.result_panel}>
          <h2>{t('game_over')}</h2>
          <div className={style.result_stats}>
            <div>
              <span>{t('final_score')}</span>
              <strong>{score}</strong>
            </div>
          </div>

          <div className={style.result_message}>
            {score > 20
              ? t('excellent')
              : score > 15
              ? t('great')
              : score > 10
              ? t('good')
              : score > 5
              ? t('try_harder')
              : t('practice_more')}
          </div>

          <button className={style.start_btn} onClick={startGame}>
            {t('play_again')}
          </button>
        </div>
      ) : question ? (
        // Game in progress
        <div className={style.question_panel}>
          <div className={style.status_bar}>
            <span>
              {t('score')}: {score}
            </span>
            <span
              className={style.question_time_left}
              data-urgent={questionTimeLeft <= 2}
            >
              {questionTimeLeft}
            </span>
            <span>
              {t('time_left')}: {timeLeft}
            </span>
          </div>
          <div
            className={style.question_bg}
            style={{
              backgroundColor: `var(--color-${question.backgroundColor})`,
            }}
          >
            <span
              className={style.question_text}
              style={{ color: `var(--color-${question.textColor})` }}
            >
              {t(`color.${question.textContent}`)}
            </span>
          </div>
          <div className={style.options_panel}>
            {question.options.map((color: string) => (
              <button
                key={color}
                className={style.option_btn}
                style={{
                  backgroundColor: `var(--color-${color})`,
                  color: `${
                    color === 'black'
                      ? `#f9f9f9`
                      : color === 'white'
                      ? `#131313`
                      : ''
                  }`,
                }}
                onClick={() => handleAnswer(color as ColorName)}
              >
                {t(`color.${color}`)}
              </button>
            ))}
          </div>
          {lastResult && (
            <div
              className={`${style.result_message} ${
                lastResult === 'correct' ? style.correct : style.wrong
              }`}
            >
              {t(lastResult)}
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}

export default ColorJudgeGame
