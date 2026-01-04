import { HabitWithLogs } from '@/types/habit'

interface HabitListProps {
  habits: HabitWithLogs[]
  onAddHabit: () => void
}

export default function HabitList({ habits, onAddHabit }: HabitListProps) {
  const getHabitColor = (index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-cyan-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-indigo-500'
    ]
    return colors[index % colors.length]
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 h-fit">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Habits</h2>
      <div className="space-y-2 sm:space-y-3">
        {habits.map((habit, index) => (
          <div
            key={habit.id}
            className="flex items-center gap-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${getHabitColor(index)} flex-shrink-0`} />
            <span className="text-sm font-medium text-gray-700 truncate">{habit.habitName}</span>
          </div>
        ))}
        {habits.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">
            No habits yet. Start by adding your first habit!
          </div>
        )}
      </div>
      <button 
        onClick={onAddHabit}
        className="w-full mt-4 py-2 px-4 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
      >
        + Add Habit
      </button>
    </div>
  )
}