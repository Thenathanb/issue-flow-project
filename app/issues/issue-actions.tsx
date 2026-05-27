'use client'

import { useState } from 'react'
import NewIssueDialog from '@/components/new-issue-dialog'

export default function IssueActions() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
      >
        New Issue
      </button>
      {open && <NewIssueDialog onClose={() => setOpen(false)} />}
    </>
  )
}
