import { motion } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import GlassCard from '../../components/shared/GlassCard'
import './TransparencyPanel.css'

export default function TransparencyPanel() {
  const { projects, marketplaceListings, industryBuyers, industryPortfolio } = useApp()

  const approved = projects.filter(p => p.status === 'approved')
  const totalCFT = approved.reduce((s, p) => s + (p.cftAmount || 0), 0)
  const totalSold = Object.values(industryPortfolio).reduce((s, p) => s + p.totalTokens, 0)

  return (
    <div className="transparency-page">
      <div className="dashboard-page-header">
        <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          🔍 Transparency Panel
        </motion.h1>
        <p>Full audit trail of token generation, ownership, and industry purchases</p>
      </div>

      {/* Overview stats */}
      <div className="stats-row">
        <GlassCard delay={0} className="stat-card">
          <div className="stat-card__accent" style={{ background: '#00E59B' }} />
          <div className="stat-card__icon">🪙</div>
          <div className="stat-card__value">{totalCFT.toLocaleString()}</div>
          <div className="stat-card__label">Total CFT Generated</div>
        </GlassCard>
        <GlassCard delay={0.1} className="stat-card">
          <div className="stat-card__accent" style={{ background: '#00D4FF' }} />
          <div className="stat-card__icon">🔄</div>
          <div className="stat-card__value">{totalSold}</div>
          <div className="stat-card__label">Tokens in Circulation</div>
        </GlassCard>
        <GlassCard delay={0.2} className="stat-card">
          <div className="stat-card__accent" style={{ background: '#8B5CF6' }} />
          <div className="stat-card__icon">🏭</div>
          <div className="stat-card__value">{Object.keys(industryPortfolio).length}</div>
          <div className="stat-card__label">Industry Buyers</div>
        </GlassCard>
      </div>

      {/* Token Generation Table */}
      <GlassCard className="section-card" delay={0.2}>
        <h3 className="section-card__title" style={{ marginBottom: '1rem' }}>Token Generation Ledger</h3>
        <div className="transparency-table-wrap">
          <table className="transparency-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Community</th>
                <th>CFT Generated</th>
                <th>NFT ID</th>
                <th>IPFS CID</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {approved.map(project => (
                <tr key={project.id}>
                  <td className="tt-project">{project.name}</td>
                  <td>{project.communityName}</td>
                  <td className="tt-cft">{project.cftAmount?.toLocaleString()} CFT</td>
                  <td><code>{project.nftTokenId}</code></td>
                  <td><code className="tt-cid">{project.ipfsCID?.slice(0, 16)}...</code></td>
                  <td><span className="tt-verified">✓ Verified</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Token Ownership */}
      <GlassCard className="section-card" delay={0.3}>
        <h3 className="section-card__title" style={{ marginBottom: '1rem' }}>Token Ownership Map</h3>
        <div className="ownership-grid">
          {industryBuyers.map(buyer => {
            const portfolio = industryPortfolio[buyer.id] || { totalTokens: 0, totalSpent: 0, purchases: [] }
            return (
              <div key={buyer.id} className="ownership-card">
                <div className="ownership-header">
                  <span className="ownership-icon">{buyer.avatar}</span>
                  <div>
                    <span className="ownership-name">{buyer.name}</span>
                    <span className="ownership-sector">{buyer.sector}</span>
                  </div>
                </div>
                <div className="ownership-stats">
                  <div>
                    <span className="os-value">{portfolio.totalTokens} CFT</span>
                    <span className="os-label">Owned</span>
                  </div>
                  <div>
                    <span className="os-value">${portfolio.totalSpent.toLocaleString()}</span>
                    <span className="os-label">Total Spent</span>
                  </div>
                </div>
                {portfolio.purchases.length > 0 && (
                  <div className="ownership-purchases">
                    {portfolio.purchases.map((p, i) => {
                      const proj = projects.find(pr => pr.id === p.projectId)
                      return (
                        <div key={i} className="op-row">
                          <span>{proj?.name || p.projectId}</span>
                          <span>{p.amount} CFT @ ${p.price}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </GlassCard>
    </div>
  )
}
