import { z } from 'zod';

export const analyticsQuerySchema = z.object({
  period: z.enum(['week', 'month', 'quarter', 'year']).optional().default('month'),
  includeProjections: z.boolean().optional().default(false)
});

export type AnalyticsQueryInput = z.infer<typeof analyticsQuerySchema>;

export interface WeeklyStats {
  weekStart: string;
  weekEnd: string;
  completions: number;
  totalDays: number;
  percentage: number;
}

export interface MonthlyStats {
  month: string;
  completions: number;
  totalDays: number;
  daysInMonth: number;
  percentage: number;
}

export interface HabitAnalytics {
  dailyCompletion: boolean;
  completionPercentage: number;
  currentStreak: number;
  weeklyStats: WeeklyStats[];
  monthlyStats: MonthlyStats;
  totalCompletions: number;
  lastUpdated: string;
}