import { MainLayout } from '../layouts/index.js'
import Dashboard from '../components/sections/Dashboard.jsx'
import SEO from '../components/SEO.jsx'

export default function DashboardPage() {
  return (
    <MainLayout withFooter={false}>
      <SEO title="Member Dashboard - THREE13 Fitness" description="View your workout plans, invoices, and profile." />
      <main className="pt-16">
        <Dashboard />
      </main>
    </MainLayout>
  )
}
