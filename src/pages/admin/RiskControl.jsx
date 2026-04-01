import { motion } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import GlassCard from '../../components/shared/GlassCard'
import StatusBadge from '../../components/shared/StatusBadge'
import './RiskControl.css'

export default function RiskControl() {
  const { projects } = useApp()

  const flagged = projects.filter(p => p.flagged)
  const anomalies = projects.filter(p =>
    p.analysis && (p.analysis.confidence < 75 || (p.analysis.vegetationScore > 90 && p.analysis.confidence < 80))
  )

  return (
    <div className="risk-page">
      <div className="dashboard-page-header">
        <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          ⚠️ Risk Control
        </motion.h1>
        <p>Monitor flagged submissions and detect anomalies in restoration data</p>
      </div>

      {/* Risk overview */}
      <div className="stats-row">
        <GlassCard delay={0} className="stat-card">
          <div className="stat-card__accent" style={{ background: '#EF4444' }} />
          <div className="stat-card__icon">🚩</div>
          <div className="stat-card__value">{flagged.length}</div>
          <div className="stat-card__label">Flagged Submissions</div>
        </GlassCard>
        <GlassCard delay={0.1} className="stat-card">
          <div className="stat-card__accent" style={{ background: '#F59E0B' }} />
          <div className="stat-card__icon">🔍</div>
          <div className="stat-card__value">{anomalies.length}</div>
          <div className="stat-card__label">AI Anomalies Detected</div>
        </GlassCard>
      </div>

      {/* Flagged items */}
      <GlassCard variant="warning" className="section-card" delay={0.2}>
        <h3 className="section-card__title" style={{ marginBottom: '1rem' }}>🚩 Flagged Submissions</h3>
        {flagged.length > 0 ? flagged.map(project => (
          <div key={project.id} className="risk-item">
            <div className="risk-item__header">
              <div>
                <h4>{project.name}</h4>
                <span className="risk-item__location">📍 {project.location?.name}</span>
              </div>
              <StatusBadge status="flagged" />
            </div>
            <div className="risk-item__reason">
              <strong>Flag Reason:</strong> {project.flagReason}
            </div>
            {project.analysis && (
              <div className="risk-item__indicators">
                <div className={`risk-indicator ${project.analysis.confidence < 75 ? 'risk-indicator--danger' : ''}`}>
                  <span>Confidence</span>
                  <strong>{project.analysis.confidence}%</strong>
                </div>
                <div className={`risk-indicator ${project.analysis.vegetationScore > 90 ? 'risk-indicator--warning' : ''}`}>
                  <span>Vegetation</span>
                  <strong>{project.analysis.vegetationScore}%</strong>
                </div>
                <div className="risk-indicator">
                  <span>Health</span>
                  <strong>{(project.analysis.healthIndex * 100).toFixed(0)}%</strong>
                </div>
              </div>
            )}
          </div>
        )) : (
          <div className="empty-state"><p>No flagged submissions — all clear!</p></div>
        )}
      </GlassCard>

      {/* Anomalies */}
      <GlassCard className="section-card" delay={0.3}>
        <h3 className="section-card__title" style={{ marginBottom: '1rem' }}>🔍 AI Anomaly Detection</h3>
        <p className="risk-desc">Projects with low AI confidence or suspicious metric combinations.</p>
        {anomalies.length > 0 ? anomalies.map(project => (
          <div key={project.id} className="risk-item risk-item--anomaly">
            <h4>{project.name}</h4>
            <div className="risk-item__indicators">
              <div className={`risk-indicator ${project.analysis.confidence < 75 ? 'risk-indicator--danger' : 'risk-indicator--warning'}`}>
                <span>Confidence</span>
                <strong>{project.analysis.confidence}%</strong>
              </div>
              <div className="risk-indicator">
                <span>Vegetation</span>
                <strong>{project.analysis.vegetationScore}%</strong>
              </div>
              <div className="risk-indicator">
                <span>Carbon Est.</span>
                <strong>{project.analysis.carbonRestored} CFT</strong>
              </div>
            </div>
          </div>
        )) : (
          <div className="empty-state"><p>No anomalies detected.</p></div>
        )}
      </GlassCard>
    </div>
  )
}
