import { NextRequest, NextResponse } from 'next/server'
import { HabitService } from '../../../../lib/services/habit.service'
import { HabitLogService } from '../../../../lib/services/habit-log.service'
import { createHabitSchema } from '../../../../lib/validations/habit'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // For now, just return empty array to get the dashboard working
    return NextResponse.json([])
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
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    console.log('Creating habit with data:', body)
    
    // For now, just return a mock habit to get the form working
    const mockHabit = {
      id: `habit-${Date.now()}`,
      habitName: body.habitName,
      frequency: body.frequency,
      userId: session.user.email,
      createdAt: new Date(),
      logs: []
    }
    
    return NextResponse.json(mockHabit)
  } catch (error) {
    console.error('Create habit error:', error)
    return NextResponse.json(
      { error: 'Failed to create habit' },
      { status: 500 }
    )
  }
}