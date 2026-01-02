import { prisma } from '@/lib/prisma';
import { HabitFrequency } from '@prisma/client';

export interface HabitStats {
  habitId: string;
  habitName: string;
  totalLogs: number;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  lastCompleted?: Date;
}

export interface AnalyticsData {
  totalHabits: number;
  activeHabits: number;
  totalCompletions: number;
  averageCompletionRate: number;
  habitStats: HabitStats[];
}

export class AnalyticsService {
  static async getUserAnalytics(userId: string): Promise<AnalyticsData> {
    const habits = await prisma.habit.findMany({
      where: { userId },
      include: {
        logs: {
          orderBy: { date: 'desc' },
        },
      },
    });

    const totalHabits = habits.length;
    const activeHabits = habits.filter(h => h.isActive).length;
    const totalCompletions = habits.reduce((sum, habit) => sum + habit.logs.length, 0);

    const habitStats: HabitStats[] = habits.map(habit => {
      const stats = this.calculateHabitStats(habit.id, habit.name, habit.logs, habit.frequency);
      return stats;
    });

    const averageCompletionRate = habitStats.length > 0 
      ? habitStats.reduce((sum, stat) => sum + stat.completionRate, 0) / habitStats.length 
      : 0;

    return {
      totalHabits,
      activeHabits,
      totalCompletions,
      averageCompletionRate,
      habitStats,
    };
  }

  static calculateHabitStats(habitId: string, habitName: string, logs: any[], frequency: HabitFrequency): HabitStats {
    const sortedLogs = logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    const totalLogs = logs.length;
    const lastCompleted = sortedLogs.length > 0 ? sortedLogs[0].date : undefined;
    
    // Calculate current streak
    const currentStreak = this.calculateCurrentStreak(sortedLogs, frequency);
    
    // Calculate longest streak
    const longestStreak = this.calculateLongestStreak(sortedLogs, frequency);
    
    // Calculate completion rate (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentLogs = logs.filter(log => new Date(log.date) >= thirtyDaysAgo);
    const expectedDays = this.getExpectedDays(frequency, 30);
    const completionRate = expectedDays > 0 ? (recentLogs.length / expectedDays) * 100 : 0;

    return {
      habitId,
      habitName,
      totalLogs,
      currentStreak,
      longestStreak,
      completionRate: Math.min(completionRate, 100),
      lastCompleted,
    };
  }

  private static calculateCurrentStreak(logs: any[], frequency: HabitFrequency): number {
    if (logs.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = 0;
    let currentDate = new Date(today);
    
    for (const log of logs) {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);
      
      if (this.shouldHaveLog(currentDate, frequency)) {
        const hasLog = logs.some(l => {
          const ld = new Date(l.date);
          ld.setHours(0, 0, 0, 0);
          return ld.getTime() === currentDate.getTime();
        });
        
        if (hasLog) {
          streak++;
        } else {
          break;
        }
      }
      
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
  }

  private static calculateLongestStreak(logs: any[], frequency: HabitFrequency): number {
    if (logs.length === 0) return 0;

    let longestStreak = 0;
    let currentStreak = 0;
    
    const sortedLogs = logs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    for (let i = 0; i < sortedLogs.length; i++) {
      if (i === 0) {
        currentStreak = 1;
      } else {
        const prevDate = new Date(sortedLogs[i - 1].date);
        const currentDate = new Date(sortedLogs[i].date);
        
        if (this.isConsecutive(prevDate, currentDate, frequency)) {
          currentStreak++;
        } else {
          longestStreak = Math.max(longestStreak, currentStreak);
          currentStreak = 1;
        }
      }
    }
    
    return Math.max(longestStreak, currentStreak);
  }

  private static shouldHaveLog(date: Date, frequency: HabitFrequency): boolean {
    switch (frequency) {
      case 'DAILY':
        return true;
      case 'WEEKLY':
        return date.getDay() === 1; // Monday
      case 'MONTHLY':
        return date.getDate() === 1;
      default:
        return true;
    }
  }

  private static isConsecutive(date1: Date, date2: Date, frequency: HabitFrequency): boolean {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    switch (frequency) {
      case 'DAILY':
        return diffDays === 1;
      case 'WEEKLY':
        return diffDays === 7;
      case 'MONTHLY':
        return diffDays >= 28 && diffDays <= 31;
      default:
        return diffDays === 1;
    }
  }

  private static getExpectedDays(frequency: HabitFrequency, days: number): number {
    switch (frequency) {
      case 'DAILY':
        return days;
      case 'WEEKLY':
        return Math.floor(days / 7);
      case 'MONTHLY':
        return Math.floor(days / 30);
      default:
        return days;
    }
  }
}