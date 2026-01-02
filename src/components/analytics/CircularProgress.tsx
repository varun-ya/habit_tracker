'use client'

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

interface CircularProgressProps {
  percentage: number
  size?: number
  strokeWidth?: number
}

export function CircularProgress({ percentage, size = 120, strokeWidth = 8 }: CircularProgressProps) {
  const data = [
    { name: 'completed', value: percentage },
    { name: 'remaining', value: 100 - percentage }
  ]

  const COLORS = ['#10b981', '#e5e7eb']

  return (
    <div className="relative flex items-center justify-center">
      <ResponsiveContainer width={size} height={size}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={size / 2 - strokeWidth * 2}
            outerRadius={size / 2 - strokeWidth}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{Math.round(percentage)}%</div>
          <div className="text-xs text-gray-500">Complete</div>
        </div>
      </div>
    </div>
  )
}