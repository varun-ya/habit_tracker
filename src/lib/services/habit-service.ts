import { db } from '@/lib/db'
import { habits, habitLogs } from '@/lib/db/schema'
import { eq, and, gte, lte, desc } from 'drizzle-orm'
import { HabitWithLogs } from '@/types/habit'

export class HabitService {
  async getHabits(): Promise<HabitWithLogs[]> {
    const habitsData = await db.select().from(habits).orderBy(desc(habits.createdAt))
    
    const habitsWithLogs = await Promise.all(
      habitsData.map(async (habit) => {
        const logs = await db
          .select()
          .from(habitLogs)
          .where(eq(habitLogs.habitId, habit.id))
          .orderBy(desc(habitLogs.date))
        
        return { ...habit, logs }
      })
    )
    
    return habitsWithLogs
  }

  async createHabit(data: { name: string; description?: string; color: string; frequency: string }) {
    const [habit] = await db.insert(habits).values(data).returning()
    return habit
  }

  async updateHabit(id: string, data: Partial<{ name: string; description?: string; color: string; frequency: string }>) {
    const [habit] = await db
      .update(habits)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(habits.id, id))
      .returning()
    
    return habit
  }

  async deleteHabit(id: string) {
    await db.delete(habitLogs).where(eq(habitLogs.habitId, id))
    await db.delete(habits).where(eq(habits.id, id))
    return { success: true }
  }

  async getHabitById(id: string) {
    const [habit] = await db.select().from(habits).where(eq(habits.id, id))
    return habit
  }
}

export const habitService = new HabitService()