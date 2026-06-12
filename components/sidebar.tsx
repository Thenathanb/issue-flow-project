'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/lib/auth-context'

type SidebarUser = {
  name?: string | null
  photoURL?: string | null
}

export default function Sidebar({ user }: { user: SidebarUser }) {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    router.replace('/login')
  }

  const initials = user?.name?.[0]?.toUpperCase() ?? '?'

  return (
    <aside className="w-56 bg-white border-r flex flex-col">
      <div className="p-4 border-b">
        <h1 className="font-semibold text-gray-900">IssueFlow</h1>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        <Link
          href="/dashboard"
          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
            pathname.startsWith('/dashboard')
              ? 'bg-gray-100 text-gray-900 font-medium'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Dashboard
        </Link>
        <Link
          href="/issues"
          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
            pathname.startsWith('/issues')
              ? 'bg-gray-100 text-gray-900 font-medium'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Issues
        </Link>
      </nav>

      <div className="p-3 border-t">
        <div className="flex items-center gap-2 px-3 py-2 mb-1">
          {user?.photoURL ? (
            <Image
              src={user.photoURL}
              alt={user.name ?? ''}
              width={24}
              height={24}
              className="rounded-full"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-700">
              {initials}
            </div>
          )}
          <span className="text-sm text-gray-700 truncate">{user?.name ?? 'User'}</span>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full text-left block px-3 py-2 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md"
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}
