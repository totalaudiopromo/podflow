import DashboardShell from './DashboardShell'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardShell userEmail="pr@totalaudiopromo.com" userName="Total Audio PR">
      {children}
    </DashboardShell>
  )
}
