import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import GlassCard from '../../components/shared/GlassCard'
import StatusBadge from '../../components/shared/StatusBadge'
import './ReviewSubmission.css'

export default function ReviewSubmission() {
  const { projects, adminPersonas, submitApproval, flagProject } = useApp()
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedAdmin, setSelectedAdmin] = useState('admin-1')
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [flagReason, setFlagReason] = useState('')
  const [showFlagModal, setShowFlagModal] = useState(false)

  const reviewable = projects.filter(p => p.status === 'pending' || p.status === 'flagged')
  const allProjects = projects

  const handleApprove = (projectId) => {
    submitApproval(projectId, selectedAdmin, true)
  }

  const handleReject = () => {
    if (!selectedProject || !rejectReason.trim()) return
    submitApproval(selectedProject.id, selectedAdmin, false, rejectReason)
    setShowRejectModal(false)
    setRejectReason('')
  }

  const handleFlag = () => {
    if (!selectedProject || !flagReason.trim()) return
    flagProject(selectedProject.id, flagReason)
    setShowFlagModal(false)
    setFlagReason('')
  }

  return (
    <div className="review-page">
      <div className="dashboard-page-header">
        <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          📝 Review Queue
        </motion.h1>
        <p>Review submissions using multi-signature governance (3/5 approvals required)</p>
      </div>

      {/* Admin selector */}
      <GlassCard className="admin-selector" delay={0.1}>
        <span className="admin-selector__label">Acting as:</span>
        <div className="admin-selector__list">
          {adminPersonas.map(admin => (
            <button
              key={admin.id}
              className={`admin-selector__btn ${selectedAdmin === admin.id ? 'admin-selector__btn--active' : ''}`}
              onClick={() => setSelectedAdmin(admin.id)}
            >
              <span>{admin.avatar}</span>
              <span>{admin.name}</span>
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Submissions */}
      <div className="review-grid">
        {allProjects.map((project, i) => {
          const approveCount = (project.approvals || []).filter(a => a.approved).length
          const rejectCount = (project.approvals || []).filter(a => !a.approved).length
          const currentAdminVoted = (project.approvals || []).some(a => a.adminId === selectedAdmin)

          return (
            <GlassCard
              key={project.id}
              delay={i * 0.05}
              variant={project.flagged ? 'warning' : project.status === 'approved' ? 'success' : project.status === 'rejected' ? 'danger' : 'default'}
              className="review-card"
            >
              <div className="review-card__top">
                <div>
                  <h3>{project.name}</h3>
                  <span className="review-card__location">📍 {project.location?.name}</span>
                  <span className="review-card__community">👥 {project.communityName}</span>
                </div>
                <StatusBadge status={project.status} />
              </div>

              <p className="review-card__desc">{project.description?.slice(0, 120)}...</p>

              {/* Images */}
              <div className="review-card__images">
                {(project.images || []).map((img, idx) => (
                  <div key={idx} className="review-card__image-placeholder">
                    <span>📸</span>
                    <span>{img}</span>
                  </div>
                ))}
              </div>

              {/* AI Analysis */}
              {project.analysis && (
                <div className="review-card__analysis">
                  <h4>🤖 AI Analysis</h4>
                  <div className="review-analysis-grid">
                    <div>
                      <span className="ra-label">Vegetation</span>
                      <span className="ra-value">{project.analysis.vegetationScore}%</span>
                      <div className="ra-bar"><div className="ra-bar-fill" style={{ width: `${project.analysis.vegetationScore}%` }} /></div>
                    </div>
                    <div>
                      <span className="ra-label">Carbon</span>
                      <span className="ra-value">{project.analysis.carbonRestored} CFT</span>
                    </div>
                    <div>
                      <span className="ra-label">Confidence</span>
                      <span className={`ra-value ${project.analysis.confidence < 75 ? 'ra-value--low' : ''}`}>
                        {project.analysis.confidence}%
                      </span>
                    </div>
                    <div>
                      <span className="ra-label">Health</span>
                      <span className="ra-value">{(project.analysis.healthIndex * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Multi-sig progress */}
              <div className="review-card__multisig">
                <div className="multisig-header">
                  <span className="multisig-label">Multi-Signature Progress</span>
                  <span className="multisig-count">{approveCount}/5 approved • {rejectCount}/5 rejected</span>
                </div>
                <div className="multisig-bar">
                  <div className="multisig-bar-approve" style={{ width: `${(approveCount / 5) * 100}%` }} />
                  <div className="multisig-bar-reject" style={{ width: `${(rejectCount / 5) * 100}%` }} />
                </div>
                <div className="multisig-votes">
                  {adminPersonas.map(admin => {
                    const vote = (project.approvals || []).find(a => a.adminId === admin.id)
                    return (
                      <div key={admin.id} className={`multisig-vote ${vote ? (vote.approved ? 'multisig-vote--approved' : 'multisig-vote--rejected') : ''}`} title={`${admin.name}: ${vote ? (vote.approved ? 'Approved' : 'Rejected') : 'No vote'}`}>
                        <span>{admin.avatar}</span>
                        {vote && <span className="multisig-vote-icon">{vote.approved ? '✓' : '✕'}</span>}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Actions */}
              {(project.status === 'pending' || project.status === 'flagged') && (
                <div className="review-card__actions">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleApprove(project.id)}
                    disabled={currentAdminVoted}
                  >
                    ✓ Approve
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => { setSelectedProject(project); setShowRejectModal(true) }}
                    disabled={currentAdminVoted}
                  >
                    ✕ Reject
                  </button>
                  {!project.flagged && (
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => { setSelectedProject(project); setShowFlagModal(true) }}
                    >
                      ⚠ Flag
                    </button>
                  )}
                  {currentAdminVoted && <span className="voted-badge">Already voted</span>}
                </div>
              )}

              {/* Rejection reason */}
              {project.rejectionReason && (
                <div className="review-card__rejection-display">
                  <strong>Rejection Reason:</strong> {project.rejectionReason}
                </div>
              )}
            </GlassCard>
          )
        })}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
          <GlassCard className="modal-card" animate={false} onClick={e => e.stopPropagation()}>
            <h3>Reject Submission</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Rejecting: <strong>{selectedProject?.name}</strong>
            </p>
            <div className="form-group">
              <label>Reason for Rejection *</label>
              <textarea
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="Provide a clear reason that will be visible to the submitter..."
                rows="4"
              />
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setShowRejectModal(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleReject} disabled={!rejectReason.trim()}>Reject</button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Flag Modal */}
      {showFlagModal && (
        <div className="modal-overlay" onClick={() => setShowFlagModal(false)}>
          <GlassCard className="modal-card" animate={false} onClick={e => e.stopPropagation()}>
            <h3>⚠️ Flag Submission</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Flagging: <strong>{selectedProject?.name}</strong>
            </p>
            <div className="form-group">
              <label>Reason for Flagging *</label>
              <textarea
                value={flagReason}
                onChange={e => setFlagReason(e.target.value)}
                placeholder="Describe the suspicious activity or anomaly detected..."
                rows="4"
              />
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setShowFlagModal(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleFlag} disabled={!flagReason.trim()}>Flag</button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  )
}
