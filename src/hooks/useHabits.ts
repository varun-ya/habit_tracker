'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { HabitWithLogs } from '@/types/habit'
import { apiClient } from '@/lib/api-client'
import { CreateHabitInput } from '../../lib/validations/habit'

interface UseHabitsReturn {
  habits: HabitWithLogs[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  toggleHabitLog: (habitId: string, date: string) => Promise<void>
  createHabit: (data: CreateHabitInput) => Promise<void>
  isUpdating: boolean
}

export function useHabits(): UseHabitsReturn {
  const [habits, setHabits] = useState<HabitWithLogs[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const fetchHabits = useCallback(async () => {
    try {
      console.log('Fetching habits...')
      setLoading(true)
      setError(null)
      const data = await apiClient.getHabits()
      console.log('Habits fetched:', data)
      setHabits(data)
    } catch (err) {
      console.error('Error fetching habits:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch habits')
    } finally {
      setLoading(false)
    }
  }, [])

  const toggleHabitLog = useCallback(async (habitId: string, date: string) => {
    // Optimistic update
    setHabits(prev => prev.map(habit => {
      if (habit.id !== habitId) return habit
      
      const existingLog = habit.logs?.find(log => log.date === date)
      
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
          logs: [...(habit.logs || []), {
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
      await apiClient.toggleHabitLog(habitId, date)
    } catch (err) {
      // Revert optimistic update on error
      setHabits(prev => prev.map(habit => {
        if (habit.id !== habitId) return habit
        
        const existingLog = habit.logs?.find(log => log.date === date)
        
        if (existingLog?.id.startsWith('temp-')) {
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
      setError(err instanceof Error ? err.message : 'Failed to update habit')
    } finally {
      setIsUpdating(false)
    }
  }, [])

  const createHabit = useCallback(async (data: CreateHabitInput) => {
    try {
      setIsUpdating(true)
      await apiClient.createHabit(data)
      await fetchHabits()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create habit')
      throw err
    } finally {
      setIsUpdating(false)
    }
  }, [fetchHabits])

  useEffect(() => {
    fetchHabits()
  }, [fetchHabits])

  return useMemo(() => ({
    habits,
    loading,
    error,
    refetch: fetchHabits,
    toggleHabitLog,
    createHabit,
    isUpdating
  }), [habits, loading, error, fetchHabits, toggleHabitLog, createHabit, isUpdating])
}