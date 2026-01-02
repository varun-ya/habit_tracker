export default function HabitList() {
  const mockHabits = [
    { id: 1, name: 'Morning Exercise', color: 'bg-blue-500' },
    { id: 2, name: 'Read 30 min', color: 'bg-green-500' },
    { id: 3, name: 'Drink Water', color: 'bg-cyan-500' },
    { id: 4, name: 'Meditation', color: 'bg-purple-500' },
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 h-fit">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Habits</h2>
      <div className="space-y-2 sm:space-y-3">
        {mockHabits.map((habit) => (
          <div
            key={habit.id}
            className="flex items-center gap-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${habit.color} flex-shrink-0`} />
            <span className="text-sm font-medium text-gray-700 truncate">{habit.name}</span>
          </div>
        ))}
      </div>
      <button className="w-full mt-4 py-2 px-4 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
        + Add Habit
      </button>
    </div>
  )
}