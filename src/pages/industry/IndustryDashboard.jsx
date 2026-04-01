import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import GlassCard from '../../components/shared/GlassCard'
import './IndustryDashboard.css'

export default function IndustryDashboard() {
  const { industryPortfolio, industryBuyers, marketplaceListings, projects } = useApp()

  // For demo, use first industry buyer
  const currentBuyer = industryBuyers[0]
  const portfolio = industryPortfolio[currentBuyer.id] || { totalTokens: 0, totalSpent: 0, purchases: [] }

  const totalAvailable = marketplaceListings.reduce((s, l) => s + l.availableCFT, 0)
  const totalCarbonOffset = (portfolio.totalTokens / 10).toFixed(1)

  return (
    <div className="industry-dashboard">
      <div className="dashboard-page-header">
        <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          🏭 Industry Dashboard
        </motion.h1>
        <p>Offset your carbon footprint with verified blue carbon credits</p>
        <div className="industry-buyer-badge">
          <span>{currentBuyer.avatar}</span>
          <span>{currentBuyer.name} • {currentBuyer.sector}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        {[
          { icon: '🪙', value: `${portfolio.totalTokens}`, label: 'Tokens Owned', color: '#8B5CF6' },
          { icon: '🌍', value: `${totalCarbonOffset} tCO₂e`, label: 'Carbon Offset', color: '#00E59B' },
          { icon: '💰', value: `$${portfolio.totalSpent.toLocaleString()}`, label: 'Total Invested', color: '#00D4FF' },
          { icon: '📦', value: `${totalAvailable}`, label: 'Available on Market', color: '#F59E0B' },
        ].map((stat, i) => (
          <GlassCard key={stat.label} delay={i * 0.1} className="stat-card">
            <div className="stat-card__accent" style={{ background: stat.color }} />
            <div className="stat-card__icon">{stat.icon}</div>
            <div className="stat-card__value">{stat.value}</div>
            <div className="stat-card__label">{stat.label}</div>
          </GlassCard>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="industry-actions">
        <Link to="/industry/marketplace" className="btn btn-primary btn-lg">
          🏪 Browse Marketplace
        </Link>
        <Link to="/industry/portfolio" className="btn btn-secondary btn-lg">
          💎 My Portfolio
        </Link>
      </div>

      {/* Featured listings */}
      <GlassCard className="section-card" delay={0.3}>
        <div className="section-card__header">
          <h3 className="section-card__title">Featured Carbon Credits</h3>
          <Link to="/industry/marketplace" className="btn btn-ghost btn-sm">View All →</Link>
        </div>
        <div className="featured-listings">
          {marketplaceListings.slice(0, 3).map(listing => (
            <div key={listing.id} className="featured-listing">
              <div className="featured-listing__top">
                <h4>{listing.projectName}</h4>
                <span className="featured-listing__price">${listing.pricePerCFT}/CFT</span>
              </div>
              <div className="featured-listing__meta">
                <span>📍 {listing.location}</span>
                <span>🌿 {listing.carbonImpact}</span>
                <span>🪙 {listing.availableCFT} available</span>
              </div>
              <div className="featured-listing__bar">
                <div className="featured-bar-fill" style={{ width: `${(listing.availableCFT / listing.totalCFT * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Recent Purchases */}
      {portfolio.purchases.length > 0 && (
        <GlassCard className="section-card" delay={0.4}>
          <h3 className="section-card__title" style={{ marginBottom: '1rem' }}>Recent Purchases</h3>
          {portfolio.purchases.map((purchase, i) => {
            const proj = projects.find(p => p.id === purchase.projectId)
            return (
              <div key={i} className="purchase-item">
                <div className="purchase-item__info">
                  <strong>{proj?.name || purchase.projectId}</strong>
                  <span>{new Date(purchase.timestamp).toLocaleDateString()}</span>
                </div>
                <div className="purchase-item__details">
                  <span className="purchase-item__amount">{purchase.amount} CFT</span>
                  <span className="purchase-item__nft">🎫 {purchase.nftProof}</span>
                </div>
              </div>
            )
          })}
        </GlassCard>
      )}
    </div>
  )
}
