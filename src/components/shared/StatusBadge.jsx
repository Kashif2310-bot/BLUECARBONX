import { motion } from 'framer-motion'
import './StatusBadge.css'

const STATUS_CONFIG = {
  pending: { label: 'Pending', icon: '⏳', color: 'orange' },
  approved: { label: 'Approved', icon: '✓', color: 'green' },
  rejected: { label: 'Rejected', icon: '✕', color: 'red' },
  flagged: { label: 'Flagged', icon: '⚠', color: 'warning' },
  analyzing: { label: 'Analyzing', icon: '🔍', color: 'cyan' },
  completed: { label: 'Completed', icon: '✓', color: 'green' },
  listed: { label: 'Listed', icon: '📋', color: 'cyan' },
  sold: { label: 'Sold', icon: '💰', color: 'green' },
}

export default function StatusBadge({ status, size = 'md', pulse = false }) {
  const config = STATUS_CONFIG[status] || { label: status, icon: '●', color: 'default' }

  return (
    <motion.span
      className={`status-badge status-badge--${config.color} status-badge--${size} ${pulse ? 'status-badge--pulse' : ''}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <span className="status-badge__dot" />
      <span className="status-badge__icon">{config.icon}</span>
      <span className="status-badge__label">{config.label}</span>
    </motion.span>
  )
}
