import { MainLayout } from '../layouts/index.js'
import Dashboard from '../components/sections/Dashboard.jsx'

export default function DashboardPage() {
  return (
    <MainLayout withFooter={false}>
      <main className="pt-16">
        <Dashboard />
      </main>
    </MainLayout>
  )
}
