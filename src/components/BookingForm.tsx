import { useState } from 'react'
import { supabase } from '../lib/supabase'

interface BookingFormProps {
  onSuccess?: () => void
}

export default function BookingForm({ onSuccess }: BookingFormProps) {
  const [formData, setFormData] = useState({
    customer: '',
    service: '',
    date: '',
    time: '',
    address: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (
      !formData.customer ||
      !formData.service ||
      !formData.date ||
      !formData.time
    ) {
      setError('고객사, 서비스, 날짜, 시간은 필수입니다')
      return
    }

    setLoading(true)

    try {
      const { error: insertError } = await supabase
        .from('bookings')
        .insert([
          {
            customer: formData.customer,
            service: formData.service,
            date: formData.date,
            time: formData.time,
            address: formData.address || '',
            status: 'pending',
            via: 'form',
          },
        ])

      if (insertError) throw insertError

      // Reset form
      setFormData({
        customer: '',
        service: '',
        date: '',
        time: '',
        address: '',
      })

      // Call onSuccess callback
      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '예약 추가에 실패했습니다'
      setError(message)
      console.error('Error inserting booking:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 p-4 bg-white rounded-lg shadow-md"
    >
      <h2 className="mb-4 text-lg font-semibold">새 예약 추가</h2>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="customer"
          placeholder="고객사"
          value={formData.customer}
          onChange={handleChange}
          className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        />

        <input
          type="text"
          name="service"
          placeholder="서비스"
          value={formData.service}
          onChange={handleChange}
          className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        />

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        />

        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        />

        <input
          type="text"
          name="address"
          placeholder="주소 (선택)"
          value={formData.address}
          onChange={handleChange}
          className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 md:col-span-2"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
      >
        {loading ? '추가 중...' : '예약하기'}
      </button>
    </form>
  )
}
