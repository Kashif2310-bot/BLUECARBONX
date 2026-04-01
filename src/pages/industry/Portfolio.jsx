import { motion } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import GlassCard from '../../components/shared/GlassCard'
import './Portfolio.css'

export default function Portfolio() {
  const { industryPortfolio, industryBuyers, projects } = useApp()

  const currentBuyer = industryBuyers[0]
  const portfolio = industryPortfolio[currentBuyer.id] || { totalTokens: 0, totalSpent: 0, purchases: [] }

  const totalCarbonOffset = (portfolio.totalTokens / 10).toFixed(1)

  return (
    <div className="portfolio-page">
      <div className="dashboard-page-header">
        <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          💎 My Portfolio
        </motion.h1>
        <p>Your carbon offset portfolio — tokens, NFTs, and associated projects</p>
      </div>

      {/* Portfolio summary */}
      <div className="portfolio-summary">
        <GlassCard variant="cyan" glow className="portfolio-main-card">
          <div className="portfolio-main-value">{portfolio.totalTokens}</div>
          <div className="portfolio-main-label">CFT Tokens Owned</div>
          <div className="portfolio-main-sub">{totalCarbonOffset} tCO₂e Carbon Offset</div>
        </GlassCard>
        <GlassCard delay={0.1}>
          <div className="wallet-mini-stat">
            <span className="wallet-mini-icon">💰</span>
            <div>
              <div className="wallet-mini-value">${portfolio.totalSpent.toLocaleString()}</div>
              <div className="wallet-mini-label">Total Invested</div>
            </div>
          </div>
        </GlassCard>
        <GlassCard delay={0.2}>
          <div className="wallet-mini-stat">
            <span className="wallet-mini-icon">🎫</span>
            <div>
              <div className="wallet-mini-value">{portfolio.purchases.length}</div>
              <div className="wallet-mini-label">NFT Proofs</div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Owned tokens / NFT Gallery */}
      <GlassCard className="section-card" delay={0.3}>
        <h3 className="section-card__title" style={{ marginBottom: '1rem' }}>🎫 NFT Proof Gallery</h3>
        {portfolio.purchases.length > 0 ? (
          <div className="nft-gallery">
            {portfolio.purchases.map((purchase, i) => {
              const proj = projects.find(p => p.id === purchase.projectId)
              return (
                <motion.div
                  key={i}
                  className="nft-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <div className="nft-card__visual">
                    <div className="nft-hologram">
                      <span className="nft-icon">🌊</span>
                      <span className="nft-token-id">{purchase.nftProof}</span>
                    </div>
                  </div>
                  <div className="nft-card__info">
                    <h4>{proj?.name || 'Restoration Project'}</h4>
                    <div className="nft-meta">
                      <span>🪙 {purchase.amount} CFT</span>
                      <span>💵 ${(purchase.amount * purchase.price).toLocaleString()}</span>
                    </div>
                    <div className="nft-meta">
                      <span>📍 {proj?.location?.name || 'India'}</span>
                    </div>
                    <div className="nft-date">
                      {new Date(purchase.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                  <button className="btn btn-ghost btn-sm nft-resell">
                    🔄 Resell
                  </button>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div className="empty-state">
            <p>No NFTs yet. Purchase tokens from the marketplace to get started!</p>
          </div>
        )}
      </GlassCard>

      {/* Associated Projects */}
      <GlassCard className="section-card" delay={0.4}>
        <h3 className="section-card__title" style={{ marginBottom: '1rem' }}>🌍 Associated Restoration Projects</h3>
        {portfolio.purchases.length > 0 ? (
          <div className="assoc-projects">
            {[...new Set(portfolio.purchases.map(p => p.projectId))].map(projectId => {
              const proj = projects.find(p => p.id === projectId)
              if (!proj) return null
              const totalBought = portfolio.purchases.filter(p => p.projectId === projectId).reduce((s, p) => s + p.amount, 0)
              return (
                <div key={projectId} className="assoc-project">
                  <div className="assoc-project__info">
                    <h4>{proj.name}</h4>
                    <span>📍 {proj.location?.name}</span>
                    <span>🌿 {proj.analysis?.speciesDetected?.join(', ')}</span>
                  </div>
                  <div className="assoc-project__stats">
                    <div><strong>{totalBought} CFT</strong><span>Your Share</span></div>
                    <div><strong>{proj.cftAmount} CFT</strong><span>Total</span></div>
                    <div><strong>{(proj.analysis?.healthIndex * 100).toFixed(0)}%</strong><span>Health</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="empty-state"><p>No associated projects yet.</p></div>
        )}
      </GlassCard>
    </div>
  )
}
