import { z } from 'zod';

export const toggleHabitLogSchema = z.object({
  habitId: z.string().min(1, 'Habit ID is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
});

export type ToggleHabitLogInput = z.infer<typeof toggleHabitLogSchema>;