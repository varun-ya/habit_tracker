import { NextRequest, NextResponse } from 'next/server'
import { HabitService, HabitLogService } from '@/lib/services'
import { createHabitSchema } from '../../../../lib/validations/habit'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    // For development, use a default user email if no session
    let userEmail = 'demo@example.com'
    
    try {
      const session = await getServerSession(authOptions)
      if (session?.user?.email) {
        userEmail = session.user.email
      }
    } catch (error) {
      console.log('No session found, using demo user')
    }

    const habits = await HabitService.getUserHabits(userEmail)
    
    // Get habits with their logs
    const habitsWithLogs = await Promise.all(
      habits.map(async (habit) => {
        const logs = await HabitLogService.getHabitLogs(habit.id)
        return {
          ...habit,
          logs
        }
      })
    )
    
    return NextResponse.json(habitsWithLogs)
  } catch (error) {
    console.error('Habits API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch habits' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // For development, use a default user email if no session
    let userEmail = 'demo@example.com'
    
    try {
      const session = await getServerSession(authOptions)
      if (session?.user?.email) {
        userEmail = session.user.email
      }
    } catch (error) {
      console.log('No session found, using demo user')
    }

    const body = await request.json()
    console.log('Creating habit with data:', body)
    
    // Validate the input
    const validatedData = createHabitSchema.parse(body)
    
    // Create the habit using the service
    const habit = await HabitService.createHabit(userEmail, validatedData)
    
    // Return habit with empty logs array
    const habitWithLogs = {
      ...habit,
      logs: []
    }
    
    return NextResponse.json(habitWithLogs)
  } catch (error) {
    console.error('Create habit error:', error)
    return NextResponse.json(
      { error: 'Failed to create habit' },
      { status: 500 }
    )
  }
}