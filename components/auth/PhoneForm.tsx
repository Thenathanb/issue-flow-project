'use client'

import { useEffect, useRef, useState } from 'react'
import {
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithCredential,
  signInWithPhoneNumber,
  type ConfirmationResult,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'

export function PhoneForm() {
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'phone' | 'code'>('phone')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const confirmationRef = useRef<ConfirmationResult | null>(null)
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    return () => { recaptchaRef.current?.clear() }
  }, [])

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (!recaptchaRef.current) {
        recaptchaRef.current = new RecaptchaVerifier(auth, containerRef.current!, {
          size: 'invisible',
        })
      }
      confirmationRef.current = await signInWithPhoneNumber(auth, phone, recaptchaRef.current)
      setStep('code')
    } catch (err: unknown) {
      const c = (err as { code?: string }).code || ''
      setError(
        c === 'auth/invalid-phone-number'
          ? 'Invalid phone number — include country code e.g. +1 555 000 0000'
          : c === 'auth/too-many-requests'
          ? 'Too many attempts — try again later.'
          : `Failed to send code (${c || 'unknown error'})`
      )
      recaptchaRef.current?.clear()
      recaptchaRef.current = null
    } finally {
      setLoading(false)
    }
  }

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!confirmationRef.current) return
    setError('')
    setLoading(true)
    try {
      const credential = PhoneAuthProvider.credential(
        (confirmationRef.current as unknown as { verificationId: string }).verificationId,
        code
      )
      await signInWithCredential(auth, credential)
      router.push('/dashboard')
    } catch (err: unknown) {
      const c = (err as { code?: string }).code || ''
      setError(
        c === 'auth/invalid-verification-code' ? 'Incorrect code — please try again.' :
        c === 'auth/code-expired' ? 'Code expired — request a new one.' :
        `Verification failed (${c || 'unknown error'})`
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      {/* invisible reCAPTCHA anchor */}
      <div ref={containerRef} />

      {step === 'phone' ? (
        <form onSubmit={sendCode} className="space-y-3">
          <input
            type="tel"
            placeholder="+1 555 000 0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Sending…' : 'Send code'}
          </button>
        </form>
      ) : (
        <form onSubmit={verifyCode} className="space-y-3">
          <p className="text-xs text-gray-500">Code sent to {phone}</p>
          <input
            type="text"
            placeholder="6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            maxLength={6}
            inputMode="numeric"
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 tracking-widest"
          />
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Verifying…' : 'Verify'}
          </button>
          <button
            type="button"
            onClick={() => { setStep('phone'); setCode(''); setError('') }}
            className="w-full text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Use a different number
          </button>
        </form>
      )}
    </div>
  )
}
