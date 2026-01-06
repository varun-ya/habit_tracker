import { prisma } from '@/lib/prisma';
import { Habit, HabitLog } from '@prisma/client';
import { CreateHabitInput, UpdateHabitInput } from '../validations/habit';

export class HabitService {
  static async createHabit(userEmail: string, data: CreateHabitInput): Promise<Habit> {
    // Find or create user
    let user = await prisma.user.findUnique({ where: { email: userEmail } })
    if (!user) {
      user = await prisma.user.create({
        data: { email: userEmail, name: userEmail.split('@')[0] }
      })
    }

    return prisma.habit.create({
      data: {
        ...data,
        userId: user.id,
      },
    });
  }

  static async getUserHabits(userEmail: string): Promise<Habit[]> {
    const user = await prisma.user.findUnique({ where: { email: userEmail } })
    if (!user) return []
    
    return prisma.habit.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getHabitById(id: string, userEmail: string): Promise<Habit | null> {
    const user = await prisma.user.findUnique({ where: { email: userEmail } })
    if (!user) return null
    
    return prisma.habit.findFirst({
      where: { id, userId: user.id },
    });
  }

  static async updateHabit(id: string, userEmail: string, data: UpdateHabitInput): Promise<Habit> {
    const user = await prisma.user.findUnique({ where: { email: userEmail } })
    if (!user) throw new Error('User not found')
    
    return prisma.habit.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  static async deleteHabit(id: string, userEmail: string): Promise<boolean> {
    const user = await prisma.user.findUnique({ where: { email: userEmail } })
    if (!user) return false
    
    try {
      await prisma.habit.delete({
        where: { id },
      });
      return true
    } catch {
      return false
    }
  }

  static async getHabitWithLogs(id: string, userEmail: string) {
    const user = await prisma.user.findUnique({ where: { email: userEmail } })
    if (!user) return null
    
    return prisma.habit.findFirst({
      where: { id, userId: user.id },
      include: {
        logs: {
          orderBy: { date: 'desc' },
          take: 30,
        },
      },
    });
  }
}