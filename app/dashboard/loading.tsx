export default function DashboardLoading() {
  return (
    <div className="p-6 animate-pulse">
      <div className="h-7 bg-gray-200 rounded w-28 mb-6" />

      <div className="grid grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border rounded-lg p-4">
            <div className="h-4 bg-gray-200 rounded w-20 mb-2" />
            <div className="h-9 bg-gray-100 rounded w-12" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white border rounded-lg p-4">
            <div className="h-4 bg-gray-200 rounded w-32 mb-4" />
            <div className="h-48 bg-gray-100 rounded" />
          </div>
        ))}
      </div>

      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b">
          <div className="h-4 bg-gray-200 rounded w-24" />
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="px-4 py-3 border-b last:border-0 flex items-center gap-4">
            <div className="h-4 bg-gray-100 rounded w-48" />
            <div className="h-5 bg-gray-100 rounded-full w-16" />
            <div className="h-4 bg-gray-100 rounded w-20 ml-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}
