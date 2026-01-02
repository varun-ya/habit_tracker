export interface Habit {
  id: string
  habitName: string
  frequency: string
}

export interface HabitLog {
  id: string
  habitId: string
  date: string
  completed: boolean
}

export interface HabitWithLogs extends Habit {
  logs: HabitLog[]
}