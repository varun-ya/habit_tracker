import { NextRequest, NextResponse } from 'next/server'
import { HabitLogService } from '../../../../lib/services/habit-log.service'
import { HabitService } from '../../../../lib/services/habit.service'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const habitId = searchParams.get('habitId')
    
    if (!habitId) {
      return NextResponse.json({ error: 'Habit ID is required' }, { status: 400 })
    }

    // Verify habit belongs to user
    const habit = await HabitService.getHabitById(habitId, session.user.email)
    if (!habit) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 })
    }
    
    const logs = await HabitLogService.getHabitLogs(habitId)
    return NextResponse.json(logs)
  } catch (error) {
    console.error('Habit logs API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch habit logs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { habitId, date } = await request.json()
    
    if (!habitId || !date) {
      return NextResponse.json(
        { error: 'Habit ID and date are required' },
        { status: 400 }
      )
    }

    // Verify habit belongs to user
    const habit = await HabitService.getHabitById(habitId, session.user.email)
    if (!habit) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 })
    }
    
    const log = await HabitLogService.toggleHabitLog(habitId, date)
    return NextResponse.json(log)
  } catch (error) {
    console.error('Toggle habit log error:', error)
    return NextResponse.json(
      { error: 'Failed to toggle habit log' },
      { status: 500 }
    )
  }
}