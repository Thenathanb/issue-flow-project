'use client'

import { useState } from 'react'
import { deleteIssue } from '@/lib/actions'
import { toast } from 'sonner'

export default function DeleteIssueButton({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false)
  const [pending, setPending] = useState(false)

  async function handleDelete() {
    setPending(true)
    const result = await deleteIssue(id)
    if (result.success) {
      toast.success(result.message)
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
      className="text-xs text-red-500 hover:text-red-700"
    >
      Delete
    </button>
  )
}
