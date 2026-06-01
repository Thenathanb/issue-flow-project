export const revalidate = 60

import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import IssueCharts from '@/app/dashboard/charts'

export default async function DashboardPage() {
  const [total, open, inProgress, closed, lowCount, mediumCount, highCount, recent] =
    await Promise.all([
      prisma.issue.count(),
      prisma.issue.count({ where: { status: 'OPEN' } }),
      prisma.issue.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.issue.count({ where: { status: 'CLOSED' } }),
      prisma.issue.count({ where: { priority: 'LOW' } }),
      prisma.issue.count({ where: { priority: 'MEDIUM' } }),
      prisma.issue.count({ where: { priority: 'HIGH' } }),
      prisma.issue.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { assignedTo: true },
      }),
    ])

  const statusData = [
    { name: 'Open', value: open, color: '#3b82f6' },
    { name: 'In Progress', value: inProgress, color: '#eab308' },
    { name: 'Closed', value: closed, color: '#22c55e' },
  ]

  const priorityData = [
    { name: 'Low', value: lowCount, color: '#6b7280' },
    { name: 'Medium', value: mediumCount, color: '#f97316' },
    { name: 'High', value: highCount, color: '#ef4444' },
  ]

  const stats = [
    { label: 'Total Issues', value: total, color: 'text-gray-900' },
    { label: 'Open', value: open, color: 'text-blue-600' },
    { label: 'In Progress', value: inProgress, color: 'text-yellow-600' },
    { label: 'Closed', value: closed, color: 'text-green-600' },
  ]

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Dashboard</h2>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, color }) => (
          <div key={label} className="bg-white border rounded-lg p-4">
            <p className="text-sm text-gray-500">{label}</p>
            <p className={`text-3xl font-semibold mt-1 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <IssueCharts statusData={statusData} priorityData={priorityData} />

      <div className="mt-8 bg-white border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700">Recent Issues</h3>
          <Link href="/issues" className="text-xs text-blue-600 hover:underline">
            View all
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-gray-400">No issues yet</div>
        ) : (
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-100">
              {recent.map((issue) => (
                <tr key={issue.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/issues/${issue.id}`}
                      className="font-medium text-gray-900 hover:text-blue-600"
                    >
                      {issue.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      issue.status === 'OPEN'
                        ? 'bg-blue-100 text-blue-700'
                        : issue.status === 'IN_PROGRESS'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {issue.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      issue.priority === 'HIGH'
                        ? 'bg-red-100 text-red-700'
                        : issue.priority === 'MEDIUM'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {issue.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(issue.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
