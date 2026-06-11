export const features = [
  {
    title: 'Adaptive homepage intelligence',
    description: 'Your storefront updates dynamically based on behavior, seasonality, and wishlist signals.',
    badge: 'Personalized',
  },
  {
    title: 'Real deal analyzer',
    description: 'AI evaluates pricing trends, competitor data, and seller credibility to mark genuine value.',
    badge: 'Trust first',
  },
  {
    title: 'Smart bundle suggestions',
    description: 'Automatically assemble compatible accessories, warranties and services for maximum savings.',
    badge: 'Premium value',
  },
];

export const recommendations = [
  { title: 'Best value gaming laptop for creators', note: 'AI-selected balanced performance with future-ready compatibility.', value: '₹69,999', type: 'Laptop' },
  { title: 'Ultra-low latency audio bundle', note: 'Perfect for streaming, podcasting, and travel content creation.', value: '₹14,499', type: 'Accessories' },
  { title: 'Verified seller bundle', note: 'Top-rated merchants with performance-backed trust signals.', value: '₹27,199', type: 'Bundle' },
  { title: 'Sustainable smartwatch kit', note: 'Long-life battery, repairability score, and carbon impact details included.', value: '₹19,299', type: 'Wearables' },
];

export const trendingProducts = [
  { title: 'Neon Edge Gaming Laptop', subtitle: 'High performance for creatives and gamers.', price: 67999, discount: 11, badge: 'AI pick', slug: 'neon-edge-gaming-laptop' },
  { title: 'Aurora Productivity Monitor', subtitle: 'Color-accurate display for editing, design, and streaming.', price: 23499, discount: 14, badge: 'Smart choice', slug: 'aurora-productivity-monitor' },
  { title: 'ZenCharge Pro Bundle', subtitle: 'Fast charging, protection, and premium carry solution.', price: 8499, discount: 18, badge: 'Bundle saver', slug: 'zencharge-pro-bundle' },
];

export const searchRecommendations = [
  { title: 'Neon Edge Gaming Laptop', note: 'Best in class for coding, streaming, and rendering under ₹70k.', value: '₹69,999', type: 'Laptop' },
  { title: 'Lumen Studio Bundle', note: 'External monitor, docking station, and travel-friendly warranty.', value: '₹26,999', type: 'Bundle' },
  { title: 'Aurora Audio Setup', note: 'Noise-canceling headset plus AI voice-enhancement subscription.', value: '₹10,499', type: 'Accessories' },
  { title: 'EcoCharge Travel Kit', note: 'Lightweight charger, power bank, and compatibility scoring.', value: '₹5,499', type: 'Accessory' },
];

export const sampleProduct = {
  title: 'Neon Edge Gaming Laptop',
  slug: 'neon-edge-gaming-laptop',
  shortDescription: 'A future-ready mobile workstation designed for creators, gamers, and professionals who demand speed and reliability.',
  currentPrice: 67999,
  mrp: 75999,
  sellerTrustScore: 93,
  features: ['RGB-tuned cooling', '2.5K OLED display', 'Thunderbolt 4 support', 'Up to 12-hour battery life'],
  variants: [
    { priceDelta: 0, stock: 18, deliveryDays: 3 },
    { priceDelta: 4500, stock: 10, deliveryDays: 4 },
    { priceDelta: 6500, stock: 5, deliveryDays: 5 },
  ],
  priceHistory: [
    { timestamp: new Date('2026-05-01'), price: 69999 },
    { timestamp: new Date('2026-04-01'), price: 72999 },
    { timestamp: new Date('2026-03-01'), price: 74999 },
    { timestamp: new Date('2026-02-01'), price: 75999 },
  ],
};

export const sampleAssistantResponses = [
  {
    prompt: 'Help me find value laptops for productivity and gaming.',
    recommendation: 'The Neon Edge is ideal for heavy editing, while the Aurora Productivity Monitor adds a strong second screen experience.',
    insights: ['Use the 1TB SSD variant for video workflows.', 'Pair with the EcoCharge travel charger for reliable power anywhere.'],
    followUp: 'Would you like me to compare warranty and repairability for these options?',
  },
];
