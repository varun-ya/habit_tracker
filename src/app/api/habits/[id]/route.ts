import { NextRequest, NextResponse } from 'next/server'
import { HabitService } from '../../../../../lib/services/habit.service'
import { updateHabitSchema } from '../../../../../lib/validations/habit'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = updateHabitSchema.parse(body)
    
    const habit = await HabitService.updateHabit(params.id, session.user.email, validatedData)
    if (!habit) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 })
    }
    
    return NextResponse.json(habit)
  } catch (error) {
    console.error('Update habit error:', error)
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update habit' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const success = await HabitService.deleteHabit(params.id, session.user.email)
    if (!success) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete habit error:', error)
    return NextResponse.json(
      { error: 'Failed to delete habit' },
      { status: 500 }
    )
  }
}