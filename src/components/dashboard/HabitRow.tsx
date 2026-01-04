'use client'

import { HabitWithLogs } from '@/types/habit'
import { HabitCell } from './HabitCell'
import { useState } from 'react'

interface HabitRowProps {
  habit: HabitWithLogs
  dates: string[]
  onToggle: (habitId: string, date: string) => void
  getLogForDate: (habitId: string, date: string) => any
  disabled?: boolean
}

export function HabitRow({ habit, dates, onToggle, getLogForDate, disabled }: HabitRowProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(habit.habitName)
  
  const handleNameClick = () => {
    setIsEditing(true)
    setEditValue(habit.habitName)
  }
  
  const handleNameSave = () => {
    setIsEditing(false)
    // TODO: Implement habit name update API call
    console.log('Update habit name:', editValue)
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSave()
    } else if (e.key === 'Escape') {
      setIsEditing(false)
      setEditValue(habit.habitName)
    }
  }
  
  return (
    <tr className="hover:bg-gray-50 border-b border-gray-100">
      {/* Habit Name Cell */}
      <td className="sticky left-0 z-10 bg-white border-r border-gray-200 px-3 py-2 w-48">
        {isEditing ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleNameSave}
            onKeyDown={handleKeyDown}
            className="w-full text-sm text-gray-900 bg-transparent border-none outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5"
            autoFocus
          />
        ) : (
          <button
            onClick={handleNameClick}
            className="w-full text-left text-sm text-gray-900 hover:bg-gray-100 rounded px-1 py-0.5 transition-colors"
          >
            {habit.habitName}
          </button>
        )}
      </td>
      
      {/* Date Cells */}
      {dates.map((date) => (
        <HabitCell
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