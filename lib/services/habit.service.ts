import { prisma } from '@/lib/prisma';
import { Habit, HabitLog } from '@prisma/client';
import { CreateHabitInput, UpdateHabitInput } from '@/lib/validations/habit';

export class HabitService {
  static async createHabit(userId: string, data: CreateHabitInput): Promise<Habit> {
    return prisma.habit.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  static async getUserHabits(userId: string): Promise<Habit[]> {
    return prisma.habit.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getHabitById(id: string, userId: string): Promise<Habit | null> {
    return prisma.habit.findFirst({
      where: { id, userId },
    });
  }

  static async updateHabit(id: string, userId: string, data: UpdateHabitInput): Promise<Habit> {
    return prisma.habit.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  static async deleteHabit(id: string, userId: string): Promise<void> {
    await prisma.habit.delete({
      where: { id },
    });
  }

  static async getHabitWithLogs(id: string, userId: string) {
    return prisma.habit.findFirst({
      where: { id, userId },
      include: {
        logs: {
          orderBy: { date: 'desc' },
          take: 30,
        },
      },
    });
  }
}