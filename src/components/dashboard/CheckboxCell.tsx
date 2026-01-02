'use client'

import { HabitLog } from '@/types/habit'
import { useState } from 'react'

interface CheckboxCellProps {
  habitId: string
  date: string
  log?: HabitLog
  onToggle: (habitId: string, date: string) => void
  disabled?: boolean
}

export function CheckboxCell({ habitId, date, log, onToggle, disabled }: CheckboxCellProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const isCompleted = log?.completed || false
  const isOptimistic = log?.id?.startsWith('temp-')

  const handleClick = async () => {
    if (disabled) return
    
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 200)
    
    onToggle(habitId, date)
  }

  return (
    <td className="py-3 px-2 sm:px-3 text-center">
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`
          relative w-6 h-6 rounded-full border-2 transition-all duration-200 
          ${isCompleted
            ? 'bg-green-500 border-green-500 hover:bg-green-600 shadow-sm'
            : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isAnimating ? 'scale-110' : 'scale-100'}
          ${isOptimistic ? 'opacity-75' : ''}
        `}
        aria-label={`Mark ${isCompleted ? 'incomplete' : 'complete'} for ${date}`}
      >
        {isCompleted && (
          <svg 
            className={`w-3 h-3 text-white mx-auto transition-opacity duration-150 ${
              isOptimistic ? 'opacity-75' : 'opacity-100'
            }`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
              clipRule="evenodd" 
            />
          </svg>
        )}
        {isOptimistic && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
        )}
      </button>
    </td>
  )
}