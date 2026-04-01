import { motion } from 'framer-motion'
import './PipelineVisual.css'

const STEPS = [
  { key: 'upload', icon: '📤', label: 'Upload', sub: 'Restoration Proof' },
  { key: 'ai', icon: '🤖', label: 'AI Analysis', sub: 'Vegetation Detection' },
  { key: 'multisig', icon: '🛡️', label: 'Multi-Sig', sub: '3/5 Approvals' },
  { key: 'ipfs', icon: '📦', label: 'IPFS', sub: 'Immutable Storage' },
  { key: 'blockchain', icon: '⛓️', label: 'Blockchain', sub: 'On-Chain Record' },
  { key: 'nft', icon: '🎫', label: 'NFT Mint', sub: 'Proof of Restoration' },
  { key: 'cft', icon: '🪙', label: 'CFT Tokens', sub: 'Carbon Credits' },
  { key: 'marketplace', icon: '🏪', label: 'Marketplace', sub: 'Trade & Offset' },
]

export default function PipelineVisual({ activeStep = -1, compact = false }) {
  return (
    <div className={`pipeline ${compact ? 'pipeline--compact' : ''}`}>
      <div className="pipeline__track">
        {STEPS.map((step, i) => (
          <motion.div
            key={step.key}
            className={`pipeline__step ${i <= activeStep ? 'pipeline__step--active' : ''} ${i === activeStep ? 'pipeline__step--current' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
          >
            {i > 0 && (
              <div className={`pipeline__connector ${i <= activeStep ? 'pipeline__connector--active' : ''}`}>
                <div className="pipeline__connector-fill" />
              </div>
            )}
            <div className="pipeline__node">
              <div className="pipeline__icon">{step.icon}</div>
              {i === activeStep && <div className="pipeline__node-ring" />}
            </div>
            {!compact && (
              <div className="pipeline__label">
                <span className="pipeline__label-main">{step.label}</span>
                <span className="pipeline__label-sub">{step.sub}</span>
              </div>
            )}
            {compact && (
              <span className="pipeline__label-main">{step.label}</span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
