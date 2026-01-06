import { db } from '@/lib/db'
import { habits, habitLogs } from '@/lib/db/schema'
import { eq, gte, lte, and, count, sql } from 'drizzle-orm'

export class AnalyticsService {
  async getAnalytics(params?: { period?: string; startDate?: string; endDate?: string }) {
    const { period = '7d', startDate, endDate } = params || {}
    
    // Calculate date range
    const now = new Date()
    let start: Date
    let end = new Date(now)
    
    if (startDate && endDate) {
      start = new Date(startDate)
      end = new Date(endDate)
    } else {
      switch (period) {
        case '7d':
          start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case '30d':
          start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          break
        case '90d':
          start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
          break
        default:
          start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      }
    }

    const startDateStr = start.toISOString().split('T')[0]
    const endDateStr = end.toISOString().split('T')[0]

    // Get all habits
    const allHabits = await db.select().from(habits)
    
    // Get completion stats for each habit
    const habitStats = await Promise.all(
      allHabits.map(async (habit) => {
        const totalLogs = await db
          .select({ count: count() })
          .from(habitLogs)
          .where(
            and(
              eq(habitLogs.habitId, habit.id),
              gte(habitLogs.date, startDateStr),
              lte(habitLogs.date, endDateStr)
            )
          )

        const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
        const completionRate = totalDays > 0 ? (totalLogs[0].count / totalDays) * 100 : 0

        return {
          habitId: habit.id,
          habitName: habit.name,
          completedDays: totalLogs[0].count,
          totalDays,
          completionRate: Math.round(completionRate * 100) / 100
        }
      })
    )

    // Calculate overall stats
    const totalHabits = allHabits.length
    const totalCompletions = habitStats.reduce((sum, stat) => sum + stat.completedDays, 0)
    const averageCompletionRate = totalHabits > 0 
      ? habitStats.reduce((sum, stat) => sum + stat.completionRate, 0) / totalHabits 
      : 0

    // Get daily completion data for chart
    const dailyData = []
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0]
      
      const dayCompletions = await db
        .select({ count: count() })
        .from(habitLogs)
        .where(eq(habitLogs.date, dateStr))

      dailyData.push({
        date: dateStr,
        completions: dayCompletions[0].count
      })
    }

    return {
      period,
      startDate: startDateStr,
      endDate: endDateStr,
      totalHabits,
      totalCompletions,
      averageCompletionRate: Math.round(averageCompletionRate * 100) / 100,
      habitStats,
      dailyData
    }
  }

  async getStreakData(habitId: string) {
    const logs = await db
      .select()
      .from(habitLogs)
      .where(eq(habitLogs.habitId, habitId))
      .orderBy(habitLogs.date)

    if (logs.length === 0) {
      return { currentStreak: 0, longestStreak: 0 }
    }

    const dates = logs.map(log => new Date(log.date)).sort((a, b) => a.getTime() - b.getTime())
    
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 1

    const today = new Date()
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
    
    // Check if there's a log for today or yesterday to start current streak
    const lastLogDate = dates[dates.length - 1]
    const daysDiff = Math.floor((today.getTime() - lastLogDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysDiff <= 1) {
      currentStreak = 1
      
      // Count backwards from the last date
      for (let i = dates.length - 2; i >= 0; i--) {
        const currentDate = dates[i + 1]
        const prevDate = dates[i]
        const diff = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))
        
        if (diff === 1) {
          currentStreak++
        } else {
          break
        }
      }
    }

    // Calculate longest streak
    for (let i = 1; i < dates.length; i++) {
      const currentDate = dates[i]
      const prevDate = dates[i - 1]
      const diff = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (diff === 1) {
        tempStreak++
      } else {
        longestStreak = Math.max(longestStreak, tempStreak)
        tempStreak = 1
      }
    }
    
    longestStreak = Math.max(longestStreak, tempStreak)

    return { currentStreak, longestStreak }
  }
}

export const analyticsService = new AnalyticsService()