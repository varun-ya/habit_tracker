'use client'

import { useState, useEffect, useCallback } from 'react'
import { HabitWithLogs, HabitLog } from '@/types/habit'

export function useHabitLogs(initialHabits: HabitWithLogs[]) {
  const [habits, setHabits] = useState<HabitWithLogs[]>(initialHabits)
  const [isUpdating, setIsUpdating] = useState(false)
  const [optimisticUpdates, setOptimisticUpdates] = useState<Set<string>>(new Set())

  useEffect(() => {
    setHabits(initialHabits)
  }, [initialHabits])

  const toggleHabitLog = useCallback(async (habitId: string, date: string) => {
    const updateKey = `${habitId}-${date}`
    
    // Add to optimistic updates
    setOptimisticUpdates(prev => new Set(prev).add(updateKey))
    
    // Optimistic update
    setHabits(prev => prev.map(habit => {
      if (habit.id !== habitId) return habit
      
      const existingLog = habit.logs.find(log => log.date === date)
      
      if (existingLog) {
        return {
          ...habit,
          logs: habit.logs.map(log => 
            log.date === date 
              ? { ...log, completed: !log.completed }
              : log
          )
        }
      } else {
        return {
          ...habit,
          logs: [...habit.logs, {
            id: `temp-${Date.now()}`,
            habitId,
            date,
            completed: true
          }]
        }
      }
    }))

    try {
      setIsUpdating(true)
      const response = await fetch('/api/habit-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ habitId, date })
      })

      if (!response.ok) {
        throw new Error('Failed to update habit log')
      }

      const updatedLog = await response.json()
      
      // Update with server response
      setHabits(prev => prev.map(habit => {
        if (habit.id !== habitId) return habit
        
        return {
          ...habit,
          logs: habit.logs.map(log => 
            log.date === date 
              ? updatedLog
              : log
          )
        }
      }))
    } catch (error) {
      // Revert optimistic update on error
      setHabits(prev => prev.map(habit => {
        if (habit.id !== habitId) return habit
        
        const existingLog = habit.logs.find(log => log.date === date)
        
        if (existingLog && existingLog.id.startsWith('temp-')) {
          return {
            ...habit,
            logs: habit.logs.filter(log => log.date !== date)
          }
        } else {
          return {
            ...habit,
            logs: habit.logs.map(log => 
              log.date === date 
                ? { ...log, completed: !log.completed }
                : log
            )
          }
        }
      }))
      console.error('Failed to update habit log:', error)
    } finally {
      setIsUpdating(false)
      // Remove from optimistic updates
      setOptimisticUpdates(prev => {
        const newSet = new Set(prev)
        newSet.delete(updateKey)
        return newSet
      })
    }
  }, [])

  const getLogForDate = useCallback((habitId: string, date: string): HabitLog | undefined => {
    const habit = habits.find(h => h.id === habitId)
    return habit?.logs.find(log => log.date === date)
  }, [habits])

  const isOptimisticUpdate = useCallback((habitId: string, date: string): boolean => {
    return optimisticUpdates.has(`${habitId}-${date}`)
  }, [optimisticUpdates])

  return {
    habits,
    toggleHabitLog,
    getLogForDate,
    isUpdating,
    isOptimisticUpdate
  }
}