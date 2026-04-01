import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import GlassCard from '../../components/shared/GlassCard'
import StatusBadge from '../../components/shared/StatusBadge'
import './AdminDashboard.css'

export default function AdminDashboard() {
  const { projects, adminPersonas } = useApp()

  const pending = projects.filter(p => p.status === 'pending')
  const flagged = projects.filter(p => p.flagged)
  const approved = projects.filter(p => p.status === 'approved')
  const totalCFT = approved.reduce((s, p) => s + (p.cftAmount || 0), 0)

  return (
    <div className="admin-dashboard">
      <div className="dashboard-page-header">
        <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          🛡️ Governance Overview
        </motion.h1>
        <p>Multi-signature authority dashboard — review, approve, and ensure compliance</p>
      </div>

      {/* Stats */}
      <div className="stats-row">
        {[
          { icon: '⏳', value: pending.length, label: 'Pending Review', color: '#F59E0B' },
          { icon: '⚠️', value: flagged.length, label: 'Flagged', color: '#EF4444' },
          { icon: '✅', value: approved.length, label: 'Approved', color: '#00E59B' },
          { icon: '🪙', value: `${totalCFT.toLocaleString()}`, label: 'Total CFT Issued', color: '#00D4FF' },
        ].map((stat, i) => (
          <GlassCard key={stat.label} delay={i * 0.1} className="stat-card">
            <div className="stat-card__accent" style={{ background: stat.color }} />
            <div className="stat-card__icon">{stat.icon}</div>
            <div className="stat-card__value">{stat.value}</div>
            <div className="stat-card__label">{stat.label}</div>
          </GlassCard>
        ))}
      </div>

      {/* Admin Panel */}
      <div className="admin-grid">
        {/* Governance Members */}
        <GlassCard variant="cyan" delay={0.3} className="admin-panel">
          <h3>🏛️ Governance Panel (5 Members)</h3>
          <p className="admin-panel__sub">Multi-signature: 3 of 5 approvals required</p>
          <div className="admin-members">
            {adminPersonas.map(admin => (
              <div key={admin.id} className="admin-member">
                <span className="admin-member__avatar">{admin.avatar}</span>
                <div>
                  <span className="admin-member__name">{admin.name}</span>
                  <span className="admin-member__role">{admin.role}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Pending Queue */}
        <GlassCard delay={0.4} className="admin-panel">
          <div className="section-card__header">
            <h3>📝 Review Queue</h3>
            <Link to="/admin/review" className="btn btn-ghost btn-sm">View All →</Link>
          </div>
          {pending.length > 0 ? pending.slice(0, 4).map(proj => (
            <Link to="/admin/review" key={proj.id} className="admin-queue-item">
              <div>
                <span className="admin-queue-name">{proj.name}</span>
                <span className="admin-queue-date">{new Date(proj.createdAt).toLocaleDateString()}</span>
              </div>
              <StatusBadge status={proj.status} size="sm" />
            </Link>
          )) : (
            <div className="empty-state"><p>No pending submissions</p></div>
          )}
          {flagged.length > 0 && (
            <>
              <h4 className="admin-flagged-title">⚠️ Flagged Items</h4>
              {flagged.slice(0, 3).map(proj => (
                <Link to="/admin/risk" key={proj.id} className="admin-queue-item admin-queue-item--flagged">
                  <div>
                    <span className="admin-queue-name">{proj.name}</span>
                    <span className="admin-queue-flag-reason">{proj.flagReason?.slice(0, 60)}...</span>
                  </div>
                  <StatusBadge status="flagged" size="sm" />
                </Link>
              ))}
            </>
          )}
        </GlassCard>
      </div>
    </div>
  )
}
