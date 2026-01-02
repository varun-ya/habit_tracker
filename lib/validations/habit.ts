import { z } from 'zod';

export const createHabitSchema = z.object({
  habitName: z.string().min(1, 'Habit name is required').max(100, 'Habit name too long'),
  frequency: z.enum(['daily', 'weekly'], {
    errorMap: () => ({ message: 'Frequency must be daily or weekly' })
  })
});

export const updateHabitSchema = z.object({
  habitName: z.string().min(1, 'Habit name is required').max(100, 'Habit name too long').optional(),
  frequency: z.enum(['daily', 'weekly'], {
    errorMap: () => ({ message: 'Frequency must be daily or weekly' })
  }).optional()
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update'
});

export type CreateHabitInput = z.infer<typeof createHabitSchema>;
export type UpdateHabitInput = z.infer<typeof updateHabitSchema>;