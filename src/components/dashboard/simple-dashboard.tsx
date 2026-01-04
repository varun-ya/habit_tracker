'use client'

import { useState } from 'react'

interface Habit {
  id: string
  name: string
  frequency: string
}

export default function SimpleDashboard() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [habitName, setHabitName] = useState('')
  const [frequency, setFrequency] = useState('daily')

  const handleAddHabit = () => {
    if (habitName.trim()) {
      const newHabit: Habit = {
        id: Date.now().toString(),
        name: habitName.trim(),
        frequency
      }
      setHabits([...habits, newHabit])
      setHabitName('')
      setFrequency('daily')
      setShowAddForm(false)
    }
  }

  const handleDeleteHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Habit Tracker</h1>
          <p className="text-gray-600 mt-1">Track your daily habits and build better routines</p>
        </header>

        {/* Add Habit Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Habit
          </button>
        </div>

        {/* Add Habit Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Add New Habit</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Habit Name
                  </label>
                  <input
                    type="text"
                    value={habitName}
                    onChange={(e) => setHabitName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter habit name..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frequency
                  </label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleAddHabit}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Habits List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Your Habits</h2>
          </div>
          
          <div className="p-6">
            {habits.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-gray-500">No habits yet. Create your first habit to get started!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {habits.map((habit) => (
                  <div key={habit.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{habit.name}</h3>
                      <p className="text-sm text-gray-500 capitalize">{habit.frequency}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteHabit(habit.id)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}