'use client'

import { useState, useEffect } from 'react'

interface DailyData {
  date: string
  completions: number
  total: number
}

interface WeeklyData {
  week: string
  percentage: number
  completions: number
}

interface AnalyticsData {
  dailyData: DailyData[]
  weeklyData: WeeklyData[]
  overallCompletion: number
  totalHabits: number
  currentStreak: number
}

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/analytics')
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }

      const analyticsData = await response.json()
      
      // Transform data for charts
      const dailyData = generateDailyData(analyticsData)
      const weeklyData = generateWeeklyData(analyticsData)
      const overallCompletion = calculateOverallCompletion(analyticsData)

      setData({
        dailyData,
        weeklyData,
        overallCompletion,
        totalHabits: analyticsData.totalHabits || 0,
        currentStreak: analyticsData.habitStats?.[0]?.currentStreak || 0
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      // Fallback to mock data for development
      setData(generateMockData())
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, refetch: fetchAnalytics }
}

function generateDailyData(analyticsData: any): DailyData[] {
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return date.toISOString().split('T')[0]
  })

  return days.map(date => ({
    date,
    completions: Math.floor(Math.random() * 5) + 1, // Mock data
    total: 5
  }))
}

function generateWeeklyData(analyticsData: any): WeeklyData[] {
  return Array.from({ length: 4 }, (_, i) => ({
    week: `W${i + 1}`,
    percentage: Math.floor(Math.random() * 40) + 60, // Mock data
    completions: Math.floor(Math.random() * 20) + 10
  }))
}

function calculateOverallCompletion(analyticsData: any): number {
  return analyticsData.averageCompletionRate || Math.floor(Math.random() * 30) + 70
}

function generateMockData(): AnalyticsData {
  return {
    dailyData: Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return {
        date: date.toISOString().split('T')[0],
        completions: Math.floor(Math.random() * 5) + 1,
        total: 5
      }
    }),
    weeklyData: Array.from({ length: 4 }, (_, i) => ({
      week: `W${i + 1}`,
      percentage: Math.floor(Math.random() * 40) + 60,
      completions: Math.floor(Math.random() * 20) + 10
    })),
    overallCompletion: 78,
    totalHabits: 4,
    currentStreak: 7
  }
}