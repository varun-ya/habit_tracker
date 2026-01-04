'use client'

interface MonthNavigatorProps {
  currentDate: Date
  onNavigate: (direction: 'prev' | 'next') => void
}

export function MonthNavigator({ currentDate, onNavigate }: MonthNavigatorProps) {
  const monthName = currentDate.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  })
  
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onNavigate('prev')}
        className="p-1 hover:bg-gray-100 rounded transition-colors"
        aria-label="Previous month"
      >
        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <h1 className="text-lg font-medium text-gray-900 min-w-[140px] text-center">
        {monthName}
      </h1>
      
      <button
        onClick={() => onNavigate('next')}
        className="p-1 hover:bg-gray-100 rounded transition-colors"
        aria-label="Next month"
      >
        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}