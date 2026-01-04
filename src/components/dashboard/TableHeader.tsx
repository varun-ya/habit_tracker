'use client'

interface TableHeaderProps {
  dates: string[]
}

export function TableHeader({ dates }: TableHeaderProps) {
  return (
    <thead className="bg-gray-50 sticky top-0 z-20">
      <tr>
        {/* Habit Name Column */}
        <th className="sticky left-0 z-30 bg-gray-50 border-r border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
          Habit
        </th>
        
        {/* Date Columns */}
        {dates.map((date) => {
          const dateObj = new Date(date)
          const dayNum = dateObj.getDate()
          const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' })
          
          return (
            <th 
              key={date} 
              className="border-r border-gray-200 px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[40px] w-12"
            >
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-400">{dayName.charAt(0)}</span>
                <span className="text-sm font-semibold text-gray-700">{dayNum}</span>
              </div>
            </th>
          )
        })}
      </tr>
    </thead>
  )
}