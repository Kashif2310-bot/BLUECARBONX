import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import GlassCard from '../../components/shared/GlassCard'
import StatusBadge from '../../components/shared/StatusBadge'
import './MySubmissions.css'

export default function MySubmissions() {
  const { projects } = useApp()
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)

  const filtered = filter === 'all' ? projects : projects.filter(p => p.status === filter)

  return (
    <div className="submissions-page">
      <div className="dashboard-page-header">
        <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          My Submissions
        </motion.h1>
        <p>Track the status of all your restoration proof submissions</p>
      </div>

      {/* Filters */}
      <div className="filter-tabs">
        {['all', 'pending', 'approved', 'rejected', 'flagged'].map(f => (
          <button
            key={f}
            className={`filter-tab ${filter === f ? 'filter-tab--active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span className="filter-tab__count">
              {f === 'all' ? projects.length : projects.filter(p => p.status === f).length}
            </span>
          </button>
        ))}
      </div>

      {/* Submissions grid */}
      <div className="submissions-grid">
        <AnimatePresence mode="popLayout">
          {filtered.map((project, i) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.04 }}
            >
              <GlassCard
                variant={project.status === 'rejected' ? 'danger' : project.status === 'approved' ? 'success' : project.flagged ? 'warning' : 'default'}
                className="submission-card"
                onClick={() => setSelected(selected?.id === project.id ? null : project)}
                animate={false}
              >
                <div className="submission-card__top">
                  <div>
                    <h3 className="submission-card__name">{project.name}</h3>
                    <span className="submission-card__location">
                      📍 {project.location?.name || 'Unknown'}
                    </span>
                  </div>
                  <StatusBadge status={project.status} />
                </div>

                <p className="submission-card__desc">{project.description?.slice(0, 100)}...</p>

                <div className="submission-card__meta">
                  <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                  {project.cftAmount > 0 && <span className="cft-earned">🪙 {project.cftAmount} CFT</span>}
                  {project.nftTokenId && <span className="nft-id">🎫 #{project.nftTokenId}</span>}
                </div>

                {/* Rejection reason */}
                {project.status === 'rejected' && project.rejectionReason && (
                  <div className="submission-card__rejection">
                    <strong>⚠️ Rejection Reason:</strong>
                    <p>{project.rejectionReason}</p>
                  </div>
                )}

                {/* AI Analysis (expanded) */}
                <AnimatePresence>
                  {selected?.id === project.id && project.analysis && (
                    <motion.div
                      className="submission-card__analysis"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h4>🤖 AI Analysis Results</h4>
                      <div className="analysis-grid">
                        <div className="analysis-item">
                          <span className="analysis-label">Vegetation Score</span>
                          <span className="analysis-value">{project.analysis.vegetationScore}%</span>
                          <div className="analysis-bar">
                            <div className="analysis-bar-fill" style={{ width: `${project.analysis.vegetationScore}%` }} />
                          </div>
                        </div>
                        <div className="analysis-item">
                          <span className="analysis-label">Biomass Detected</span>
                          <span className="analysis-value">{project.analysis.biomassDetected} tons</span>
                        </div>
                        <div className="analysis-item">
                          <span className="analysis-label">Carbon Estimated</span>
                          <span className="analysis-value">{project.analysis.carbonRestored} CFT</span>
                        </div>
                        <div className="analysis-item">
                          <span className="analysis-label">Confidence</span>
                          <span className="analysis-value">{project.analysis.confidence}%</span>
                        </div>
                        {project.analysis.speciesDetected?.length > 0 && (
                          <div className="analysis-item analysis-item--full">
                            <span className="analysis-label">Species Detected</span>
                            <span className="analysis-value">{project.analysis.speciesDetected.join(', ')}</span>
                          </div>
                        )}
                      </div>

                      {/* Blockchain info */}
                      {project.ipfsCID && (
                        <div className="blockchain-info">
                          <div className="blockchain-row">
                            <span>IPFS CID</span>
                            <code>{project.ipfsCID.slice(0, 20)}...</code>
                          </div>
                          {project.nftTokenId && (
                            <div className="blockchain-row">
                              <span>NFT Token</span>
                              <code>#{project.nftTokenId}</code>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Approval progress */}
                      {project.approvals?.length > 0 && (
                        <div className="approval-progress">
                          <span className="approval-label">Multi-Sig Approvals</span>
                          <div className="approval-dots">
                            {[0, 1, 2, 3, 4].map(i => {
                              const a = project.approvals[i]
                              return (
                                <div
                                  key={i}
                                  className={`approval-dot ${a ? (a.approved ? 'approval-dot--approved' : 'approval-dot--rejected') : ''}`}
                                  title={a ? `${a.approved ? 'Approved' : 'Rejected'} by Admin ${i + 1}` : 'Pending'}
                                />
                              )
                            })}
                          </div>
                          <span className="approval-count">
                            {project.approvals.filter(a => a.approved).length}/5 approved
                          </span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <p>No submissions found for this filter.</p>
        </div>
      )}
    </div>
  )
}
