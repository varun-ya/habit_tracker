import { prisma } from '@/lib/prisma';
import { HabitLog } from '@prisma/client';
import { CreateHabitLogInput, UpdateHabitLogInput } from '../validations/habit-log';

export class HabitLogService {
  static async logHabit(userId: string, data: CreateHabitLogInput): Promise<HabitLog> {
    // Check if habit belongs to user
    const habit = await prisma.habit.findFirst({
      where: { id: data.habitId, userId },
    });

    if (!habit) {
      throw new Error('Habit not found');
    }

    // Check if log already exists for this date
    const existingLog = await prisma.habitLog.findFirst({
      where: {
        habitId: data.habitId,
        date: data.date,
      },
    });

    if (existingLog) {
      throw new Error('Log already exists for this date');
    }

    return prisma.habitLog.create({
      data,
    });
  }

  static async updateHabitLog(id: string, userId: string, data: UpdateHabitLogInput): Promise<HabitLog> {
    // Verify the log belongs to the user's habit
    const log = await prisma.habitLog.findFirst({
      where: { id },
      include: { habit: true },
    });

    if (!log || log.habit.userId !== userId) {
      throw new Error('Log not found');
    }

    return prisma.habitLog.update({
      where: { id },
      data,
    });
  }

  static async deleteHabitLog(id: string, userId: string): Promise<void> {
    const log = await prisma.habitLog.findFirst({
      where: { id },
      include: { habit: true },
    });

    if (!log || log.habit.userId !== userId) {
      throw new Error('Log not found');
    }

    await prisma.habitLog.delete({
      where: { id },
    });
  }

  static async toggleHabitLog(habitId: string, date: string): Promise<HabitLog> {
    const dateObj = new Date(date)
    
    // Check if log already exists
    const existingLog = await prisma.habitLog.findFirst({
      where: {
        habitId,
        date: dateObj,
      },
    })

    if (existingLog) {
      // Toggle the completed status
      return prisma.habitLog.update({
        where: { id: existingLog.id },
        data: { completed: !existingLog.completed },
      })
    } else {
      // Create new log
      return prisma.habitLog.create({
        data: {
          habitId,
          date: dateObj,
          completed: true,
        },
      })
    }
  }

  static async getHabitLogs(habitId: string, limit = 30): Promise<HabitLog[]> {
    return prisma.habitLog.findMany({
      where: { habitId },
      orderBy: { date: 'desc' },
      take: limit,
    })
  }

  static async getLogByDate(habitId: string, date: Date, userId: string): Promise<HabitLog | null> {
    const habit = await prisma.habit.findFirst({
      where: { id: habitId, userId },
    });

    if (!habit) {
      return null;
    }

    return prisma.habitLog.findFirst({
      where: {
        habitId,
        date,
      },
    });
  }
}