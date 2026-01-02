'use client';

import { useState } from 'react';
import { Edit2, Trash2, Check } from 'lucide-react';
import { type CreateHabitInput } from '../../../lib/validations/habit';

interface Habit {
  id: string;
  habitName: string;
  frequency: string;
  streak?: number;
  completedToday?: boolean;
  lastCompleted?: string | null;
}

interface HabitItemProps {
  habit: Habit;
  onEdit: (id: string, data: CreateHabitInput) => void;
  onDelete: (id: string) => void;
  onToggle?: (id: string) => void;
}

export default function HabitItem({ habit, onEdit, onDelete, onToggle }: HabitItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = (data: CreateHabitInput) => {
    onEdit(habit.id, data);
    setIsEditing(false);
  };

  const isCompletedToday = habit.lastCompleted === new Date().toDateString();

  if (isEditing) {
    const HabitForm = require('./HabitForm').default;
    return (
      <HabitForm
        onSubmit={handleEdit}
        onCancel={() => setIsEditing(false)}
        defaultValues={{
          habitName: habit.habitName,
          frequency: habit.frequency as 'daily' | 'weekly'
        }}
        isEditing={true}
      />
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow border flex items-center justify-between">
      <div className="flex items-center gap-4">
        {onToggle && (
          <button
            onClick={() => onToggle(habit.id)}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isCompletedToday
                ? 'bg-green-500 text-white'
                : 'border-2 border-gray-300 hover:border-green-500'
            }`}
          >
            {isCompletedToday && <Check size={16} />}
          </button>
        )}
        <div>
          <h3 className="font-semibold">{habit.habitName}</h3>
          <div className="flex gap-4 text-sm text-gray-600">
            <span className="capitalize">{habit.frequency}</span>
            {habit.streak !== undefined && <span>Streak: {habit.streak} days</span>}
          </div>
        </div>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={() => setIsEditing(true)}
          className="text-blue-500 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50"
          title="Edit habit"
        >
          <Edit2 size={18} />
        </button>
        <button
          onClick={() => onDelete(habit.id)}
          className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50"
          title="Delete habit"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}