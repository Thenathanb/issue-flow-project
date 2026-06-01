export default function IssuesLoading() {
  return (
    <div className="p-6 animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="h-7 bg-gray-200 rounded w-20" />
        <div className="h-9 bg-gray-200 rounded w-24" />
      </div>

      <div className="flex gap-2 mb-4">
        <div className="h-4 bg-gray-200 rounded w-12" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-6 bg-gray-100 rounded-full w-20" />
        ))}
        <div className="h-4 bg-gray-200 rounded w-14 ml-2" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-6 bg-gray-100 rounded-full w-16" />
        ))}
      </div>

      <div className="bg-white border rounded-lg overflow-hidden">
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
    </div>
  )
}
