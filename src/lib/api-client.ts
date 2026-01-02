'use client'

import { HabitWithLogs } from '@/types/habit'

class ApiClient {
  private cache = new Map<string, { data: any; timestamp: number }>()
  private pendingRequests = new Map<string, Promise<any>>()
  private readonly CACHE_TTL = 30000 // 30 seconds

  private getCacheKey(url: string, options?: RequestInit): string {
    return `${url}:${JSON.stringify(options)}`
  }

  private isValidCache(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_TTL
  }

  private async request<T>(url: string, options?: RequestInit): Promise<T> {
    const cacheKey = this.getCacheKey(url, options)
    
    // Return cached data if valid
    if (options?.method === 'GET' || !options?.method) {
      const cached = this.cache.get(cacheKey)
      if (cached && this.isValidCache(cached.timestamp)) {
        return cached.data
      }
    }

    // Deduplicate concurrent requests
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey)!
    }

    const requestPromise = this.executeRequest<T>(url, options)
    this.pendingRequests.set(cacheKey, requestPromise)

    try {
      const data = await requestPromise
      
      // Cache GET requests
      if (options?.method === 'GET' || !options?.method) {
        this.cache.set(cacheKey, { data, timestamp: Date.now() })
      }
      
      return data
    } finally {
      this.pendingRequests.delete(cacheKey)
    }
  }

  private async executeRequest<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  invalidateCache(pattern?: string) {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key)
        }
      }
    } else {
      this.cache.clear()
    }
  }

  // Habits API
  async getHabits(): Promise<HabitWithLogs[]> {
    return this.request('/api/habits')
  }

  async createHabit(data: any) {
    const result = await this.request('/api/habits', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    this.invalidateCache('/api/habits')
    return result
  }

  async updateHabit(id: string, data: any) {
    const result = await this.request(`/api/habits/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    this.invalidateCache('/api/habits')
    return result
  }

  async deleteHabit(id: string) {
    const result = await this.request(`/api/habits/${id}`, {
      method: 'DELETE',
    })
    this.invalidateCache('/api/habits')
    return result
  }

  // Habit Logs API
  async toggleHabitLog(habitId: string, date: string) {
    const result = await this.request('/api/habit-logs', {
      method: 'POST',
      body: JSON.stringify({ habitId, date }),
    })
    this.invalidateCache('/api/habits')
    this.invalidateCache('/api/analytics')
    return result
  }

  async getHabitLogs(habitId: string) {
    return this.request(`/api/habit-logs?habitId=${habitId}`)
  }

  // Analytics API
  async getAnalytics(params?: { period?: string; startDate?: string; endDate?: string }) {
    const searchParams = new URLSearchParams()
    if (params?.period) searchParams.set('period', params.period)
    if (params?.startDate) searchParams.set('startDate', params.startDate)
    if (params?.endDate) searchParams.set('endDate', params.endDate)
    
    const url = `/api/analytics${searchParams.toString() ? `?${searchParams}` : ''}`
    return this.request(url)
  }
}

export const apiClient = new ApiClient()