'use client'

import { memo } from 'react'
import HabitList from './habit-list'
import HabitTable from './habit-table'
import AnalyticsPanel from './analytics-panel'
import { useHabits } from '@/hooks/useHabits'
import { HabitListSkeleton, HabitTableSkeleton, AnalyticsSkeleton } from '@/components/ui/skeleton'

const Dashboard = memo(() => {
  const { habits, loading } = useHabits()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <header className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Habit Tracker</h1>
            <p className="text-gray-600 mt-1">Track your daily habits and build better routines</p>
          </header>
          
          {/* Mobile loading */}
          <div className="block lg:hidden space-y-6">
            <HabitTableSkeleton />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <HabitListSkeleton />
              <AnalyticsSkeleton />
            </div>
          </div>
          
          {/* Desktop loading */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-3">
              <HabitListSkeleton />
            </div>
            <div className="lg:col-span-6">
              <HabitTableSkeleton />
            </div>
            <div className="lg:col-span-3">
              <AnalyticsSkeleton />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Habit Tracker</h1>
          <p className="text-gray-600 mt-1">Track your daily habits and build better routines</p>
        </header>
        
        {/* Mobile: Stack vertically */}
        <div className="block lg:hidden space-y-6">
          <HabitTable habits={habits} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <HabitList />
            <AnalyticsPanel />
          </div>
        </div>
        
        {/* Desktop: Three column layout */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-6">
          {/* Left: Habit List */}
          <div className="lg:col-span-3">
            <HabitList />
          </div>
          
          {/* Center: Habit Table */}
          <div className="lg:col-span-6">
            <HabitTable habits={habits} />
          </div>
          
          {/* Right: Analytics Panel */}
          <div className="lg:col-span-3">
            <AnalyticsPanel />
          </div>
        </div>
      </div>
    </div>
  )
})

Dashboard.displayName = 'Dashboard'

export default Dashboard