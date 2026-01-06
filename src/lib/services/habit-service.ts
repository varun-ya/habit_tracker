import { prisma } from '@/lib/prisma'
import { HabitWithLogs } from '@/types/habit'

export class HabitService {
  static async getUserHabits(userEmail: string): Promise<HabitWithLogs[]> {
    const user = await prisma.user.findUnique({ where: { email: userEmail } })
    if (!user) return []
    
    const habits = await prisma.habit.findMany({
      where: { userId: user.id },
      include: { logs: true },
      orderBy: { createdAt: 'desc' }
    })
    return habits
  }

  static async createHabit(userEmail: string, data: { habitName: string; frequency: string }) {
    const user = await prisma.user.upsert({
      where: { email: userEmail },
      create: { email: userEmail },
      update: {}
    })
    
    return await prisma.habit.create({
      data: {
        habitName: data.habitName,
        frequency: data.frequency,
        userId: user.id
      }
    })
  }

  static async updateHabit(id: string, data: { habitName: string; frequency: string }) {
    return await prisma.habit.update({
      where: { id },
      data
    })
  }

  static async deleteHabit(id: string) {
    await prisma.habitLog.deleteMany({ where: { habitId: id } })
    await prisma.habit.delete({ where: { id } })
    return { success: true }
  }
}

export const habitService = new HabitService()