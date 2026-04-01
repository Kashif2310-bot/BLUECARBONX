import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import ParticleBackground from '../../components/shared/ParticleBackground'
import PipelineVisual from '../../components/shared/PipelineVisual'
import './Landing.css'

const ROLES = [
  {
    key: 'community',
    icon: '🌱',
    title: 'Restoration Community',
    subtitle: 'Upload proof, earn tokens',
    description: 'Submit restoration evidence, get AI-verified analysis, earn Carbon Footprint Tokens (CFT) and trade them on the marketplace.',
    features: ['Upload geo-tagged proof', 'AI vegetation analysis', 'Earn CFT tokens', 'Trade on marketplace'],
    color: '#00E59B',
    path: '/community',
  },
  {
    key: 'admin',
    icon: '🛡️',
    title: 'Admin / Multi-Sig Authority',
    subtitle: 'Govern, verify, protect',
    description: 'Review submissions with multi-signature governance. Approve or reject with full transparency and fraud detection.',
    features: ['Multi-sig approvals (3/5)', 'AI anomaly detection', 'Risk flagging', 'Full audit trail'],
    color: '#00D4FF',
    path: '/admin',
  },
  {
    key: 'industry',
    icon: '🏭',
    title: 'Industry / Buyer',
    subtitle: 'Offset carbon footprint',
    description: 'Browse verified carbon credits, purchase CFT tokens, receive NFT proof of your environmental contribution.',
    features: ['Browse marketplace', 'Purchase CFT tokens', 'NFT proof of offset', 'Portfolio management'],
    color: '#8B5CF6',
    path: '/industry',
  },
]

const STATS = [
  { value: '2,847', label: 'Hectares Restored', icon: '🌿' },
  { value: '1.2M', label: 'Carbon Tons Offset', icon: '🌍' },
  { value: '48,392', label: 'CFT Tokens Issued', icon: '🪙' },
  { value: '156', label: 'Active Projects', icon: '📍' },
]

export default function Landing() {
  const navigate = useNavigate()
  const { setCurrentRole } = useApp()

  const handleRoleSelect = (role) => {
    setCurrentRole(role.key)
    navigate(role.path)
  }

  return (
    <div className="landing">
      <ParticleBackground />

      {/* HERO */}
      <section className="landing__hero">
        <motion.div
          className="landing__hero-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="landing__badge">
            <span className="landing__badge-dot" />
            AI + Blockchain MRV Platform
          </div>

          <h1 className="landing__title">
            <span className="landing__title-line">Transparent Blue Carbon</span>
            <span className="landing__title-line text-gradient">Restoration & Governance</span>
          </h1>

          <p className="landing__subtitle">
            End-to-end platform for monitoring, reporting, and verification of blue carbon
            restoration — powered by AI analysis, multi-signature governance, and immutable
            blockchain records.
          </p>

          <motion.div
            className="landing__cta-row"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <a href="#roles" className="btn btn-primary btn-lg">
              Choose Your Role →
            </a>
            <a href="#pipeline" className="btn btn-ghost btn-lg">
              How It Works
            </a>
          </motion.div>
        </motion.div>

        {/* Floating orbs */}
        <div className="landing__orb landing__orb--1" />
        <div className="landing__orb landing__orb--2" />
        <div className="landing__orb landing__orb--3" />
      </section>

      {/* STATS */}
      <section className="landing__stats">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="landing__stat"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <span className="landing__stat-icon">{stat.icon}</span>
            <span className="landing__stat-value">{stat.value}</span>
            <span className="landing__stat-label">{stat.label}</span>
          </motion.div>
        ))}
      </section>

      {/* PIPELINE */}
      <section className="landing__pipeline" id="pipeline">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="landing__section-title">
            The MRV <span className="text-gradient">Pipeline</span>
          </h2>
          <p className="landing__section-sub">
            From restoration proof to tradeable carbon credits — every step verified,
            immutable, and transparent.
          </p>
          <PipelineVisual activeStep={7} />
        </motion.div>
      </section>

      {/* ROLE SELECTOR */}
      <section className="landing__roles" id="roles">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="landing__section-title">
            Choose Your <span className="text-gradient">Role</span>
          </h2>
          <p className="landing__section-sub">
            Each role accesses a specialized dashboard tailored to their needs.
          </p>
        </motion.div>

        <div className="landing__roles-grid">
          {ROLES.map((role, i) => (
            <motion.div
              key={role.key}
              className="landing__role-card"
              style={{ '--card-color': role.color }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => handleRoleSelect(role)}
            >
              <div className="landing__role-card-glow" />
              <div className="landing__role-icon">{role.icon}</div>
              <h3 className="landing__role-title">{role.title}</h3>
              <p className="landing__role-subtitle">{role.subtitle}</p>
              <p className="landing__role-desc">{role.description}</p>
              <ul className="landing__role-features">
                {role.features.map(f => (
                  <li key={f}><span className="feature-check">✓</span> {f}</li>
                ))}
              </ul>
              <button className="btn btn-primary" style={{ background: role.color, color: '#020B18' }}>
                Enter Dashboard →
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="landing__footer">
        <div className="landing__footer-content">
          <span className="landing__footer-logo">🌊 BlueCarbon-X</span>
          <span className="landing__footer-text">
            AI + Blockchain MRV — Transparent Governance for Blue Carbon Restoration
          </span>
        </div>
      </footer>
    </div>
  )
}
