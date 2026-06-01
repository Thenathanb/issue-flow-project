export const revalidate = 30

import { prisma } from '@/lib/prisma'
import { Suspense } from 'react'
import Link from 'next/link'
import IssueActions from '@/app/issues/issue-actions'
import DeleteIssueButton from '@/components/delete-issue-button'

const ITEMS_PER_PAGE = 5

type SearchParams = {
  status?: string
  priority?: string
  page?: string
  sort?: string
  order?: string
}

async function IssueTable({ searchParams }: { searchParams: SearchParams }) {
  const page = Number(searchParams.page) || 1
  const sort = searchParams.sort || 'createdAt'
  const order = (searchParams.order || 'desc') as 'asc' | 'desc'

  const where = {
    ...(searchParams.status && { status: searchParams.status as any }),
    ...(searchParams.priority && { priority: searchParams.priority as any }),
  }

  const [issues, total] = await Promise.all([
    prisma.issue.findMany({
      where,
      orderBy: { [sort]: order },
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
      include: { assignedTo: true, createdBy: true },
    }),
    prisma.issue.count({ where }),
  ])

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)
  const hasFilters = !!(searchParams.status || searchParams.priority)

  function sortUrl(column: string) {
    const newOrder = sort === column && order === 'asc' ? 'desc' : 'asc'
    const params = new URLSearchParams({
      ...searchParams,
      sort: column,
      order: newOrder,
      page: '1',
    })
    return `/issues?${params.toString()}`
  }

  function SortIcon({ column }: { column: string }) {
    if (sort !== column) return <span className="text-gray-300 ml-1">↕</span>
    return <span className="text-blue-500 ml-1">{order === 'asc' ? '↑' : '↓'}</span>
  }

  if (issues.length === 0) {
    return (
      <div className="bg-white border rounded-lg p-12 text-center">
        <p className="text-gray-500 mb-3">No issues found</p>
        {hasFilters && (
          <Link href="/issues" className="text-sm text-blue-600 hover:underline">
            Clear filters
          </Link>
        )}
      </div>
    )
  }

  return (
    <div>
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                <Link href={sortUrl('title')}>Title <SortIcon column="title" /></Link>
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                <Link href={sortUrl('status')}>Status <SortIcon column="status" /></Link>
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                <Link href={sortUrl('priority')}>Priority <SortIcon column="priority" /></Link>
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Assigned To</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                <Link href={sortUrl('createdAt')}>Created <SortIcon column="createdAt" /></Link>
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {issues.map((issue) => (
              <tr key={issue.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">
                  <Link
                    href={`/issues/${issue.id}`}
                    className="text-gray-900 hover:text-blue-600"
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
                <td className="px-4 py-3 text-gray-600">{issue.assignedTo?.name ?? '—'}</td>
                <td className="px-4 py-3 text-gray-400">
                  {new Date(issue.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <DeleteIssueButton id={issue.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
        <p>{total} total issues</p>
        <div className="flex gap-2">
          {page > 1 && (
            <Link
              href={`/issues?${new URLSearchParams({ ...searchParams, page: String(page - 1) })}`}
              className="px-3 py-1 border rounded hover:bg-gray-100"
            >
              Previous
            </Link>
          )}
          {page < totalPages && (
            <Link
              href={`/issues?${new URLSearchParams({ ...searchParams, page: String(page + 1) })}`}
              className="px-3 py-1 border rounded hover:bg-gray-100"
            >
              Next
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

function IssueTableSkeleton() {
  return (
    <div className="bg-white border rounded-lg overflow-hidden animate-pulse">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            {['Title', 'Status', 'Priority', 'Assigned To', 'Created', 'Actions'].map((h) => (
              <th key={h} className="text-left px-4 py-3">
                <div className="h-4 bg-gray-200 rounded w-16" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i}>
              <td className="px-4 py-3"><div className="h-4 bg-gray-100 rounded w-48" /></td>
              <td className="px-4 py-3"><div className="h-5 bg-gray-100 rounded-full w-16" /></td>
              <td className="px-4 py-3"><div className="h-5 bg-gray-100 rounded-full w-14" /></td>
              <td className="px-4 py-3"><div className="h-4 bg-gray-100 rounded w-24" /></td>
              <td className="px-4 py-3"><div className="h-4 bg-gray-100 rounded w-20" /></td>
              <td className="px-4 py-3"><div className="h-4 bg-gray-100 rounded w-12" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default async function IssuesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const [params, users] = await Promise.all([
    searchParams,
    prisma.user.findMany({ select: { id: true, name: true } }),
  ])

  function filterUrl(key: string, value: string) {
    const current = new URLSearchParams(params as any)
    if (current.get(key) === value) {
      current.delete(key)
    } else {
      current.set(key, value)
      current.set('page', '1')
    }
    return `/issues?${current.toString()}`
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Issues</h2>
        <IssueActions users={users} />
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        <span className="text-sm text-gray-500 self-center">Status:</span>
        {['OPEN', 'IN_PROGRESS', 'CLOSED'].map((s) => (
          <Link
            key={s}
            href={filterUrl('status', s)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              params.status === s
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
            }`}
          >
            {s.replace('_', ' ')}
          </Link>
        ))}
        <span className="text-sm text-gray-500 self-center ml-2">Priority:</span>
        {['HIGH', 'MEDIUM', 'LOW'].map((p) => (
          <Link
            key={p}
            href={filterUrl('priority', p)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              params.priority === p
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
            }`}
          >
            {p}
          </Link>
        ))}
      </div>

      <Suspense fallback={<IssueTableSkeleton />}>
        <IssueTable searchParams={params} />
      </Suspense>
    </div>
  )
}
