'use client'

import { HabitWithLogs } from '@/types/habit'
import { HabitRow } from './HabitRow'
import { useHabitLogs } from './useHabitLogs'

interface HabitChecklistTableProps {
  habits: HabitWithLogs[]
}

export default function HabitChecklistTable({ habits }: HabitChecklistTableProps) {
  const { habits: habitsWithLogs, toggleHabitLog, getLogForDate, isUpdating } = useHabitLogs(habits)
  
  // Generate last 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return date.toISOString().split('T')[0]
  })
  
  const dayLabels = dates.map(date => {
    const d = new Date(date)
    return d.toLocaleDateString('en-US', { weekday: 'short' })
  })
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">This Week</h2>
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="min-w-full inline-block align-middle">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-2 sm:px-3 text-sm font-medium text-gray-600 sticky left-0 bg-white z-10 min-w-[120px]">
                  Habit
                </th>
                {dayLabels.map((day, index) => (
                  <th key={dates[index]} className="text-center py-3 px-2 sm:px-3 text-sm font-medium text-gray-600 min-w-[50px]">
                    <div className="hidden sm:block">{day}</div>
                    <div className="block sm:hidden">{day.charAt(0)}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {habitsWithLogs.map((habit) => (
                <HabitRow
                  key={habit.id}
                  habit={habit}
                  dates={dates}
                  onToggle={toggleHabitLog}
                  getLogForDate={getLogForDate}
                  disabled={isUpdating}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {habitsWithLogs.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm">
          No habits yet. Create your first habit to get started!
        </div>
      )}
    </div>
  )
}