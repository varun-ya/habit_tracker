'use client'

import { DailyCompletionChart } from '../analytics/DailyCompletionChart'
import { CircularProgress } from '../analytics/CircularProgress'
import { WeeklyTrendChart } from '../analytics/WeeklyTrendChart'
import { useAnalytics } from '@/hooks/useAnalytics'

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
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Analytics</h2>
        <a 
          href="/analytics" 
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          View All
        </a>
      </div>
      
      {/* Overall Progress */}
      <div className="flex justify-center">
        <CircularProgress percentage={data.completionRate} />
      </div>
      
      {/* Key Stats */}
      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-blue-600">{data.currentStreak}</div>
          <div className="text-xs text-gray-500">Day Streak</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-600">{data.completedToday}</div>
          <div className="text-xs text-gray-500">Today</div>
        </div>
      </div>

      {/* Daily Completion Chart */}
      {data.dailyData && data.dailyData.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Daily Progress</h3>
          <DailyCompletionChart data={data.dailyData} />
        </div>
      )}

      {/* Weekly Trend Chart */}
      {data.weeklyData && data.weeklyData.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Weekly Trend</h3>
          <WeeklyTrendChart data={data.weeklyData} />
        </div>
      )}

      {/* Empty State */}
      {data.totalHabits === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-sm text-gray-500">No habits to analyze yet</p>
        </div>
      )}
    </div>
  )
}