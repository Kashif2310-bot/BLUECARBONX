import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/shared/Sidebar'
import '../../pages/community/DashboardLayout.css'

export default function IndustryLayout() {
  return (
    <div className="dashboard-layout">
      <Sidebar role="industry" />
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  )
}
