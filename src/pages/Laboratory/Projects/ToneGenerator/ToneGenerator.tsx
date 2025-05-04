import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { animated, useSpring } from '@react-spring/web'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlay,
  faPause,
  faVolumeHigh,
  faVolumeLow,
} from '@fortawesome/free-solid-svg-icons'
import Metadata from '../../../../utils/metadata'
import style from './ToneGenerator.module.scss'

function ToneGenerator(): JSX.Element {
  const { t } = useTranslation(['toneGenerator'])
  const [frequency, setFrequency] = useState<number>(440)
  const [volume, setVolume] = useState<number>(0.5)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [waveType, setWaveType] = useState<OscillatorType>('sine')
  const audioContextRef = useRef<AudioContext | null>(null)
  const oscillatorRef = useRef<OscillatorNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)

  // 預設頻率選項
  const frequencyPresets = [
    { value: 60, label: '60Hz' },
    { value: 100, label: '100Hz' },
    { value: 349.23, label: 'F4 | 349.23Hz' },
    { value: 392, label: 'G4 | 392Hz' },
    { value: 440, label: 'A4 | 440Hz' },
    { value: 493.88, label: 'B4 | 493.88Hz' },
    { value: 523.25, label: 'C5 | 523.25Hz' },
    { value: 587.33, label: 'D5 | 587.33Hz' },
    { value: 659.25, label: 'E5 | 659.25Hz' },
    { value: 698.46, label: 'F5 | 698.46Hz' },
    { value: 1000, label: '1000Hz' },
    { value: 10000, label: '10 kHz' },
    { value: 18000, label: '18 kHz' },
  ]

  // 波形選項
  const waveTypes: OscillatorType[] = ['sine', 'square', 'sawtooth', 'triangle']

  // 啟動音頻上下文
  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)()
    }
  }

  // 開始播放音頻
  const startTone = () => {
    initAudio()

    if (audioContextRef.current) {
      // 如果已經有一個振盪器在運行，先停止它
      if (oscillatorRef.current) {
        oscillatorRef.current.stop()
        oscillatorRef.current.disconnect()
        oscillatorRef.current = null
      }

      // 創建音量節點
      gainNodeRef.current = audioContextRef.current.createGain()
      gainNodeRef.current.gain.value = volume
      gainNodeRef.current.connect(audioContextRef.current.destination)

      // 創建振盪器
      oscillatorRef.current = audioContextRef.current.createOscillator()
      oscillatorRef.current.type = waveType
      oscillatorRef.current.frequency.value = frequency
      oscillatorRef.current.connect(gainNodeRef.current)
      oscillatorRef.current.start()

      setIsPlaying(true)
    }
  }

  // 停止播放音頻
  const stopTone = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop()
      oscillatorRef.current.disconnect()
      oscillatorRef.current = null
      setIsPlaying(false)
    }
  }

  // 控制播放/暫停
  const togglePlay = () => {
    if (isPlaying) {
      stopTone()
    } else {
      startTone()
    }
  }

  // 更新頻率
  const handleFrequencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFrequency = parseFloat(e.target.value)
    setFrequency(newFrequency)

    if (isPlaying && oscillatorRef.current) {
      oscillatorRef.current.frequency.value = newFrequency
    }
  }

  // 更新音量
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)

    if (isPlaying && gainNodeRef.current) {
      gainNodeRef.current.gain.value = newVolume
    }
  }

  // 更新波形
  const handleWaveTypeChange = (type: OscillatorType) => {
    setWaveType(type)

    if (isPlaying && oscillatorRef.current) {
      oscillatorRef.current.type = type
    }
  }

  // 選擇預設頻率
  const selectPreset = (preset: number) => {
    setFrequency(preset)

    if (isPlaying && oscillatorRef.current) {
      oscillatorRef.current.frequency.value = preset
    }
  }

  // 清理
  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop()
        oscillatorRef.current.disconnect()
      }
      if (
        audioContextRef.current &&
        audioContextRef.current.state !== 'closed'
      ) {
        audioContextRef.current.close()
      }
    }
  }, [])

  return (
    <div className={style.tone_generator}>
      <Metadata
        title={`${t('tools.toneGenerator.title')} | ${t('title', {
          ns: 'laboratory',
        })}`}
        description={t('tools.toneGenerator.description')}
      />
      <div className={style.container}>
        <div className={style.header}>
          <p>{t('description')}</p>
        </div>

        <div className={style.control_panel}>
          <div className={style.frequency_section}>
            <div className={style.current_frequency}>
              <input
                type="number"
                min="20"
                max="20000"
                value={frequency}
                onChange={handleFrequencyChange}
                className={style.frequency_number}
              />
              <span> Hz</span>
            </div>

            <div className={style.slider_container}>
              <span className={style.slider_label}>20 Hz</span>
              <input
                type="range"
                min="20"
                max="20000"
                step="1"
                value={frequency}
                onChange={handleFrequencyChange}
                className={style.frequency_slider}
              />
              <span className={style.slider_label}>20 kHz</span>
            </div>

            {/* <div className={style.frequency_input}>
              <input
                type="number"
                min="20"
                max="20000"
                value={frequency}
                onChange={handleFrequencyChange}
                className={style.frequency_number}
              />
              <span>Hz</span>
            </div> */}
          </div>

          <div className={style.presets}>
            {frequencyPresets.map((preset) => (
              <button
                key={preset.value}
                onClick={() => selectPreset(preset.value)}
                className={`${style.preset_button} ${
                  frequency === preset.value ? style.active : ''
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* <div className={style.wave_types}>
            {waveTypes.map((type) => (
              <button
                key={type}
                onClick={() => handleWaveTypeChange(type)}
                className={`${style.wave_button} ${
                  waveType === type ? style.active : ''
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div> */}

          <div className={style.volume_section}>
            <span className={style.volume_label}>{t('gain')}</span>
            <div className={style.volume_slider_container}>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className={style.volume_slider}
              />
              <div
                className={style.volume_slider_thumb}
                style={{ width: `${volume * 100}%` }}
              ></div>
            </div>
            <span className={style.volume_value}>
              {Math.round(volume * 100)}%
            </span>
          </div>

          <button
            onClick={togglePlay}
            className={`${style.play_button} ${isPlaying ? style.active : ''}`}
          >
            <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
            <span>{isPlaying ? t('controls.stop') : t('controls.play')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ToneGenerator
