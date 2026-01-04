import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { startOfDay, endOfDay, subDays, format, startOfWeek, endOfWeek } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) {
      // Return empty analytics for new users
      return NextResponse.json({
        totalHabits: 0,
        completedToday: 0,
        currentStreak: 0,
        completionRate: 0,
        weeklyData: [],
        dailyData: [],
        habitStats: []
      })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '7d'
    const now = new Date()
    const today = startOfDay(now)

    // Get user habits
    const habits = await prisma.habit.findMany({
      where: { userId: user.id },
      include: {
        logs: {
          where: {
            date: {
              gte: subDays(today, 30) // Last 30 days for calculations
            }
          }
        }
      }
    })

    const totalHabits = habits.length
    
    // Calculate today's completions
    const todayLogs = habits.reduce((count, habit) => {
      const todayLog = habit.logs.find(log => 
        startOfDay(log.date).getTime() === today.getTime()
      )
      return count + (todayLog ? 1 : 0)
    }, 0)

    // Calculate daily data for the last 7 days
    const dailyData = []
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i)
      const dateStr = format(date, 'yyyy-MM-dd')
      
      const completions = habits.reduce((count, habit) => {
        const dayLog = habit.logs.find(log => 
          startOfDay(log.date).getTime() === startOfDay(date).getTime()
        )
        return count + (dayLog ? 1 : 0)
      }, 0)
      
      dailyData.push({
        date: dateStr,
        completions,
        total: totalHabits
      })
    }

    // Calculate weekly data for the last 4 weeks
    const weeklyData = []
    for (let i = 3; i >= 0; i--) {
      const weekStart = startOfWeek(subDays(now, i * 7))
      const weekEnd = endOfWeek(weekStart)
      
      let weekCompletions = 0
      let weekTotal = 0
      
      for (let d = new Date(weekStart); d <= weekEnd; d.setDate(d.getDate() + 1)) {
        const dayCompletions = habits.reduce((count, habit) => {
          const dayLog = habit.logs.find(log => 
            startOfDay(log.date).getTime() === startOfDay(d).getTime()
          )
          return count + (dayLog ? 1 : 0)
        }, 0)
        
        weekCompletions += dayCompletions
        weekTotal += totalHabits
      }
      
      const percentage = weekTotal > 0 ? Math.round((weekCompletions / weekTotal) * 100) : 0
      
      weeklyData.push({
        week: `W${i + 1}`,
        percentage,
        completions: weekCompletions
      })
    }

    // Calculate habit stats
    const habitStats = habits.map(habit => {
      const totalLogs = habit.logs.length
      const last7Days = habit.logs.filter(log => 
        log.date >= subDays(today, 7)
      ).length
      
      // Calculate current streak
      let currentStreak = 0
      let checkDate = new Date(today)
      
      while (true) {
        const hasLog = habit.logs.some(log => 
          startOfDay(log.date).getTime() === startOfDay(checkDate).getTime()
        )
        
        if (hasLog) {
          currentStreak++
          checkDate = subDays(checkDate, 1)
        } else {
          break
        }
      }
      
      return {
        id: habit.id,
        name: habit.habitName,
        completionRate: Math.round((last7Days / 7) * 100),
        currentStreak,
        totalCompletions: totalLogs
      }
    })

    // Calculate overall completion rate
    const last7DaysTotal = dailyData.reduce((sum, day) => sum + day.total, 0)
    const last7DaysCompleted = dailyData.reduce((sum, day) => sum + day.completions, 0)
    const completionRate = last7DaysTotal > 0 ? Math.round((last7DaysCompleted / last7DaysTotal) * 100) : 0

    // Calculate current streak (consecutive days with at least one habit completed)
    let currentStreak = 0
    let checkDate = new Date(today)
    
    while (true) {
      const dayCompletions = habits.reduce((count, habit) => {
        const dayLog = habit.logs.find(log => 
          startOfDay(log.date).getTime() === startOfDay(checkDate).getTime()
        )
        return count + (dayLog ? 1 : 0)
      }, 0)
      
      if (dayCompletions > 0) {
        currentStreak++
        checkDate = subDays(checkDate, 1)
      } else {
        break
      }
    }

    const analytics = {
      totalHabits,
      completedToday: todayLogs,
      currentStreak,
      completionRate,
      weeklyData,
      dailyData,
      habitStats
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}