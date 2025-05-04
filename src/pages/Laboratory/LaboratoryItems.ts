import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faLink,
  faCalendar,
  faPalette,
  faKeyboard,
  faVolumeHigh,
} from '@fortawesome/free-solid-svg-icons'

export interface LabItem {
  title: string
  description: string
  icon: IconDefinition
  path: string
  category: string
  tags?: string[]
  status?: {
    isNew?: boolean
    isPopular?: boolean
    wip?: boolean
  }
}

export const labItems: LabItem[] = [
  {
    title: 'shortcut.title',
    description: 'shortcut.description',
    icon: faLink,
    path: '/lab/shortcut',
    category: 'utilities',
    tags: ['utilities'],
    status: {
      isPopular: true,
    },
  },
  {
    title: 'toneGenerator.title',
    description: 'toneGenerator.description',
    icon: faVolumeHigh,
    path: '/lab/tone-generator',
    category: 'utilities',
    tags: ['utilities'],
    status: {
      isNew: true,
    },
  },
  {
    title: 'colorJudgeGame.title',
    description: 'colorJudgeGame.description',
    icon: faPalette,
    path: '/lab/color-judge',
    category: 'games',
    tags: ['games', 'focus'],
    status: {
      wip: true,
    },
  },
  {
    title: 'textCounter.title',
    description: 'textCounter.description',
    icon: faKeyboard,
    path: '/lab/text-counter',
    category: 'utilities',
    tags: ['utilities'],
    status: {
      wip: true,
    },
  },
  {
    title: 'schedule.title',
    description: 'schedule.description',
    icon: faCalendar,
    path: '/lab/schedules',
    category: 'organizers',
    tags: ['organizers', 'creators'],
    status: {
      wip: true,
    },
  },
]
