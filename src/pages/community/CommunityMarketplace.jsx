import { useState } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import GlassCard from '../../components/shared/GlassCard'
import './CommunityMarketplace.css'

export default function CommunityMarketplace() {
  const { projects, marketplaceListings, listTokensForSale, industryBuyers } = useApp()
  const [showListModal, setShowListModal] = useState(false)
  const [listForm, setListForm] = useState({ projectId: '', price: '', amount: '' })

  const approvedWithCFT = projects.filter(p => p.status === 'approved' && p.cftAmount > 0)
  const myListings = marketplaceListings.filter(l => approvedWithCFT.some(p => p.id === l.projectId))

  const handleList = () => {
    if (!listForm.projectId || !listForm.price || !listForm.amount) return
    listTokensForSale(listForm.projectId, parseFloat(listForm.price), parseInt(listForm.amount))
    setShowListModal(false)
    setListForm({ projectId: '', price: '', amount: '' })
  }

  return (
    <div className="comm-marketplace">
      <div className="dashboard-page-header">
        <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          🏪 Marketplace
        </motion.h1>
        <p>List your CFT tokens for sale and track purchases from industry buyers</p>
      </div>

      <div className="comm-marketplace__actions">
        <button className="btn btn-primary" onClick={() => setShowListModal(true)}>
          + List Tokens for Sale
        </button>
      </div>

      {/* List Modal */}
      {showListModal && (
        <div className="modal-overlay" onClick={() => setShowListModal(false)}>
          <GlassCard className="modal-card" animate={false} onClick={e => e.stopPropagation()}>
            <h3>List Tokens for Sale</h3>
            <div className="form-group">
              <label>Select Project</label>
              <select value={listForm.projectId} onChange={e => setListForm({ ...listForm, projectId: e.target.value })}>
                <option value="">Choose project...</option>
                {approvedWithCFT.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.cftAmount} CFT available)</option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Price per CFT ($)</label>
                <input type="number" step="0.1" value={listForm.price} onChange={e => setListForm({ ...listForm, price: e.target.value })} placeholder="12.50" />
              </div>
              <div className="form-group">
                <label>Amount (CFT)</label>
                <input type="number" value={listForm.amount} onChange={e => setListForm({ ...listForm, amount: e.target.value })} placeholder="100" />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setShowListModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleList}>List for Sale</button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* My Listings */}
      <GlassCard className="section-card" delay={0.1}>
        <h3 className="section-card__title" style={{ marginBottom: '1rem' }}>Your Active Listings</h3>
        {myListings.length > 0 ? (
          <div className="listings-grid">
            {myListings.map(listing => (
              <div key={listing.id} className="listing-card">
                <div className="listing-card__header">
                  <h4>{listing.projectName}</h4>
                  <span className="listing-card__price">${listing.pricePerCFT}/CFT</span>
                </div>
                <div className="listing-card__stats">
                  <div>
                    <span className="listing-stat-label">Available</span>
                    <span className="listing-stat-value">{listing.availableCFT} CFT</span>
                  </div>
                  <div>
                    <span className="listing-stat-label">Sold</span>
                    <span className="listing-stat-value">{listing.totalCFT - listing.availableCFT} CFT</span>
                  </div>
                  <div>
                    <span className="listing-stat-label">Carbon Impact</span>
                    <span className="listing-stat-value">{listing.carbonImpact}</span>
                  </div>
                </div>
                <div className="listing-card__bar">
                  <div className="listing-bar-fill" style={{ width: `${((listing.totalCFT - listing.availableCFT) / listing.totalCFT * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state"><p>No active listings. List your earned tokens above!</p></div>
        )}
      </GlassCard>

      {/* Purchase History */}
      <GlassCard className="section-card" delay={0.2}>
        <h3 className="section-card__title" style={{ marginBottom: '1rem' }}>Purchase History (Buyers)</h3>
        {projects.some(p => p.purchases?.length > 0) ? (
          <div className="purchase-history">
            {projects.filter(p => p.purchases?.length > 0).map(project =>
              project.purchases.map((purchase, i) => {
                const buyer = industryBuyers.find(b => b.id === purchase.buyerId)
                return (
                  <div key={`${project.id}-${i}`} className="purchase-row">
                    <div className="purchase-row__info">
                      <strong>{buyer?.name || 'Unknown Buyer'}</strong>
                      <span>{buyer?.sector}</span>
                    </div>
                    <div className="purchase-row__details">
                      <span>{purchase.amount} CFT</span>
                      <span>@ ${purchase.price}/CFT</span>
                    </div>
                    <div className="purchase-row__total">
                      ${(purchase.amount * purchase.price).toLocaleString()}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        ) : (
          <div className="empty-state"><p>No purchases yet.</p></div>
        )}
      </GlassCard>
    </div>
  )
}
