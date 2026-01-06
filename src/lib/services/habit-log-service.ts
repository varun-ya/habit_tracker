import { prisma } from '@/lib/prisma'

export class HabitLogService {
  static async toggleHabitLog(habitId: string, date: string) {
    const dateObj = new Date(date)
    
    const existingLog = await prisma.habitLog.findFirst({
      where: { 
        habitId, 
        date: {
          gte: new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()),
          lt: new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate() + 1)
        }
      }
    })

    if (existingLog) {
      await prisma.habitLog.delete({
        where: { id: existingLog.id }
      })
      return { action: 'removed', date }
    } else {
      const log = await prisma.habitLog.create({
        data: { 
          habitId, 
          date: dateObj,
          completed: true
        }
      })
      return { action: 'added', date, log }
    }
  }

  static async getHabitLogs(habitId: string) {
    return prisma.habitLog.findMany({
      where: { habitId }
    })
  }
}

export const habitLogService = new HabitLogService()

export const habitLogService = new HabitLogService()