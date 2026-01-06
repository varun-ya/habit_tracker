'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import HabitForm from '@/components/habits/HabitForm';
import HabitItem from '@/components/habits/HabitItem';
import { type CreateHabitInput } from '@/lib/validations/habit';
import { apiClient } from '@/lib/api-client';
import { HabitWithLogs } from '@/types/habit';

export default function HabitsPage() {
  const [habits, setHabits] = useState<HabitWithLogs[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      const data = await apiClient.getHabits();
      setHabits(data);
    } catch (error) {
      console.error('Failed to load habits:', error);
    } finally {
      setLoading(false);
    }
  };

  const addHabit = async (data: CreateHabitInput) => {
    try {
      await apiClient.createHabit(data);
      await loadHabits();
      setIsAdding(false);
    } catch (error) {
      console.error('Failed to create habit:', error);
    }
  };

  const editHabit = async (id: string, data: CreateHabitInput) => {
    try {
      await apiClient.updateHabit(id, data);
      await loadHabits();
    } catch (error) {
      console.error('Failed to update habit:', error);
    }
  };

  const deleteHabit = async (id: string) => {
    try {
      await apiClient.deleteHabit(id);
      await loadHabits();
    } catch (error) {
      console.error('Failed to delete habit:', error);
    }
  };

  const toggleHabit = async (id: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await apiClient.toggleHabitLog(id, today);
      await loadHabits();
    } catch (error) {
      console.error('Failed to toggle habit:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Habit Tracker</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
        >
          <Plus size={20} />
          Add Habit
        </button>
      </div>

      {isAdding && (
        <div className="mb-6">
          <HabitForm
            onSubmit={addHabit}
            onCancel={() => setIsAdding(false)}
          />
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p>Loading habits...</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            {habits.map(habit => (
              <HabitItem
                key={habit.id}
                habit={habit}
                onEdit={editHabit}
                onDelete={deleteHabit}
                onToggle={toggleHabit}
              />
            ))}
          </div>

          {habits.length === 0 && !isAdding && (
            <div className="text-center py-12 text-gray-500">
              <p>No habits yet. Add your first habit to get started!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}