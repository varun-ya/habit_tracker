'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createHabitSchema, type CreateHabitInput } from '@/lib/validations/habit';

interface HabitFormProps {
  onSubmit: (data: CreateHabitInput) => void;
  onCancel: () => void;
  defaultValues?: Partial<CreateHabitInput>;
  isEditing?: boolean;
}

export default function HabitForm({ onSubmit, onCancel, defaultValues, isEditing = false }: HabitFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<CreateHabitInput>({
    resolver: zodResolver(createHabitSchema),
    defaultValues: defaultValues || { habitName: '', frequency: 'daily' }
  });

  const handleFormSubmit = async (data: CreateHabitInput) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow border">
      <h3 className="text-lg font-semibold mb-4">
        {isEditing ? 'Edit Habit' : 'Create New Habit'}
      </h3>
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <label htmlFor="habitName" className="block text-sm font-medium text-gray-700 mb-1">
            Habit Name
          </label>
          <input
            {...register('habitName')}
            type="text"
            id="habitName"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter habit name..."
          />
          {errors.habitName && (
            <p className="text-red-500 text-sm mt-1">{errors.habitName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
            Frequency
          </label>
          <select
            {...register('frequency')}
            id="frequency"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
          {errors.frequency && (
            <p className="text-red-500 text-sm mt-1">{errors.frequency.message}</p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : isEditing ? 'Update' : 'Create'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}