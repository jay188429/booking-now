import { useState } from 'react'
import { signInWithGoogle } from '../lib/supabase'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError(null)
    try {
      await signInWithGoogle()
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Google 로그인에 실패했습니다'
      setError(message)
      console.error('Google sign in error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              예약 관리 허브
            </h1>
            <p className="text-gray-600">예약을 효율적으로 관리하세요</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-800 rounded-lg">
              <p className="font-medium">{error}</p>
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 transition-colors font-medium text-gray-800"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
            </svg>
            {loading ? '로그인 중...' : 'Google로 로그인'}
          </button>

          {/* Info Text */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Google 계정으로 안전하게 로그인하세요.
            <br />
            처음 방문이신가요? 자동으로 가입됩니다.
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          © 2024 예약 관리 허브. 모든 권리 보유.
        </p>
      </div>
    </div>
  )
}
