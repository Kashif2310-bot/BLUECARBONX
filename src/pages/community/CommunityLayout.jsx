import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/shared/Sidebar'
import './DashboardLayout.css'

export default function CommunityLayout() {
  return (
    <div className="dashboard-layout">
      <Sidebar role="community" />
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  )
}
