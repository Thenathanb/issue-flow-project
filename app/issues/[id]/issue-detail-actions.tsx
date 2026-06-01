'use client'

import { useState } from 'react'
import EditIssueDialog from '@/components/edit-issue-dialog'
import DeleteIssueButton from '@/components/delete-issue-button'

type User = { id: string; name: string | null }

type Issue = {
  id: string
  title: string
  description: string | null
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  assignedToId: string | null
}

export default function IssueDetailActions({
  issue,
  users,
}: {
  issue: Issue
  users: User[]
}) {
  const [editOpen, setEditOpen] = useState(false)

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => setEditOpen(true)}
        className="px-3 py-1.5 text-sm border rounded-md text-gray-700 hover:bg-gray-50"
      >
        Edit
      </button>
      <DeleteIssueButton id={issue.id} redirectTo="/issues" />
      {editOpen && (
        <EditIssueDialog
          issue={issue}
          users={users}
          onClose={() => setEditOpen(false)}
        />
      )}
    </div>
  )
}
