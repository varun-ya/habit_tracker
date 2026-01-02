'use client'

import { HabitWithLogs } from '@/types/habit'
import { CheckboxCell } from './CheckboxCell'

interface HabitRowProps {
  habit: HabitWithLogs
  dates: string[]
  onToggle: (habitId: string, date: string) => void
  getLogForDate: (habitId: string, date: string) => any
  disabled?: boolean
}

export function HabitRow({ habit, dates, onToggle, getLogForDate, disabled }: HabitRowProps) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="py-3 px-2 sm:px-3 text-sm font-medium text-gray-900 sticky left-0 bg-white border-r border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0" />
          <span className="truncate">{habit.habitName}</span>
        </div>
      </td>
      {dates.map((date) => (
        <CheckboxCell
          key={date}
          habitId={habit.id}
          date={date}
          log={getLogForDate(habit.id, date)}
          onToggle={onToggle}
          disabled={disabled}
        />
      ))}
    </tr>
  )
}