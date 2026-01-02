'use client'

import { DailyCompletionChart } from '../analytics/DailyCompletionChart'
import { CircularProgress } from '../analytics/CircularProgress'
import { WeeklyTrendChart } from '../analytics/WeeklyTrendChart'
import { useAnalytics } from '../analytics/useAnalytics'

export default function AnalyticsPanel() {
  const { data, loading, error } = useAnalytics()

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 h-fit">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Analytics</h2>
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 h-fit">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Analytics</h2>
        <div className="text-center py-8 text-gray-500 text-sm">
          Unable to load analytics data
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Analytics</h2>
      
      {/* Overall Progress */}
      <div className="flex justify-center">
        <CircularProgress percentage={data.overallCompletion} />
      </div>
      
      {/* Key Stats */}
      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-blue-600">{data.currentStreak}</div>
          <div className="text-xs text-gray-500">Day Streak</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-600">{data.totalHabits}</div>
          <div className="text-xs text-gray-500">Active Habits</div>
        </div>
      </div>

      {/* Daily Completion Chart */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-2">Daily Progress</h3>
        <DailyCompletionChart data={data.dailyData} />
      </div>

      {/* Weekly Trend Chart */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-2">Weekly Trend</h3>
        <WeeklyTrendChart data={data.weeklyData} />
      </div>
    </div>
  )
}