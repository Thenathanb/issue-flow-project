export const revalidate = 0

import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import IssueDetailActions from '@/app/issues/[id]/issue-detail-actions'

export default async function IssueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [issue, users] = await Promise.all([
    prisma.issue.findUnique({
      where: { id },
      include: { assignedTo: true, createdBy: true },
    }),
    prisma.user.findMany({ select: { id: true, name: true } }),
  ])

  if (!issue) notFound()

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/issues"
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          ← Back to Issues
        </Link>
        <IssueDetailActions issue={issue} users={users} />
      </div>

      <div className="bg-white border rounded-lg p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-xl font-semibold text-gray-900">{issue.title}</h1>
          <div className="flex gap-2 shrink-0">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              issue.status === 'OPEN'
                ? 'bg-blue-100 text-blue-700'
                : issue.status === 'IN_PROGRESS'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-green-100 text-green-700'
            }`}>
              {issue.status.replace('_', ' ')}
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              issue.priority === 'HIGH'
                ? 'bg-red-100 text-red-700'
                : issue.priority === 'MEDIUM'
                ? 'bg-orange-100 text-orange-700'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {issue.priority}
            </span>
          </div>
        </div>

        {issue.description && (
          <p className="text-gray-600 text-sm mb-6 whitespace-pre-wrap">{issue.description}</p>
        )}

        <dl className="grid grid-cols-2 gap-4 text-sm border-t pt-4">
          <div>
            <dt className="text-gray-500 mb-1">Assigned to</dt>
            <dd className="font-medium text-gray-900">{issue.assignedTo?.name ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-gray-500 mb-1">Created by</dt>
            <dd className="font-medium text-gray-900">{issue.createdBy?.name ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-gray-500 mb-1">Created</dt>
            <dd className="text-gray-700">{new Date(issue.createdAt).toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-gray-500 mb-1">Last updated</dt>
            <dd className="text-gray-700">{new Date(issue.updatedAt).toLocaleString()}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
