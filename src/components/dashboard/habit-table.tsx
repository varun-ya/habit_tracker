'use client'

import { HabitWithLogs } from '@/types/habit'
import { HabitRow } from './HabitRow'
import { TableHeader } from './TableHeader'
import { MonthNavigator } from './MonthNavigator'
import { useHabitLogs } from './useHabitLogs'
import { useState } from 'react'

interface HabitTableProps {
  habits: HabitWithLogs[]
  onAddHabit: () => void
}

export default function HabitTable({ habits, onAddHabit }: HabitTableProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const { habits: habitsWithLogs, toggleHabitLog, getLogForDate, isUpdating } = useHabitLogs(habits)
  
  // Generate current month's days
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  
  const dates = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(year, month, i + 1)
    return date.toISOString().split('T')[0]
  })
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }
  
  return (
    <div className="w-full h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <MonthNavigator 
          currentDate={currentDate} 
          onNavigate={navigateMonth}
        />
        <button
          onClick={onAddHabit}
          className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          + Add Habit
        </button>
      </div>
      
      {/* Table Container */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto">
          <table className="w-full border-collapse">
            <TableHeader dates={dates} />
            <tbody>
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
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
          No habits yet. Click "+ Add Habit" to get started.
        </div>
      )}
    </div>
  )
}