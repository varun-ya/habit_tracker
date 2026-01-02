'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import HabitForm from '@/components/habits/HabitForm';
import HabitItem from '@/components/habits/HabitItem';
import { type CreateHabitInput } from '@/lib/validations/habit';

interface Habit {
  id: string;
  habitName: string;
  frequency: string;
  streak: number;
  completedToday: boolean;
  lastCompleted: string | null;
}

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('habits');
    if (saved) {
      setHabits(JSON.parse(saved));
    }
  }, []);

  const saveHabits = (updatedHabits: Habit[]) => {
    setHabits(updatedHabits);
    localStorage.setItem('habits', JSON.stringify(updatedHabits));
  };

  const addHabit = (data: CreateHabitInput) => {
    const habit: Habit = {
      id: Date.now().toString(),
      habitName: data.habitName,
      frequency: data.frequency,
      streak: 0,
      completedToday: false,
      lastCompleted: null
    };
    
    saveHabits([...habits, habit]);
    setIsAdding(false);
  };

  const editHabit = (id: string, data: CreateHabitInput) => {
    const updatedHabits = habits.map(habit => 
      habit.id === id 
        ? { ...habit, habitName: data.habitName, frequency: data.frequency }
        : habit
    );
    saveHabits(updatedHabits);
  };

  const deleteHabit = (id: string) => {
    saveHabits(habits.filter(habit => habit.id !== id));
  };

  const toggleHabit = (id: string) => {
    const today = new Date().toDateString();
    const updatedHabits = habits.map(habit => {
      if (habit.id === id) {
        const wasCompletedToday = habit.lastCompleted === today;
        return {
          ...habit,
          completedToday: !wasCompletedToday,
          lastCompleted: wasCompletedToday ? null : today,
          streak: wasCompletedToday ? Math.max(0, habit.streak - 1) : habit.streak + 1
        };
      }
      return habit;
    });
    saveHabits(updatedHabits);
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
    </div>
  );
}