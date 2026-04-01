import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/shared/Sidebar'
import '../../pages/community/DashboardLayout.css'

export default function AdminLayout() {
  return (
    <div className="dashboard-layout">
      <Sidebar role="admin" />
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  )
}
