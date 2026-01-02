'use client'

import { useState, useEffect, useMemo } from 'react'
import { apiClient } from '@/lib/api-client'

export interface AnalyticsData {
  totalHabits: number
  completedToday: number
  currentStreak: number
  completionRate: number
  weeklyData: Array<{
    date: string
    completed: number
    total: number
  }>
  habitStats: Array<{
    id: string
    name: string
    completionRate: number
    currentStreak: number
    totalCompletions: number
  }>
}

export function useAnalytics(period: string = '7d') {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        setError(null)
        const analytics = await apiClient.getAnalytics({ period })
        setData(analytics)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch analytics')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [period])

  const refetch = useMemo(() => async () => {
    try {
      setLoading(true)
      setError(null)
      const analytics = await apiClient.getAnalytics({ period })
      setData(analytics)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics')
    } finally {
      setLoading(false)
    }
  }, [period])

  return useMemo(() => ({ data, loading, error, refetch }), [data, loading, error, refetch])
}