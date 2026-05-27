import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import IssueCharts from './charts'

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const [statusGroups, priorityGroups, recentIssues, total] = await Promise.all([
    prisma.issue.groupBy({
      by: ['status'],
      _count: { status: true },
    }),
    prisma.issue.groupBy({
      by: ['priority'],
      _count: { priority: true },
    }),
    prisma.issue.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { assignedTo: true },
    }),
    prisma.issue.count(),
  ])

  const statusData = [
    { name: 'Open', value: statusGroups.find((s) => s.status === 'OPEN')?._count.status ?? 0, color: '#3b82f6' },
    { name: 'In Progress', value: statusGroups.find((s) => s.status === 'IN_PROGRESS')?._count.status ?? 0, color: '#f59e0b' },
    { name: 'Closed', value: statusGroups.find((s) => s.status === 'CLOSED')?._count.status ?? 0, color: '#22c55e' },
  ]

  const priorityData = [
    { name: 'High', value: priorityGroups.find((p) => p.priority === 'HIGH')?._count.priority ?? 0, color: '#ef4444' },
    { name: 'Medium', value: priorityGroups.find((p) => p.priority === 'MEDIUM')?._count.priority ?? 0, color: '#f97316' },
    { name: 'Low', value: priorityGroups.find((p) => p.priority === 'LOW')?._count.priority ?? 0, color: '#6b7280' },
  ]

  const open = statusData[0].value
  const inProgress = statusData[1].value
  const closed = statusData[2].value

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Dashboard</h2>
        <p className="text-sm text-gray-500 mt-1">Overview of all issues</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Issues', value: total, color: 'text-gray-900' },
          { label: 'Open', value: open, color: 'text-blue-600' },
          { label: 'In Progress', value: inProgress, color: 'text-yellow-600' },
          { label: 'Closed', value: closed, color: 'text-green-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
            <p className={`text-3xl font-semibold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <IssueCharts statusData={statusData} priorityData={priorityData} />

      <div className="mt-8">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Recent issues</h3>
        <div className="bg-white border rounded-lg divide-y">
          {recentIssues.map((issue) => (
            <div key={issue.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-medium text-gray-900">{issue.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {issue.assignedTo?.name ?? 'Unassigned'} · {new Date(issue.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                issue.status === 'OPEN' ? 'bg-blue-100 text-blue-700' :
                issue.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {issue.status.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
