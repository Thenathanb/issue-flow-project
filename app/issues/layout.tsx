import Link from 'next/link'
import { auth, signOut } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function IssuesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <h1 className="font-semibold text-gray-900">IssueFlow</h1>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-md text-gray-600 hover:bg-gray-100"
          >
            Dashboard
          </Link>
          <Link
            href="/issues"
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-gray-100 text-gray-900 font-medium"
          >
            Issues
          </Link>
        </nav>

        <div className="p-3 border-t">
          <div className="flex items-center gap-2 px-3 py-2 mb-1">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-700">
              {session.user?.name?.[0]}
            </div>
            <span className="text-sm text-gray-700 truncate">
              {session.user?.name}
            </span>
          </div>
          <form
            action={async () => {
              'use server'
              await signOut({ redirectTo: '/login' })
            }}
          >
            <button className="w-full text-left px-3 py-2 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md">
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
