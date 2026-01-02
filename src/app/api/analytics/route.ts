import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Mock analytics data for now
    const analytics = {
      totalHabits: 0,
      completedToday: 0,
      weeklyCompletion: 0,
      streak: 0,
      weeklyData: [],
      dailyData: []
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