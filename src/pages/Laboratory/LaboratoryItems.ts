import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faLink, faCalendar } from '@fortawesome/free-solid-svg-icons'

export interface LabItem {
  title: string
  description: string
  icon: IconDefinition
  path: string
  category: string
  tags?: string[]
  isNew?: boolean
  isPopular?: boolean
}

export const labItems: LabItem[] = [
  {
    title: 'shortcut.title',
    description: 'shortcut.description',
    icon: faLink,
    path: '/lab/shortcut',
    category: 'utilities',
    tags: ['utilities'],
    isPopular: true,
  },
  {
    title: 'schedule.title',
    description: 'schedule.description',
    icon: faCalendar,
    path: '/lab/schedules',
    category: 'organizers',
    tags: ['organizers', 'creators'],
  },
]
