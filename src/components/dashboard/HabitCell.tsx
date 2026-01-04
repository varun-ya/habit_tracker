'use client'

import { HabitLog } from '@/types/habit'
import { useState } from 'react'

interface HabitCellProps {
  habitId: string
  date: string
  log?: HabitLog
  onToggle: (habitId: string, date: string) => void
  disabled?: boolean
}

export function HabitCell({ habitId, date, log, onToggle, disabled }: HabitCellProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const isCompleted = log?.completed || false
  const isOptimistic = log?.id?.startsWith('temp-')

  const handleClick = () => {
    if (disabled) return
    setIsActive(true)
    setTimeout(() => setIsActive(false), 150)
    onToggle(habitId, date)
  }

  return (
    <td 
      className={`
        border-r border-gray-200 p-0 h-8 w-12 cursor-pointer transition-colors
        ${isHovered ? 'bg-blue-50' : ''}
        ${isActive ? 'bg-blue-100' : ''}
        ${isCompleted ? 'bg-green-50' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className="w-full h-full flex items-center justify-center">
        {isCompleted ? (
          <span className={`text-green-600 font-bold text-sm ${
            isOptimistic ? 'opacity-60' : ''
          }`}>
            ✓
          </span>
        ) : (
          <span className="text-gray-300 text-xs">•</span>
        )}
        {isOptimistic && (
          <div className="absolute top-0 right-0 w-1 h-1 bg-yellow-400 rounded-full" />
        )}
      </div>
    </td>
  )
}