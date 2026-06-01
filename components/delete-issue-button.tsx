'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function DeleteIssueButton({
  id,
  redirectTo,
}: {
  id: string
  redirectTo?: string
}) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [pending, setPending] = useState(false)

  async function handleDelete() {
    setPending(true)
    await new Promise((resolve) => setTimeout(resolve, 250))
    toast.success('Issue deleted in demo mode')
    if (redirectTo) {
      router.push(redirectTo)
    }
    setPending(false)
    setConfirming(false)
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">Sure?</span>
        <button
          onClick={handleDelete}
          disabled={pending}
          className="text-xs text-red-600 hover:text-red-800 font-medium"
        >
          {pending ? 'Deleting...' : 'Yes, delete'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      data-issue-id={id}
      className="text-xs text-red-500 hover:text-red-700"
    >
      Delete
    </button>
  )
}
