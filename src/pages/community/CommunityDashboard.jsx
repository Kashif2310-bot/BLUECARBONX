import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import GlassCard from '../../components/shared/GlassCard'
import StatusBadge from '../../components/shared/StatusBadge'
import PipelineVisual from '../../components/shared/PipelineVisual'
import './CommunityDashboard.css'

export default function CommunityDashboard() {
  const { projects, wallet } = useApp()

  const approved = projects.filter(p => p.status === 'approved').length
  const pending = projects.filter(p => p.status === 'pending').length
  const rejected = projects.filter(p => p.status === 'rejected').length
  const totalCFT = projects.reduce((s, p) => s + (p.cftAmount || 0), 0)

  const recent = projects.slice(0, 5)

  return (
    <div className="community-dashboard">
      <div className="dashboard-page-header">
        <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          Community Dashboard
        </motion.h1>
        <p>Monitor your restoration projects and token earnings</p>
      </div>

      {/* Stats */}
      <div className="stats-row">
        {[
          { icon: '📊', value: projects.length, label: 'Total Projects', color: '#00E59B' },
          { icon: '✅', value: approved, label: 'Approved', color: '#00E59B' },
          { icon: '⏳', value: pending, label: 'Pending Review', color: '#F59E0B' },
          { icon: '🪙', value: `${totalCFT.toLocaleString()} CFT`, label: 'Tokens Earned', color: '#00D4FF' },
        ].map((stat, i) => (
          <GlassCard key={stat.label} delay={i * 0.1} className="stat-card">
            <div className="stat-card__accent" style={{ background: stat.color }} />
            <div className="stat-card__icon">{stat.icon}</div>
            <div className="stat-card__value">{stat.value}</div>
            <div className="stat-card__label">{stat.label}</div>
          </GlassCard>
        ))}
      </div>

      {/* Pipeline overview */}
      <GlassCard className="section-card" delay={0.3}>
        <div className="section-card__header">
          <h3 className="section-card__title">MRV Pipeline</h3>
        </div>
        <PipelineVisual activeStep={7} compact />
      </GlassCard>

      {/* Quick Actions */}
      <div className="comm-actions">
        <Link to="/community/upload" className="btn btn-primary btn-lg">
          📤 Upload New Proof
        </Link>
        <Link to="/community/wallet" className="btn btn-secondary btn-lg">
          💼 View Wallet
        </Link>
        <Link to="/community/marketplace" className="btn btn-ghost btn-lg">
          🏪 Marketplace
        </Link>
      </div>

      {/* Recent Submissions */}
      <GlassCard className="section-card" delay={0.4}>
        <div className="section-card__header">
          <h3 className="section-card__title">Recent Submissions</h3>
          <Link to="/community/submissions" className="btn btn-ghost btn-sm">View All →</Link>
        </div>
        <div className="submissions-list">
          {recent.length === 0 ? (
            <div className="empty-state">
              <p>No submissions yet. Upload your first proof!</p>
            </div>
          ) : (
            recent.map((project, i) => (
              <motion.div
                key={project.id}
                className="submission-row"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.05 }}
              >
                <div className="submission-row__info">
                  <h4>{project.name}</h4>
                  <span className="submission-row__date">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="submission-row__meta">
                  {project.cftAmount > 0 && (
                    <span className="submission-row__cft">{project.cftAmount} CFT</span>
                  )}
                  <StatusBadge status={project.status} size="sm" />
                </div>
              </motion.div>
            ))
          )}
        </div>
      </GlassCard>
    </div>
  )
}
