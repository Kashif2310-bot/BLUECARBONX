import { useState } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import GlassCard from '../../components/shared/GlassCard'
import './BrowseMarketplace.css'

export default function BrowseMarketplace() {
  const { marketplaceListings, purchaseTokens, industryBuyers } = useApp()
  const [purchaseModal, setPurchaseModal] = useState(null)
  const [purchaseAmount, setPurchaseAmount] = useState('')
  const [purchaseComplete, setPurchaseComplete] = useState(null)

  const currentBuyer = industryBuyers[0] // Demo buyer

  const handlePurchase = () => {
    if (!purchaseModal || !purchaseAmount || parseInt(purchaseAmount) <= 0) return
    const amount = parseInt(purchaseAmount)
    if (amount > purchaseModal.availableCFT) return

    purchaseTokens(purchaseModal.id, currentBuyer.id, amount)

    setPurchaseComplete({
      listing: purchaseModal,
      amount,
      total: amount * purchaseModal.pricePerCFT,
      nftProof: `BCX-BUYER-${Date.now()}`,
      txHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
    })
    setPurchaseModal(null)
    setPurchaseAmount('')
  }

  return (
    <div className="browse-marketplace">
      <div className="dashboard-page-header">
        <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          🏪 Carbon Credit Marketplace
        </motion.h1>
        <p>Browse and purchase verified carbon credits from restoration communities</p>
      </div>

      {/* Listings */}
      <div className="marketplace-grid">
        {marketplaceListings.map((listing, i) => (
          <GlassCard key={listing.id} delay={i * 0.1} variant="cyan" className="market-card">
            <div className="market-card__header">
              <div>
                <h3>{listing.projectName}</h3>
                <span className="market-card__location">📍 {listing.location}</span>
                <span className="market-card__community">👥 {listing.communityName}</span>
              </div>
              <div className="market-card__price-tag">
                <span className="price-value">${listing.pricePerCFT}</span>
                <span className="price-unit">per CFT</span>
              </div>
            </div>

            <div className="market-card__stats">
              <div className="mc-stat">
                <span className="mc-stat-label">Available</span>
                <span className="mc-stat-value">{listing.availableCFT} CFT</span>
              </div>
              <div className="mc-stat">
                <span className="mc-stat-label">Carbon Impact</span>
                <span className="mc-stat-value">{listing.carbonImpact}</span>
              </div>
              <div className="mc-stat">
                <span className="mc-stat-label">Health Index</span>
                <span className="mc-stat-value">{(listing.healthIndex * 100).toFixed(0)}%</span>
              </div>
              <div className="mc-stat">
                <span className="mc-stat-label">NFT Token</span>
                <span className="mc-stat-value">{listing.nftTokenId}</span>
              </div>
            </div>

            {listing.species?.length > 0 && (
              <div className="market-card__species">
                {listing.species.map(s => (
                  <span key={s} className="species-tag">🌿 {s}</span>
                ))}
              </div>
            )}

            <div className="market-card__blockchain">
              <span className="bc-label">IPFS Verified</span>
              <code>{listing.ipfsCID?.slice(0, 24)}...</code>
              <span className="bc-verified">✓</span>
            </div>

            <button
              className="btn btn-primary market-card__buy"
              onClick={() => setPurchaseModal(listing)}
              disabled={listing.availableCFT <= 0}
            >
              💰 Purchase Tokens
            </button>
          </GlassCard>
        ))}
      </div>

      {/* Purchase Modal */}
      {purchaseModal && (
        <div className="modal-overlay" onClick={() => setPurchaseModal(null)}>
          <GlassCard className="modal-card purchase-modal" animate={false} onClick={e => e.stopPropagation()}>
            <h3>💰 Purchase CFT Tokens</h3>
            <p className="purchase-project">{purchaseModal.projectName}</p>
            <div className="purchase-price-display">
              <span>${purchaseModal.pricePerCFT}/CFT</span>
              <span>•</span>
              <span>{purchaseModal.availableCFT} available</span>
            </div>
            <div className="form-group">
              <label>Amount to Purchase (CFT)</label>
              <input
                type="number"
                value={purchaseAmount}
                onChange={e => setPurchaseAmount(e.target.value)}
                placeholder={`Max: ${purchaseModal.availableCFT}`}
                max={purchaseModal.availableCFT}
                min="1"
              />
            </div>
            {purchaseAmount && parseInt(purchaseAmount) > 0 && (
              <div className="purchase-total">
                Total: <strong>${(parseInt(purchaseAmount) * purchaseModal.pricePerCFT).toLocaleString()}</strong>
              </div>
            )}
            <div className="purchase-includes">
              <p>✓ CFT Tokens transferred to your wallet</p>
              <p>✓ NFT Proof of Carbon Offset</p>
              <p>✓ Blockchain transaction record</p>
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setPurchaseModal(null)}>Cancel</button>
              <button
                className="btn btn-primary"
                onClick={handlePurchase}
                disabled={!purchaseAmount || parseInt(purchaseAmount) <= 0 || parseInt(purchaseAmount) > purchaseModal.availableCFT}
              >
                Confirm Purchase
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Purchase Complete */}
      {purchaseComplete && (
        <div className="modal-overlay" onClick={() => setPurchaseComplete(null)}>
          <GlassCard className="modal-card purchase-complete" animate={false} onClick={e => e.stopPropagation()}>
            <div className="purchase-success-icon">✅</div>
            <h3>Purchase Complete!</h3>
            <div className="purchase-receipt">
              <div className="receipt-row"><span>Project</span><strong>{purchaseComplete.listing.projectName}</strong></div>
              <div className="receipt-row"><span>Amount</span><strong>{purchaseComplete.amount} CFT</strong></div>
              <div className="receipt-row"><span>Total Paid</span><strong>${purchaseComplete.total.toLocaleString()}</strong></div>
              <div className="receipt-row"><span>NFT Proof</span><code>{purchaseComplete.nftProof}</code></div>
              <div className="receipt-row"><span>Tx Hash</span><code className="tx-hash">{purchaseComplete.txHash.slice(0, 20)}...</code></div>
            </div>
            <button className="btn btn-primary" onClick={() => setPurchaseComplete(null)}>Done</button>
          </GlassCard>
        </div>
      )}
    </div>
  )
}
