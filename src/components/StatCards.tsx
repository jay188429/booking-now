import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

interface Booking {
  id: string
  date: string
  status: 'pending' | 'confirmed'
}

interface StatCardData {
  todayCount: number
  confirmationRate: number
  weeklyCount: number
}

interface StatCardsProps {
  refreshKey?: number
}

export default function StatCards({ refreshKey }: StatCardsProps) {
  const [stats, setStats] = useState<StatCardData>({
    todayCount: 0,
    confirmationRate: 0,
    weeklyCount: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [refreshKey])

  async function fetchStats() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('id, date, status')

      if (error) throw error

      const bookings = (data || []) as Booking[]

      // Calculate today's count
      const today = new Date().toISOString().split('T')[0]
      const todayCount = bookings.filter((b) => b.date === today).length

      // Calculate confirmation rate
      const totalCount = bookings.length
      const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length
      const confirmationRate = totalCount > 0 ? Math.round((confirmedCount / totalCount) * 1000) / 10 : 0

      // Calculate weekly count (Monday to Friday of current week)
      const weeklyCount = calculateWeeklyCount(bookings)

      setStats({
        todayCount,
        confirmationRate,
        weeklyCount,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
      setStats({
        todayCount: 0,
        confirmationRate: 0,
        weeklyCount: 0,
      })
    } finally {
      setLoading(false)
    }
  }

  function calculateWeeklyCount(bookings: Booking[]): number {
    const today = new Date()
    const currentDay = today.getDay()

    // Calculate Monday of current week
    const mondayDate = new Date(today)
    mondayDate.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1))
    mondayDate.setHours(0, 0, 0, 0)

    // Calculate Friday of current week
    const fridayDate = new Date(mondayDate)
    fridayDate.setDate(mondayDate.getDate() + 4)
    fridayDate.setHours(23, 59, 59, 999)

    const mondayStr = mondayDate.toISOString().split('T')[0]
    const fridayStr = fridayDate.toISOString().split('T')[0]

    return bookings.filter((b) => b.date >= mondayStr && b.date <= fridayStr).length
  }

  if (loading) {
    return (
      <div className="mb-6 flex gap-4">
        <div className="flex-1 h-24 bg-gray-100 rounded-lg animate-pulse"></div>
        <div className="flex-1 h-24 bg-gray-100 rounded-lg animate-pulse"></div>
        <div className="flex-1 h-24 bg-gray-100 rounded-lg animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="mb-6 flex flex-wrap gap-4">
      <div className="flex-1 min-w-60 p-6 bg-white rounded-lg shadow-md">
        <div className="text-4xl font-bold text-blue-600">{stats.todayCount}</div>
        <div className="mt-2 text-sm text-gray-600">오늘 예약 수</div>
      </div>

      <div className="flex-1 min-w-60 p-6 bg-white rounded-lg shadow-md">
        <div className="text-4xl font-bold text-green-600">{stats.confirmationRate}%</div>
        <div className="mt-2 text-sm text-gray-600">확정률</div>
      </div>

      <div className="flex-1 min-w-60 p-6 bg-white rounded-lg shadow-md">
        <div className="text-4xl font-bold text-purple-600">{stats.weeklyCount}</div>
        <div className="mt-2 text-sm text-gray-600">이번 주 총 건수</div>
      </div>
    </div>
  )
}
