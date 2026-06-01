import Link from 'next/link'

export default function IssueNotFound() {
  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-64">
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">Issue not found</h2>
      <p className="text-sm text-gray-500 mb-6">
        The issue you&apos;re looking for doesn&apos;t exist or may have been deleted.
      </p>
      <Link
        href="/issues"
        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
      >
        Back to Issues
      </Link>
    </div>
  )
}
