import { motion } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import GlassCard from '../../components/shared/GlassCard'
import './CommunityWallet.css'

export default function CommunityWallet() {
  const { wallet, projects, industryBuyers } = useApp()

  const totalCFT = projects.reduce((s, p) => s + (p.cftAmount || 0), 0)
  const totalSold = projects.reduce((s, p) => s + (p.marketplace?.sold || 0), 0)
  const totalRevenue = projects.reduce((s, p) => {
    if (!p.marketplace || !p.purchases) return s
    return s + p.purchases.reduce((ps, pur) => ps + pur.amount * pur.price, 0)
  }, 0)

  const creditTx = wallet.transactions?.filter(t => t.amount > 0) || []

  return (
    <div className="wallet-page">
      <div className="dashboard-page-header">
        <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          💼 Community Wallet
        </motion.h1>
        <p>Your Carbon Footprint Token balance and transaction history</p>
      </div>

      {/* Balance Cards */}
      <div className="wallet-balance-grid">
        <GlassCard variant="success" glow className="wallet-balance-main">
          <div className="wallet-balance-label">Total CFT Balance</div>
          <div className="wallet-balance-value">{totalCFT.toLocaleString()}</div>
          <div className="wallet-balance-sub">Carbon Footprint Tokens</div>
        </GlassCard>
        <GlassCard delay={0.1}>
          <div className="wallet-mini-stat">
            <span className="wallet-mini-icon">💰</span>
            <div>
              <div className="wallet-mini-value">{totalSold}</div>
              <div className="wallet-mini-label">Tokens Sold</div>
            </div>
          </div>
        </GlassCard>
        <GlassCard delay={0.2}>
          <div className="wallet-mini-stat">
            <span className="wallet-mini-icon">💵</span>
            <div>
              <div className="wallet-mini-value">${totalRevenue.toLocaleString()}</div>
              <div className="wallet-mini-label">Revenue</div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Wallet Address */}
      <GlassCard className="wallet-address-section" delay={0.2}>
        <h3>Wallet Address</h3>
        <div className="wallet-address-display" onClick={() => {
          navigator.clipboard.writeText(wallet.address)
        }}>
          <code>{wallet.address}</code>
          <span className="copy-hint">📋 Click to copy</span>
        </div>
        <div className="wallet-meta-row">
          <span>Network: <strong>Ethereum</strong></span>
          <span>Standard: <strong>ERC-20</strong></span>
          <span>Symbol: <strong className="text-gradient">CFT</strong></span>
        </div>
      </GlassCard>

      {/* Transaction History */}
      <GlassCard className="section-card" delay={0.3}>
        <h3 className="section-card__title" style={{ marginBottom: '1rem' }}>Transaction History</h3>
        {wallet.transactions?.length > 0 ? (
          <div className="tx-list">
            {wallet.transactions.map((tx, i) => {
              const proj = projects.find(p => p.id === tx.projectId)
              const buyer = industryBuyers.find(b => b.id === tx.buyerId)
              const isCredit = tx.amount > 0
              return (
                <motion.div
                  key={i}
                  className="tx-row"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.04 }}
                >
                  <div className="tx-row__icon">{isCredit ? '🪙' : '💸'}</div>
                  <div className="tx-row__info">
                    <span className="tx-row__type">{tx.type === 'CFT_ISSUED' ? 'CFT Issued' : tx.type === 'CFT_SOLD' ? 'Tokens Sold' : tx.type}</span>
                    {proj && <span className="tx-row__project">{proj.name}</span>}
                    {buyer && <span className="tx-row__buyer">→ {buyer.name}</span>}
                  </div>
                  <div className="tx-row__right">
                    <span className={`tx-row__amount ${isCredit ? 'tx-positive' : 'tx-negative'}`}>
                      {isCredit ? '+' : ''}{typeof tx.amount === 'number' ? tx.amount.toLocaleString() : tx.amount}
                      {tx.type === 'CFT_SOLD' ? ' USD' : ' CFT'}
                    </span>
                    <span className="tx-row__date">{new Date(tx.timestamp).toLocaleDateString()}</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div className="empty-state"><p>No transactions yet.</p></div>
        )}
      </GlassCard>
    </div>
  )
}
