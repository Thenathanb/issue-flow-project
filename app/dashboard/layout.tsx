import Sidebar from '@/components/sidebar'

const demoUser = {
  id: "demo-user",
  name: "Demo User",
  email: "demo@example.com",
  emailVerified: null,
  image: null,
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar user={demoUser} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
