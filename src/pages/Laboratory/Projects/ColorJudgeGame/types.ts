export type ColorName =
  | 'red'
  | 'green'
  | 'blue'
  | 'yellow'
  | 'purple'
  | 'orange'
  | 'black'
  | 'white'

export interface ColorQuestion {
  backgroundColor: ColorName
  textColor: ColorName
  textContent: ColorName
  options: ColorName[]
  correctAnswer: ColorName
}

export interface GameRecord {
  id: string
  date: string
  score: number
  timePlayed: number
}
