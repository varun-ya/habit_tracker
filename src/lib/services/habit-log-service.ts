import { db } from '@/lib/db'
import { habitLogs } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export class HabitLogService {
  async toggleHabitLog(habitId: string, date: string) {
    const existingLog = await db
      .select()
      .from(habitLogs)
      .where(and(eq(habitLogs.habitId, habitId), eq(habitLogs.date, date)))
      .limit(1)

    if (existingLog.length > 0) {
      await db
        .delete(habitLogs)
        .where(and(eq(habitLogs.habitId, habitId), eq(habitLogs.date, date)))
      
      return { action: 'removed', date }
    } else {
      const [log] = await db
        .insert(habitLogs)
        .values({ habitId, date })
        .returning()
      
      return { action: 'added', date, log }
    }
  }

  async getHabitLogs(habitId: string) {
    return db.select().from(habitLogs).where(eq(habitLogs.habitId, habitId))
  }

  async getLogsInDateRange(habitId: string, startDate: string, endDate: string) {
    return db
      .select()
      .from(habitLogs)
      .where(
        and(
          eq(habitLogs.habitId, habitId),
          eq(habitLogs.date, startDate), // This should use gte/lte for range
          eq(habitLogs.date, endDate)
        )
      )
  }
}

export const habitLogService = new HabitLogService()