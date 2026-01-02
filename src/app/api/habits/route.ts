import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    // Mock habits data for now
    const habits = []
    return NextResponse.json(habits)
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
    const data = await request.json()
    // Mock creation - return the data with an ID
    const habit = { id: Date.now().toString(), ...data }
    return NextResponse.json(habit)
  } catch (error) {
    console.error('Create habit error:', error)
    return NextResponse.json(
      { error: 'Failed to create habit' },
      { status: 500 }
    )
  }
}