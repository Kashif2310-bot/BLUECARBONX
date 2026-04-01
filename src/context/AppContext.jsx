import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AppContext = createContext()

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}

/* ======= MOCK DATA SEED ======= */
const ADMIN_PERSONAS = [
  { id: 'admin-1', name: 'Dr. Sarah Chen', role: 'Marine Biologist', avatar: '👩‍🔬' },
  { id: 'admin-2', name: 'James Okafor', role: 'Environmental Auditor', avatar: '👨‍💼' },
  { id: 'admin-3', name: 'Dr. Priya Sharma', role: 'Climate Scientist', avatar: '👩‍🏫' },
  { id: 'admin-4', name: 'Carlos Mendez', role: 'Blockchain Verifier', avatar: '👨‍💻' },
  { id: 'admin-5', name: 'Aisha Al-Rashid', role: 'Governance Lead', avatar: '👩‍⚖️' },
]

const INDUSTRY_BUYERS = [
  { id: 'ind-1', name: 'GreenTech Corp', sector: 'Technology', avatar: '🏢' },
  { id: 'ind-2', name: 'OceanFirst Energy', sector: 'Energy', avatar: '⚡' },
  { id: 'ind-3', name: 'Sustainable Shipping Ltd', sector: 'Logistics', avatar: '🚢' },
]

const generateHash = (len = 64) =>
  '0x' + Array.from({ length: len }, () => Math.floor(Math.random() * 16).toString(16)).join('')

const generateCID = () => {
  const c = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let cid = 'Qm'
  for (let i = 0; i < 44; i++) cid += c[Math.floor(Math.random() * c.length)]
  return cid
}

const seedData = () => {
  const now = Date.now()
  const day = 86400000

  const projects = [
    {
      id: 'proj-001',
      name: 'Sundarbans Mangrove Belt',
      description: 'Restoration of 12 hectares of mangrove forest in the Sundarbans delta region. Includes replanting of Rhizophora species and monitoring of sediment carbon sequestration.',
      location: { lat: 21.9497, lng: 89.1833, name: 'Sundarbans, West Bengal' },
      communityId: 'comm-1',
      communityName: 'Sundarbans Restoration Trust',
      status: 'approved',
      createdAt: new Date(now - 15 * day).toISOString(),
      images: ['mangrove_before.jpg', 'mangrove_after.jpg'],
      videoFile: 'site_walkthrough.mp4',
      analysis: {
        vegetationScore: 87.3,
        biomassDetected: 42.8,
        carbonRestored: 245,
        confidence: 92.1,
        hasVegetation: true,
        speciesDetected: ['Rhizophora mucronata', 'Avicennia marina'],
        healthIndex: 0.89,
      },
      cftAmount: 245,
      ipfsCID: generateCID(),
      nftTokenId: 'BCX-2026-001',
      nftTxHash: generateHash(),
      cftTxHash: generateHash(),
      approvals: [
        { adminId: 'admin-1', approved: true, timestamp: new Date(now - 13 * day).toISOString() },
        { adminId: 'admin-2', approved: true, timestamp: new Date(now - 12 * day).toISOString() },
        { adminId: 'admin-3', approved: true, timestamp: new Date(now - 12 * day).toISOString() },
      ],
      rejectionReason: null,
      flagged: false,
      marketplace: { listed: true, pricePerCFT: 12.5, sold: 100, remaining: 145 },
      purchases: [
        { buyerId: 'ind-1', amount: 60, price: 12.5, timestamp: new Date(now - 5 * day).toISOString() },
        { buyerId: 'ind-2', amount: 40, price: 12.5, timestamp: new Date(now - 3 * day).toISOString() },
      ],
    },
    {
      id: 'proj-002',
      name: 'Pichavaram Seagrass Restoration',
      description: 'Large-scale seagrass restoration covering 8 hectares near Pichavaram mangrove forest. Focus on Cymodocea and Halodule species for blue carbon.',
      location: { lat: 11.4287, lng: 79.7916, name: 'Pichavaram, Tamil Nadu' },
      communityId: 'comm-2',
      communityName: 'Coastal Green Initiative',
      status: 'approved',
      createdAt: new Date(now - 22 * day).toISOString(),
      images: ['seagrass_site.jpg', 'seagrass_restored.jpg'],
      analysis: {
        vegetationScore: 79.5,
        biomassDetected: 31.2,
        carbonRestored: 189,
        confidence: 88.7,
        hasVegetation: true,
        speciesDetected: ['Cymodocea serrulata', 'Halodule uninervis'],
        healthIndex: 0.82,
      },
      cftAmount: 189,
      ipfsCID: generateCID(),
      nftTokenId: 'BCX-2026-002',
      nftTxHash: generateHash(),
      cftTxHash: generateHash(),
      approvals: [
        { adminId: 'admin-1', approved: true, timestamp: new Date(now - 20 * day).toISOString() },
        { adminId: 'admin-3', approved: true, timestamp: new Date(now - 19 * day).toISOString() },
        { adminId: 'admin-5', approved: true, timestamp: new Date(now - 19 * day).toISOString() },
      ],
      rejectionReason: null,
      flagged: false,
      marketplace: { listed: true, pricePerCFT: 14.0, sold: 50, remaining: 139 },
      purchases: [
        { buyerId: 'ind-3', amount: 50, price: 14.0, timestamp: new Date(now - 8 * day).toISOString() },
      ],
    },
    {
      id: 'proj-003',
      name: 'Chilika Lake Wetland Recovery',
      description: 'Wetland restoration project around Chilika Lake focusing on salt marsh vegetation and sediment carbon capture.',
      location: { lat: 19.7214, lng: 85.3191, name: 'Chilika, Odisha' },
      communityId: 'comm-3',
      communityName: 'Chilika Eco Guardians',
      status: 'pending',
      createdAt: new Date(now - 2 * day).toISOString(),
      images: ['chilika_wetland.jpg'],
      analysis: {
        vegetationScore: 72.1,
        biomassDetected: 25.6,
        carbonRestored: 156,
        confidence: 85.3,
        hasVegetation: true,
        speciesDetected: ['Suaeda maritima', 'Salicornia brachiata'],
        healthIndex: 0.76,
      },
      cftAmount: 0,
      ipfsCID: null,
      nftTokenId: null,
      approvals: [
        { adminId: 'admin-2', approved: true, timestamp: new Date(now - 1 * day).toISOString() },
      ],
      rejectionReason: null,
      flagged: false,
      marketplace: null,
      purchases: [],
    },
    {
      id: 'proj-004',
      name: 'Gujarat Saltpan Rehab',
      description: 'Conversion of abandoned saltpans into thriving mangrove habitats along the Gulf of Kutch coastline.',
      location: { lat: 22.4707, lng: 70.0577, name: 'Gulf of Kutch, Gujarat' },
      communityId: 'comm-1',
      communityName: 'Sundarbans Restoration Trust',
      status: 'rejected',
      createdAt: new Date(now - 10 * day).toISOString(),
      images: ['saltpan_overview.jpg'],
      analysis: {
        vegetationScore: 23.4,
        biomassDetected: 5.1,
        carbonRestored: 0,
        confidence: 91.2,
        hasVegetation: false,
        speciesDetected: [],
        healthIndex: 0.18,
      },
      cftAmount: 0,
      ipfsCID: null,
      nftTokenId: null,
      approvals: [
        { adminId: 'admin-1', approved: false, timestamp: new Date(now - 8 * day).toISOString() },
        { adminId: 'admin-4', approved: false, timestamp: new Date(now - 8 * day).toISOString() },
        { adminId: 'admin-5', approved: false, timestamp: new Date(now - 7 * day).toISOString() },
      ],
      rejectionReason: 'Insufficient vegetation detected. AI analysis shows only 23.4% vegetation score, which is below the 40% minimum threshold. The submitted images appear to show minimal restoration progress. Please resubmit with updated evidence after further restoration efforts.',
      flagged: false,
      marketplace: null,
      purchases: [],
    },
    {
      id: 'proj-005',
      name: 'Andaman Coral-Mangrove Buffer',
      description: 'Creating a coral-mangrove buffer zone in the Andaman Islands to protect shorelines and sequester blue carbon.',
      location: { lat: 11.7401, lng: 92.6586, name: 'Port Blair, Andaman' },
      communityId: 'comm-4',
      communityName: 'Andaman Blue Carbon Collective',
      status: 'pending',
      createdAt: new Date(now - 1 * day).toISOString(),
      images: ['andaman_coast.jpg', 'mangrove_seedlings.jpg'],
      analysis: {
        vegetationScore: 68.9,
        biomassDetected: 28.3,
        carbonRestored: 172,
        confidence: 87.5,
        hasVegetation: true,
        speciesDetected: ['Rhizophora apiculata', 'Bruguiera gymnorrhiza'],
        healthIndex: 0.74,
      },
      cftAmount: 0,
      ipfsCID: null,
      nftTokenId: null,
      approvals: [],
      rejectionReason: null,
      flagged: false,
      marketplace: null,
      purchases: [],
    },
    {
      id: 'proj-006',
      name: 'Kerala Backwater Mangrove Network',
      description: 'Interconnected mangrove restoration across Kerala backwaters to create a carbon sink corridor.',
      location: { lat: 9.4981, lng: 76.3388, name: 'Alleppey, Kerala' },
      communityId: 'comm-5',
      communityName: 'Kerala Backwater Alliance',
      status: 'flagged',
      createdAt: new Date(now - 5 * day).toISOString(),
      images: ['kerala_backwater.jpg'],
      analysis: {
        vegetationScore: 95.1,
        biomassDetected: 58.7,
        carbonRestored: 312,
        confidence: 67.2,
        hasVegetation: true,
        speciesDetected: ['Unknown'],
        healthIndex: 0.95,
      },
      cftAmount: 0,
      ipfsCID: null,
      nftTokenId: null,
      approvals: [
        { adminId: 'admin-4', approved: false, timestamp: new Date(now - 4 * day).toISOString(), note: 'Suspicious: abnormally high vegetation score with low confidence' },
      ],
      rejectionReason: null,
      flagged: true,
      flagReason: 'AI confidence score (67.2%) is unusually low despite very high vegetation score (95.1%). Possible image manipulation detected. Requires manual field verification.',
      marketplace: null,
      purchases: [],
    },
  ]

  const wallet = {
    balance: 434,
    address: '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
    transactions: [
      { type: 'CFT_ISSUED', amount: 245, timestamp: new Date(now - 12 * day).toISOString(), projectId: 'proj-001' },
      { type: 'CFT_ISSUED', amount: 189, timestamp: new Date(now - 19 * day).toISOString(), projectId: 'proj-002' },
      { type: 'CFT_SOLD', amount: -60, timestamp: new Date(now - 5 * day).toISOString(), projectId: 'proj-001', buyerId: 'ind-1' },
      { type: 'CFT_SOLD', amount: -40, timestamp: new Date(now - 3 * day).toISOString(), projectId: 'proj-001', buyerId: 'ind-2' },
      { type: 'CFT_SOLD', amount: -50, timestamp: new Date(now - 8 * day).toISOString(), projectId: 'proj-002', buyerId: 'ind-3' },
    ],
  }

  const marketplaceListings = [
    {
      id: 'listing-1',
      projectId: 'proj-001',
      projectName: 'Sundarbans Mangrove Belt',
      location: 'Sundarbans, West Bengal',
      communityName: 'Sundarbans Restoration Trust',
      pricePerCFT: 12.5,
      totalCFT: 245,
      availableCFT: 145,
      carbonImpact: '24.5 tCO₂e',
      nftTokenId: 'BCX-2026-001',
      ipfsCID: projects[0].ipfsCID,
      species: ['Rhizophora mucronata', 'Avicennia marina'],
      healthIndex: 0.89,
      listedAt: new Date(now - 10 * day).toISOString(),
    },
    {
      id: 'listing-2',
      projectId: 'proj-002',
      projectName: 'Pichavaram Seagrass Restoration',
      location: 'Pichavaram, Tamil Nadu',
      communityName: 'Coastal Green Initiative',
      pricePerCFT: 14.0,
      totalCFT: 189,
      availableCFT: 139,
      carbonImpact: '18.9 tCO₂e',
      nftTokenId: 'BCX-2026-002',
      ipfsCID: projects[1].ipfsCID,
      species: ['Cymodocea serrulata', 'Halodule uninervis'],
      healthIndex: 0.82,
      listedAt: new Date(now - 14 * day).toISOString(),
    },
  ]

  const industryPortfolio = {
    'ind-1': {
      totalTokens: 60,
      totalSpent: 750,
      purchases: [
        { listingId: 'listing-1', projectId: 'proj-001', amount: 60, price: 12.5, timestamp: new Date(now - 5 * day).toISOString(), nftProof: 'BCX-BUYER-001' },
      ],
    },
    'ind-2': {
      totalTokens: 40,
      totalSpent: 500,
      purchases: [
        { listingId: 'listing-1', projectId: 'proj-001', amount: 40, price: 12.5, timestamp: new Date(now - 3 * day).toISOString(), nftProof: 'BCX-BUYER-002' },
      ],
    },
    'ind-3': {
      totalTokens: 50,
      totalSpent: 700,
      purchases: [
        { listingId: 'listing-2', projectId: 'proj-002', amount: 50, price: 14.0, timestamp: new Date(now - 8 * day).toISOString(), nftProof: 'BCX-BUYER-003' },
      ],
    },
  }

  return { projects, wallet, marketplaceListings, industryPortfolio }
}

/* ======= PROVIDER ======= */
export const AppProvider = ({ children }) => {
  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('bcx-role') || null
  })

  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('bcx-projects')
    if (saved) return JSON.parse(saved)
    return seedData().projects
  })

  const [wallet, setWallet] = useState(() => {
    const saved = localStorage.getItem('bcx-wallet')
    if (saved) return JSON.parse(saved)
    return seedData().wallet
  })

  const [marketplaceListings, setMarketplaceListings] = useState(() => {
    const saved = localStorage.getItem('bcx-marketplace')
    if (saved) return JSON.parse(saved)
    return seedData().marketplaceListings
  })

  const [industryPortfolio, setIndustryPortfolio] = useState(() => {
    const saved = localStorage.getItem('bcx-portfolio')
    if (saved) return JSON.parse(saved)
    return seedData().industryPortfolio
  })

  // Persist
  useEffect(() => { localStorage.setItem('bcx-projects', JSON.stringify(projects)) }, [projects])
  useEffect(() => { localStorage.setItem('bcx-wallet', JSON.stringify(wallet)) }, [wallet])
  useEffect(() => { localStorage.setItem('bcx-marketplace', JSON.stringify(marketplaceListings)) }, [marketplaceListings])
  useEffect(() => { localStorage.setItem('bcx-portfolio', JSON.stringify(industryPortfolio)) }, [industryPortfolio])
  useEffect(() => {
    if (currentRole) localStorage.setItem('bcx-role', currentRole)
    else localStorage.removeItem('bcx-role')
  }, [currentRole])

  // === PROJECT ACTIONS ===
  const addProject = useCallback((project) => {
    const newProject = {
      id: 'proj-' + Date.now(),
      ...project,
      createdAt: new Date().toISOString(),
      status: 'pending',
      approvals: [],
      rejectionReason: null,
      flagged: false,
      marketplace: null,
      purchases: [],
    }
    setProjects(prev => [newProject, ...prev])
    return newProject.id
  }, [])

  const updateProject = useCallback((id, updates) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))
  }, [])

  const getProject = useCallback((id) => projects.find(p => p.id === id), [projects])

  // === APPROVAL ACTIONS (multi-sig) ===
  const submitApproval = useCallback((projectId, adminId, approved, reason = '') => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p
      const newApprovals = [...(p.approvals || []).filter(a => a.adminId !== adminId), {
        adminId, approved, timestamp: new Date().toISOString(), note: reason
      }]
      const approveCount = newApprovals.filter(a => a.approved).length
      const rejectCount = newApprovals.filter(a => !a.approved).length
      let newStatus = p.status
      let rejectionReason = p.rejectionReason

      if (approveCount >= 3) {
        newStatus = 'approved'
        // Auto-generate tokens on approval
        const cftAmount = p.analysis?.carbonRestored || 0
        if (cftAmount > 0) {
          const ipfsCID = generateCID()
          const nftTokenId = `BCX-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
          return {
            ...p, approvals: newApprovals, status: newStatus, rejectionReason: null,
            cftAmount, ipfsCID, nftTokenId,
            nftTxHash: generateHash(), cftTxHash: generateHash(),
          }
        }
      }
      if (rejectCount >= 3) {
        newStatus = 'rejected'
        rejectionReason = reason || 'Rejected by multi-signature governance panel.'
      }

      return { ...p, approvals: newApprovals, status: newStatus, rejectionReason }
    }))
  }, [])

  const flagProject = useCallback((projectId, flagReason) => {
    updateProject(projectId, { flagged: true, flagReason, status: 'flagged' })
  }, [updateProject])

  // === WALLET ACTIONS ===
  const addTransaction = useCallback((transaction) => {
    setWallet(prev => ({
      ...prev,
      balance: prev.balance + (transaction.amount || 0),
      transactions: [{ ...transaction, timestamp: new Date().toISOString() }, ...prev.transactions],
    }))
  }, [])

  // === MARKETPLACE ACTIONS ===
  const listTokensForSale = useCallback((projectId, pricePerCFT, amount) => {
    const project = projects.find(p => p.id === projectId)
    if (!project) return
    const listing = {
      id: 'listing-' + Date.now(),
      projectId, projectName: project.name,
      location: project.location?.name || 'Unknown',
      communityName: project.communityName || 'Unknown',
      pricePerCFT, totalCFT: amount, availableCFT: amount,
      carbonImpact: `${(amount / 10).toFixed(1)} tCO₂e`,
      nftTokenId: project.nftTokenId,
      ipfsCID: project.ipfsCID,
      species: project.analysis?.speciesDetected || [],
      healthIndex: project.analysis?.healthIndex || 0,
      listedAt: new Date().toISOString(),
    }
    setMarketplaceListings(prev => [listing, ...prev])
    updateProject(projectId, {
      marketplace: { listed: true, pricePerCFT, sold: 0, remaining: amount },
    })
  }, [projects, updateProject])

  const purchaseTokens = useCallback((listingId, buyerId, amount) => {
    setMarketplaceListings(prev => prev.map(l => {
      if (l.id !== listingId) return l
      return { ...l, availableCFT: l.availableCFT - amount }
    }))

    const listing = marketplaceListings.find(l => l.id === listingId)
    if (!listing) return

    // Update industry portfolio
    setIndustryPortfolio(prev => {
      const current = prev[buyerId] || { totalTokens: 0, totalSpent: 0, purchases: [] }
      return {
        ...prev,
        [buyerId]: {
          totalTokens: current.totalTokens + amount,
          totalSpent: current.totalSpent + amount * listing.pricePerCFT,
          purchases: [
            {
              listingId, projectId: listing.projectId, amount,
              price: listing.pricePerCFT,
              timestamp: new Date().toISOString(),
              nftProof: `BCX-BUYER-${Date.now()}`,
            },
            ...current.purchases,
          ],
        },
      }
    })

    // Add sell transaction to community wallet
    addTransaction({
      type: 'CFT_SOLD',
      amount: amount * listing.pricePerCFT,
      projectId: listing.projectId,
      buyerId,
    })
  }, [marketplaceListings, addTransaction])

  // === RESET ===
  const resetData = useCallback(() => {
    const fresh = seedData()
    setProjects(fresh.projects)
    setWallet(fresh.wallet)
    setMarketplaceListings(fresh.marketplaceListings)
    setIndustryPortfolio(fresh.industryPortfolio)
  }, [])

  const value = {
    // State
    currentRole, projects, wallet, marketplaceListings, industryPortfolio,
    // Constants
    adminPersonas: ADMIN_PERSONAS, industryBuyers: INDUSTRY_BUYERS,
    // Role
    setCurrentRole,
    // Projects
    addProject, updateProject, getProject,
    // Approvals
    submitApproval, flagProject,
    // Wallet
    addTransaction,
    // Marketplace
    listTokensForSale, purchaseTokens,
    // Util
    resetData,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
