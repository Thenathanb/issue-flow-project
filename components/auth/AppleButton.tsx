'use client'

import { useState } from 'react'
import { OAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'

export function AppleButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleClick = async () => {
    setLoading(true)
    setError('')
    try {
      const provider = new OAuthProvider('apple.com')
      provider.addScope('email')
      provider.addScope('name')
      await signInWithPopup(auth, provider)
      router.push('/dashboard')
    } catch (err: unknown) {
      const code = (err as { code?: string }).code || ''
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        setLoading(false)
        return
      }
      setError(
        code === 'auth/unauthorized-domain'
          ? 'This domain is not authorised — add it in the Firebase console.'
          : code === 'auth/operation-not-allowed'
          ? 'Apple sign-in is not enabled in the Firebase console.'
          : code === 'auth/popup-blocked'
          ? 'Popup was blocked — please allow popups for this site.'
          : `Sign-in failed (${code || 'unknown error'})`
      )
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <button
        onClick={handleClick}
        disabled={loading}
        className="flex items-center justify-center gap-3 w-full border border-gray-300 rounded-md py-2 px-4 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
      >
        <AppleIcon />
        {loading ? 'Signing in…' : 'Continue with Apple'}
      </button>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.42c1.39.07 2.35.77 3.17.8 1.2-.24 2.35-1 3.67-.85 1.57.18 2.74.85 3.51 2.12-3.2 1.95-2.69 6.22.47 7.48-.57 1.47-1.31 2.93-2.82 4.31zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
    </svg>
  )
}
