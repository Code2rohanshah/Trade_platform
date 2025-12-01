import { useState, useEffect, useRef } from 'react';
import { create } from 'zustand';

// ========== EXPANDED STOCK DATABASE - 26 STOCKS ==========
const STOCK_DATABASE = {
  // IT Sector
  TCS: { sector: 'IT', mcap: 'Large', pe: 28, roe: 46, debt: 0, margin: 25, dividend: 2.8, growth: 10 },
  INFY: { sector: 'IT', mcap: 'Large', pe: 27, roe: 28, debt: 0, margin: 22, dividend: 2.5, growth: 12 },
  WIPRO: { sector: 'IT', mcap: 'Large', pe: 24, roe: 16, debt: 0, margin: 17, dividend: 3.2, growth: 8 },
  HCLTECH: { sector: 'IT', mcap: 'Large', pe: 25, roe: 22, debt: 0, margin: 20, dividend: 4.5, growth: 11 },
  TECHM: { sector: 'IT', mcap: 'Large', pe: 23, roe: 18, debt: 0.2, margin: 14, dividend: 2.1, growth: 9 },
  
  // Banking
  HDFC: { sector: 'Banking', mcap: 'Large', pe: 19, roe: 17, debt: 0, margin: 0, dividend: 1.3, growth: 18 },
  ICICIBANK: { sector: 'Banking', mcap: 'Large', pe: 16, roe: 16, debt: 0, margin: 0, dividend: 2.5, growth: 20 },
  SBIN: { sector: 'Banking', mcap: 'Large', pe: 11, roe: 14, debt: 0, margin: 0, dividend: 3.8, growth: 15 },
  KOTAKBANK: { sector: 'Banking', mcap: 'Large', pe: 18, roe: 15, debt: 0, margin: 0, dividend: 0.8, growth: 16 },
  AXISBANK: { sector: 'Banking', mcap: 'Large', pe: 13, roe: 13, debt: 0, margin: 0, dividend: 1.2, growth: 17 },
  
  // Pharma
  SUNPHARMA: { sector: 'Pharma', mcap: 'Large', pe: 35, roe: 12, debt: 0.1, margin: 16, dividend: 1.2, growth: 11 },
  DRREDDY: { sector: 'Pharma', mcap: 'Large', pe: 28, roe: 14, debt: 0.3, margin: 18, dividend: 1.8, growth: 13 },
  CIPLA: { sector: 'Pharma', mcap: 'Large', pe: 26, roe: 16, debt: 0.2, margin: 17, dividend: 2.2, growth: 12 },
  BIOCON: { sector: 'Pharma', mcap: 'Large', pe: 32, roe: 11, debt: 0.4, margin: 14, dividend: 0.9, growth: 15 },
  
  // Auto
  MARUTI: { sector: 'Auto', mcap: 'Large', pe: 26, roe: 17, debt: 0, margin: 10, dividend: 2.2, growth: 14 },
  TATAMOTORS: { sector: 'Auto', mcap: 'Large', pe: 18, roe: 25, debt: 2.1, margin: 7, dividend: 0, growth: 22 },
  MAHINDRA: { sector: 'Auto', mcap: 'Large', pe: 22, roe: 19, debt: 0.8, margin: 12, dividend: 1.5, growth: 18 },
  BAJAJ_AUTO: { sector: 'Auto', mcap: 'Large', pe: 24, roe: 28, debt: 0, margin: 16, dividend: 3.5, growth: 13 },
  
  // FMCG
  HINDUNILVR: { sector: 'FMCG', mcap: 'Large', pe: 58, roe: 82, debt: 0, margin: 15, dividend: 2.8, growth: 8 },
  ITC: { sector: 'FMCG', mcap: 'Large', pe: 24, roe: 27, debt: 0, margin: 28, dividend: 5.5, growth: 7 },
  NESTLEIND: { sector: 'FMCG', mcap: 'Large', pe: 68, roe: 92, debt: 0, margin: 17, dividend: 1.9, growth: 12 },
  BRITANNIA: { sector: 'FMCG', mcap: 'Large', pe: 52, roe: 32, debt: 0.1, margin: 14, dividend: 2.1, growth: 10 },
  
  // Metals
  TATASTEEL: { sector: 'Metals', mcap: 'Large', pe: 29, roe: 9, debt: 1.8, margin: 8, dividend: 2.1, growth: 8 },
  JSWSTEEL: { sector: 'Metals', mcap: 'Large', pe: 46, roe: 8, debt: 1.2, margin: 11, dividend: 0.3, growth: 14 },
  HINDALCO: { sector: 'Metals', mcap: 'Large', pe: 10, roe: 15, debt: 1.5, margin: 7, dividend: 0.6, growth: 11 },
  
  // Diversified
  RELIANCE: { sector: 'Diversified', mcap: 'Large', pe: 24, roe: 9, debt: 0.5, margin: 8, dividend: 1.8, growth: 12 },
};

const SECTOR_ANALYSIS = {
  IT: { outlook: 'Positive', drivers: 'AI/Digital transformation, Cloud migration', risks: 'US recession, currency' },
  Banking: { outlook: 'Strong', drivers: 'Credit growth 12-15%, improving asset quality', risks: 'Interest rate changes' },
  Auto: { outlook: 'Positive', drivers: 'EV adoption, rural recovery', risks: 'Commodity prices' },
  Pharma: { outlook: 'Stable', drivers: 'US generics, domestic growth', risks: 'FDA issues' },
  FMCG: { outlook: 'Moderate', drivers: 'Rural consumption', risks: 'Raw material inflation' },
  Metals: { outlook: 'Cyclical', drivers: 'Infrastructure capex, global demand', risks: 'China slowdown, commodity prices' },
  Diversified: { outlook: 'Positive', drivers: 'Multiple business engines', risks: 'Sector-specific headwinds' },
};

const generateSmartResponse = (q, watchlist, portfolio) => {
  const ql = q.toLowerCase();
  
  const analyzeStock = (symbol) => {
    const stock = watchlist.find(s => s.symbol === symbol);
    const data = STOCK_DATABASE[symbol];
    
    if (!stock) return `No live data available for ${symbol}. Please check the symbol.`;
    if (!data) return `${symbol} trading at ₹${stock.currentPrice.toFixed(2)}. Limited fundamental data available.`;
    
    const trend = stock.changePercent > 1 ? 'Strong Bullish 🚀' : 
                  stock.changePercent > 0 ? 'Mildly Bullish 📈' : 
                  stock.changePercent < -1 ? 'Bearish 📉' : 'Neutral ➡️';
    
    const valuation = data.pe < 15 ? 'Undervalued ✅' : data.pe < 25 ? 'Fairly Valued' : 'Expensive ⚠️';
    const quality = data.roe > 20 ? 'High Quality ⭐' : data.roe > 15 ? 'Good Quality' : 'Average';
    const debtLevel = data.debt < 0.5 ? 'Low Debt ✅' : data.debt < 1 ? 'Moderate Debt' : 'High Debt ⚠️';
    
    return `📊 **${symbol} - COMPLETE DEEP ANALYSIS**

**🔴 LIVE PRICE:** ₹${stock.currentPrice.toFixed(2)} (${stock.changePercent >= 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%)
**Trend:** ${trend}

**📈 FUNDAMENTAL METRICS:**
━━━━━━━━━━━━━━━━━━━━
• **Sector:** ${data.sector}
• **Market Cap:** ${data.mcap}
• **P/E Ratio:** ${data.pe}x (${valuation})
• **ROE:** ${data.roe}% (${quality})
• **Debt/Equity:** ${data.debt} (${debtLevel})
• **Net Margin:** ${data.margin}%
• **Dividend Yield:** ${data.dividend}%
• **Growth Rate:** ${data.growth}% YoY

**📊 TECHNICAL VIEW:**
${stock.changePercent > 2 ? 
`✅ Strong bullish momentum
✅ High volume support
⚠️ RSI overbought - book partial profits
💡 Wait for 3-5% pullback for entry` : 
stock.changePercent > 0.5 ?
`✅ Positive momentum building
✅ Good accumulation zone
💡 Buy on dips with 7% stop-loss` :
stock.changePercent < -2 ?
`✅ Oversold - value opportunity
✅ Quality at discount
💡 Strong buy if fundamentals intact` :
`⚠️ Range-bound consolidation
💡 Wait for breakout confirmation`}

**💰 VALUATION ANALYSIS:**
${data.pe < 15 ?
`✅ Trading below fair value
✅ P/E discount vs sector
💡 Attractive entry point` :
data.pe < 25 ?
`➡️ Fair valuation
➡️ Growth justifies premium
💡 Buy on market dips` :
`⚠️ Premium valuation
⚠️ Earnings miss = correction risk
💡 Wait for better entry`}

**💪 KEY STRENGTHS:**
${data.roe > 20 ? '✅ Exceptional ROE (>20%)\n' : ''}${data.debt < 0.5 ? '✅ Strong balance sheet\n' : ''}${data.margin > 15 ? '✅ Healthy profit margins\n' : ''}${data.dividend > 2 ? '✅ Good dividend yield\n' : ''}${data.growth > 15 ? '✅ Strong growth trajectory' : ''}

**⚠️ RISKS TO WATCH:**
${data.debt > 1 ? '⚠️ High debt - monitor coverage\n' : ''}${data.sector === 'IT' ? '⚠️ US recession impact\n⚠️ Currency headwinds\n' : ''}${data.sector === 'Banking' ? '⚠️ Asset quality in downturn\n' : ''}${data.sector === 'Metals' ? '⚠️ Commodity price volatility\n' : ''}${data.pe > 30 ? '⚠️ Expensive valuation' : ''}

**🎯 PRICE TARGETS:**
━━━━━━━━━━━━━━━━━━━━
• **Conservative (6M):** ₹${(stock.currentPrice * 1.08).toFixed(2)} (+8%)
• **Base Case (12M):** ₹${(stock.currentPrice * 1.15).toFixed(2)} (+15%)
• **Bull Case (18M):** ₹${(stock.currentPrice * 1.25).toFixed(2)} (+25%)
• **Stop Loss:** ₹${(stock.currentPrice * 0.92).toFixed(2)} (-8%)

**✅ INVESTMENT VERDICT:**
${stock.changePercent > 0 && data.pe < 20 && data.roe > 15 ?
'🟢 **STRONG BUY** - Excellent fundamentals + positive momentum' :
stock.changePercent < -2 && data.roe > 15 ?
'🟢 **BUY ON DIP** - Quality company at discount' :
data.pe > 30 ?
'🔴 **AVOID/HOLD** - Too expensive' :
'🟡 **ACCUMULATE** - Build position gradually'}

**👥 IDEAL FOR:** ${data.dividend > 3 ? 'Dividend investors, ' : ''}${data.growth > 15 ? 'Growth investors, ' : ''}${data.debt < 0.5 ? 'Conservative investors' : 'Aggressive investors'}`;
  };
  
  // Stock analysis triggers
  if (ql.includes('tcs')) return analyzeStock('TCS');
  if (ql.includes('reliance') || ql.includes('ril')) return analyzeStock('RELIANCE');
  if (ql.includes('hdfc')) return analyzeStock('HDFC');
  if (ql.includes('icici')) return analyzeStock('ICICIBANK');
  if (ql.includes('sbi') || ql.includes('state bank')) return analyzeStock('SBIN');
  if (ql.includes('infy') || ql.includes('infosys')) return analyzeStock('INFY');
  if (ql.includes('wipro')) return analyzeStock('WIPRO');
  if (ql.includes('hcl')) return analyzeStock('HCLTECH');
  if (ql.includes('hul') || ql.includes('hindustan')) return analyzeStock('HINDUNILVR');
  if (ql.includes('itc')) return analyzeStock('ITC');
  if (ql.includes('maruti')) return analyzeStock('MARUTI');
  if (ql.includes('tata motor')) return analyzeStock('TATAMOTORS');
  if (ql.includes('sun pharma')) return analyzeStock('SUNPHARMA');
  if (ql.includes('dr reddy') || ql.includes('drreddy')) return analyzeStock('DRREDDY');
  if (ql.includes('tata steel')) return analyzeStock('TATASTEEL');
  if (ql.includes('jsw')) return analyzeStock('JSWSTEEL');
  
  if (ql.includes('market') || ql.includes('nifty')) {
    return `📈 **MARKET ANALYSIS** - Check watchlist for live trends across 8 sectors! Ask about specific stocks for detailed analysis.`;
  }
  
  if (ql.includes('buy') || ql.includes('invest')) {
    return `💰 **TOP PICKS BY SECTOR:**

**IT:** TCS, Infosys
**Banking:** HDFC Bank, ICICI Bank
**Pharma:** Sun Pharma, Dr Reddy's
**Auto:** Maruti, Bajaj Auto
**FMCG:** HUL, ITC

Ask "Analyze [stock]" for deep dive!`;
  }
  
  if (ql.includes('portfolio')) {
    return portfolio.length === 0 ? 
    `📊 Build diversified portfolio across sectors. Start with 2-3 stocks from IT, Banking, and FMCG.` :
    `📊 You have ${portfolio.length} stocks. Aim for 10-15 stocks across 5-6 sectors. Keep 15% cash reserve.`;
  }
  
  if (ql.includes('risk') || ql.includes('stop loss')) {
    return `⚠️ **RISK MANAGEMENT:** Position size: Max 10% per stock | Stop-loss: 7-10% for swing, 20% trailing for long-term | Diversify across sectors | Never use borrowed money!`;
  }
  
  if (ql.includes('sell') || ql.includes('exit')) {
    return `🔴 **WHEN TO SELL:** Fundamentals deteriorating | Target hit (book 30% at +30% gain) | Better opportunity | Stock >15% of portfolio | DON'T sell on short-term dips!`;
  }
  
  return `🤖 **AI TRADING ASSISTANT**

**26 Stocks Covered:**
• IT: TCS, Infosys, Wipro, HCL, Tech Mahindra
• Banking: HDFC, ICICI, SBI, Kotak, Axis
• Pharma: Sun Pharma, Dr Reddy's, Cipla, Biocon
• Auto: Maruti, Tata Motors, M&M, Bajaj Auto
• FMCG: HUL, ITC, Nestle, Britannia
• Metals: Tata Steel, JSW Steel, Hindalco
• Diversified: Reliance

**Ask:** "Analyze Maruti" or "Best pharma stocks"`;
};

// ========== EXPANDED STOCK LIST - 26 STOCKS ==========
const INDIAN_STOCKS = [
  // IT Sector (5 stocks)
  { symbol: 'TCS', name: 'Tata Consultancy Services', basePrice: 3680 },
  { symbol: 'INFY', name: 'Infosys', basePrice: 1520 },
  { symbol: 'WIPRO', name: 'Wipro', basePrice: 445 },
  { symbol: 'HCLTECH', name: 'HCL Technologies', basePrice: 1285 },
  { symbol: 'TECHM', name: 'Tech Mahindra', basePrice: 1075 },
  
  // Banking (5 stocks)
  { symbol: 'HDFC', name: 'HDFC Bank', basePrice: 1645 },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', basePrice: 985 },
  { symbol: 'SBIN', name: 'State Bank of India', basePrice: 612 },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', basePrice: 1750 },
  { symbol: 'AXISBANK', name: 'Axis Bank', basePrice: 1085 },
  
  // Pharma (4 stocks)
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical', basePrice: 1680 },
  { symbol: 'DRREDDY', name: "Dr Reddy's Laboratories", basePrice: 5850 },
  { symbol: 'CIPLA', name: 'Cipla', basePrice: 1450 },
  { symbol: 'BIOCON', name: 'Biocon', basePrice: 325 },
  
  // Auto (4 stocks)
  { symbol: 'MARUTI', name: 'Maruti Suzuki', basePrice: 10850 },
  { symbol: 'TATAMOTORS', name: 'Tata Motors', basePrice: 785 },
  { symbol: 'MAHINDRA', name: 'Mahindra & Mahindra', basePrice: 2850 },
  { symbol: 'BAJAJ_AUTO', name: 'Bajaj Auto', basePrice: 9250 },
  
  // FMCG (4 stocks)
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', basePrice: 2385 },
  { symbol: 'ITC', name: 'ITC Limited', basePrice: 465 },
  { symbol: 'NESTLEIND', name: 'Nestle India', basePrice: 2250 },
  { symbol: 'BRITANNIA', name: 'Britannia Industries', basePrice: 4850 },
  
  // Metals (3 stocks)
  { symbol: 'TATASTEEL', name: 'Tata Steel', basePrice: 168 },
  { symbol: 'JSWSTEEL', name: 'JSW Steel', basePrice: 1160 },
  { symbol: 'HINDALCO', name: 'Hindalco Industries', basePrice: 778 },
  
  // Diversified (1 stock)
  { symbol: 'RELIANCE', name: 'Reliance Industries', basePrice: 2450 },
];

const generatePrice = (base) => {
  const change = (Math.random() - 0.5) * (base * 0.02);
  return parseFloat((base + change).toFixed(2));
};

const useStore = create((set) => ({
  isAuthenticated: localStorage.getItem('loggedIn') === 'true',
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  
  login: (email, password) => {
    const user = { email, name: email.split('@')[0] };
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(user));
    set({ isAuthenticated: true, user });
  },
  
  logout: () => {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('user');
    localStorage.removeItem('portfolio');
    set({ isAuthenticated: false, user: null, portfolio: [], orders: [] });
  },
  
  watchlist: INDIAN_STOCKS.map(s => ({ ...s, currentPrice: s.basePrice, change: 0, changePercent: 0 })),
  
  selectedStock: null,
  setSelectedStock: (stock) => set({ selectedStock: stock }),
  
  updatePrices: () => {
    set(state => ({
      watchlist: state.watchlist.map(s => {
        const newPrice = generatePrice(s.basePrice);
        const change = newPrice - s.currentPrice;
        const changePercent = (change / s.currentPrice) * 100;
        return { ...s, currentPrice: newPrice, change, changePercent };
      })
    }));
  },
  
  orders: [],
  portfolio: JSON.parse(localStorage.getItem('portfolio') || '[]'),
  
  placeOrder: (order) => {
    set(state => {
      const newOrder = { ...order, id: Date.now(), timestamp: new Date().toISOString() };
      const orders = [newOrder, ...state.orders];
      let portfolio = [...state.portfolio];
      
      if (order.type === 'buy') {
        const idx = portfolio.findIndex(p => p.symbol === order.symbol);
        if (idx >= 0) {
          const existing = portfolio[idx];
          const totalQty = existing.quantity + order.quantity;
          const avgPrice = ((existing.avgPrice * existing.quantity) + (order.price * order.quantity)) / totalQty;
          portfolio[idx] = { ...existing, quantity: totalQty, avgPrice: parseFloat(avgPrice.toFixed(2)) };
        } else {
          portfolio.push({
            symbol: order.symbol,
            name: order.name,
            quantity: order.quantity,
            avgPrice: order.price
          });
        }
      } else {
        const idx = portfolio.findIndex(p => p.symbol === order.symbol);
        if (idx >= 0) {
          const newQty = portfolio[idx].quantity - order.quantity;
          if (newQty <= 0) portfolio.splice(idx, 1);
          else portfolio[idx] = { ...portfolio[idx], quantity: newQty };
        }
      }
      
      localStorage.setItem('portfolio', JSON.stringify(portfolio));
      return { orders, portfolio };
    });
  }
}));

// ========== LOGIN COMPONENT ==========
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useStore(s => s.login);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-indigo-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-slide-up">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">Welcome Back</h1>
        <p className="text-gray-600 mb-6">Sign in to your trading account</p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition shadow-lg"
          >
            Sign In
          </button>
        </form>
        
        <p className="mt-4 text-center text-sm text-gray-600">Demo: Use any email/password</p>
      </div>
    </div>
  );
}

// ========== DASHBOARD ==========
function Dashboard() {
  const { user, logout, watchlist, selectedStock, setSelectedStock, updatePrices, portfolio, placeOrder } = useStore();
  
  const [orderType, setOrderType] = useState('buy');
  const [quantity, setQuantity] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [orderProcessing, setOrderProcessing] = useState(false);
  
  // 🔴 FIX: Store quantity in state for success message
  const [lastOrderQty, setLastOrderQty] = useState(1);
  
  const [messages, setMessages] = useState([
    { role: 'bot', content: "👋 Hi! I'm your AI Trading Assistant covering 26 stocks across 8 sectors. Ask me anything!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(updatePrices, 2000);
    return () => clearInterval(interval);
  }, [updatePrices]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (selectedStock) {
      const updatedStock = watchlist.find(s => s.symbol === selectedStock.symbol);
      if (updatedStock) {
        setSelectedStock(updatedStock);
      }
    }
  }, [watchlist]);

  const holding = portfolio.find(p => p.symbol === selectedStock?.symbol);
  const maxSell = holding?.quantity || 0;

  const enrichedPortfolio = portfolio.map(h => {
    const stock = watchlist.find(s => s.symbol === h.symbol);
    const currentPrice = stock?.currentPrice || h.avgPrice;
    const pnl = (currentPrice - h.avgPrice) * h.quantity;
    const pnlPercent = ((currentPrice - h.avgPrice) / h.avgPrice) * 100;
    return { ...h, currentPrice, pnl, pnlPercent, totalValue: currentPrice * h.quantity, invested: h.avgPrice * h.quantity };
  });

  const totalInv = enrichedPortfolio.reduce((s, h) => s + h.invested, 0);
  const totalCur = enrichedPortfolio.reduce((s, h) => s + h.totalValue, 0);
  const totalPnl = totalCur - totalInv;
  const totalPnlPercent = totalInv > 0 ? (totalPnl / totalInv) * 100 : 0;

  const handleOrder = () => {
    if (!selectedStock) return;
    
    // 🔴 FIX: Store quantity before placing order
    setLastOrderQty(quantity);
    
    let profitData = null;
    if (orderType === 'sell' && holding) {
      // 🔴 FIX: Calculate profit for ACTUAL quantity being sold
      const profitAmount = (selectedStock.currentPrice - holding.avgPrice) * quantity;
      const profitPercent = ((selectedStock.currentPrice - holding.avgPrice) / holding.avgPrice) * 100;
      profitData = {
        amount: profitAmount,
        percent: profitPercent,
        avgPrice: holding.avgPrice,
        sellPrice: selectedStock.currentPrice,
        quantity: quantity // Store quantity in profit data
      };
    }
    
    setOrderProcessing(true);
    
    setTimeout(() => {
      placeOrder({
        symbol: selectedStock.symbol,
        name: selectedStock.name,
        type: orderType,
        quantity: parseInt(quantity),
        price: selectedStock.currentPrice,
        profitData: profitData
      });
      
      setOrderProcessing(false);
      setShowConfirm(false);
      
      if (orderType === 'sell' && profitData) {
        setOrderSuccess({ type: 'sell', profit: profitData, quantity: quantity });
      } else {
        setOrderSuccess({ type: 'buy', quantity: quantity });
      }
      
      setQuantity(1);
      setTimeout(() => setOrderSuccess(null), 4000);
    }, 1200);
  };

  const sendMsg = () => {
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setInput('');
    setMessages(p => [...p, { role: 'user', content: msg }]);
    setLoading(true);
    setTimeout(() => {
      setMessages(p => [...p, { role: 'bot', content: generateSmartResponse(msg, watchlist, portfolio) }]);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">TradePro</h1>
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium">
              💼 Portfolio ({portfolio.length}) | 📊 26 Stocks
            </div>
            <span className="text-gray-700">Welcome, {user?.name}</span>
            <button onClick={logout} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Watchlist */}
          <div className="bg-white rounded-lg shadow-lg p-4 border">
            <h2 className="text-xl font-bold mb-4">Watchlist (26)</h2>
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
              {watchlist.map(stock => (
                <div
                  key={stock.symbol}
                  onClick={() => setSelectedStock(stock)}
                  className={`p-3 rounded-lg mb-2 cursor-pointer transition-all ${
                    selectedStock?.symbol === stock.symbol
                      ? 'bg-blue-100 border-2 border-blue-500 scale-105 shadow-md'
                      : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-sm">{stock.symbol}</p>
                      <p className="text-xs text-gray-500 truncate">{stock.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">₹{stock.currentPrice.toFixed(2)}</p>
                      <p className={`text-xs ${stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stock.changePercent >= 0 ? '▲' : '▼'} {Math.abs(stock.changePercent).toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Panel + Chatbot */}
          <div className="lg:col-span-2 space-y-4">
            {/* Order Panel */}
            <div className="bg-white rounded-lg shadow-lg p-5 border relative overflow-hidden">
              {/* 🔴 FIXED: Success overlay with correct quantity */}
              {orderSuccess && (
                <div className={`absolute inset-0 z-50 flex items-center justify-center animate-fade-in ${
                  orderSuccess.type === 'sell' && orderSuccess.profit
                    ? orderSuccess.profit.amount >= 0
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                      : 'bg-gradient-to-br from-red-500 to-rose-600'
                    : 'bg-gradient-to-br from-green-500 to-emerald-600'
                }`}>
                  <div className="text-center text-white p-6 max-w-md">
                    <div className="text-7xl mb-4 animate-bounce">
                      {orderSuccess.type === 'buy' ? '✅' : 
                       orderSuccess.profit?.amount >= 0 ? '💰' : '📉'}
                    </div>
                    
                    <h3 className="text-3xl font-bold mb-3">
                      {orderSuccess.type === 'buy' 
                        ? 'Order Successful!' 
                        : orderSuccess.profit?.amount >= 0 
                          ? '🎉 Profit Booked!' 
                          : '⚠️ Loss Realized'}
                    </h3>
                    
                    {/* 🔴 FIXED: Show actual quantity */}
                    <p className="text-xl mb-3">
                      {orderSuccess.type === 'buy' ? 'Bought' : 'Sold'} {orderSuccess.quantity} shares of {selectedStock?.symbol}
                    </p>
                    
                    {orderSuccess.type === 'sell' && orderSuccess.profit && (
                      <div className="mt-4 bg-white/20 backdrop-blur rounded-xl p-4 border-2 border-white/30">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="opacity-90">Quantity:</span>
                            <span className="font-bold">{orderSuccess.profit.quantity} shares</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="opacity-90">Buy Price:</span>
                            <span className="font-bold">₹{orderSuccess.profit.avgPrice.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="opacity-90">Sell Price:</span>
                            <span className="font-bold">₹{orderSuccess.profit.sellPrice.toFixed(2)}</span>
                          </div>
                          <div className="h-px bg-white/30 my-2"></div>
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">Total P&L:</span>
                            <div className="text-right">
                              <div className={`text-2xl font-bold ${
                                orderSuccess.profit.amount >= 0 ? 'text-white' : 'text-red-100'
                              }`}>
                                {orderSuccess.profit.amount >= 0 ? '+' : ''}₹{orderSuccess.profit.amount.toFixed(2)}
                              </div>
                              <div className={`text-sm font-semibold ${
                                orderSuccess.profit.amount >= 0 ? 'text-green-100' : 'text-red-200'
                              }`}>
                                {orderSuccess.profit.amount >= 0 ? '+' : ''}{orderSuccess.profit.percent.toFixed(2)}%
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {orderSuccess.profit.amount >= 0 ? (
                          <div className="mt-3 text-sm opacity-90">
                            🎯 Great trade! Keep following your strategy!
                          </div>
                        ) : (
                          <div className="mt-3 text-sm opacity-90">
                            📊 Learn from this. Not every trade wins!
                          </div>
                        )}
                      </div>
                    )}
                    
                    {orderSuccess.type === 'buy' && (
                      <p className="text-sm mt-3 opacity-90">
                        Total: ₹{(selectedStock?.currentPrice * orderSuccess.quantity).toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {orderProcessing && (
                <div className="absolute inset-0 bg-white/95 z-40 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-xl font-bold text-gray-800">Processing...</p>
                    <p className="text-sm text-gray-600 mt-2">Executing {orderType} order</p>
                  </div>
                </div>
              )}

              <h2 className="text-2xl font-bold mb-4">Place Order</h2>

              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setOrderType('buy')}
                  className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all transform ${
                    orderType === 'buy'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  📈 BUY
                </button>
                <button
                  onClick={() => setOrderType('sell')}
                  disabled={!holding}
                  className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all transform ${
                    orderType === 'sell'
                      ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-600 disabled:opacity-50'
                  }`}
                >
                  📉 SELL
                </button>
              </div>

              <div className="mb-4 p-4 rounded-xl border-2 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300">
                {selectedStock ? (
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-bold text-xl">{selectedStock.symbol}</span>
                      <span className="font-bold text-2xl text-blue-600">₹{selectedStock.currentPrice.toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-gray-600">{selectedStock.name}</p>
                    {holding && (
                      <p className="mt-2 text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full inline-block font-bold">
                        Holding: {holding.quantity} shares @ ₹{holding.avgPrice.toFixed(2)}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">← Select stock from watchlist</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block font-bold mb-2">Quantity</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-14 h-14 bg-gray-200 rounded-xl font-bold text-2xl hover:bg-gray-300 transition"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-1 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-blue-500"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={orderType === 'sell' && quantity >= maxSell}
                    className="w-14 h-14 bg-gray-200 rounded-xl font-bold text-2xl hover:bg-gray-300 transition disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>

              {selectedStock && (
                <div className="mb-4 p-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount:</span>
                    <span className="text-2xl text-blue-600">₹{(selectedStock.currentPrice * quantity).toFixed(2)}</span>
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowConfirm(true)}
                disabled={!selectedStock || (orderType === 'sell' && quantity > maxSell)}
                className={`w-full py-4 rounded-xl font-bold text-xl transition-all transform ${
                  selectedStock
                    ? orderType === 'buy'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:scale-105'
                      : 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg hover:scale-105'
                    : 'bg-gray-300 text-gray-500'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {selectedStock ? `${orderType === 'buy' ? '🛒 Place Buy Order' : '💰 Place Sell Order'}` : 'Select Stock First'}
              </button>
            </div>

            {/* Chatbot */}
            <div className="bg-white rounded-lg shadow-lg p-4 border">
              <div className="flex items-center gap-3 mb-3 pb-3 border-b">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white text-2xl">🤖</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">AI Trading Assistant</h2>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-xs text-gray-600">26 stocks | 8 sectors</span>
                  </div>
                </div>
              </div>
              
              <div className="h-64 overflow-y-auto space-y-3 mb-3 pr-2">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[90%] p-3 rounded-lg text-sm whitespace-pre-wrap ${
                      m.role === 'user' 
                        ? 'bg-blue-500 text-white rounded-br-none' 
                        : 'bg-gray-100 text-gray-800 border border-gray-200 rounded-bl-none'
                    }`}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-lg border">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={endRef} />
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && sendMsg()}
                  placeholder="Ask about stocks..."
                  disabled={loading}
                  className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
                />
                <button 
                  onClick={sendMsg} 
                  disabled={loading || !input.trim()}
                  className="px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  🚀
                </button>
              </div>
            </div>
          </div>

          {/* 🔴 FIXED: Portfolio with Total Value */}
          <div className="bg-white rounded-lg shadow-lg p-4 border">
            <h2 className="text-xl font-bold mb-4">Portfolio</h2>
            
            {portfolio.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-3">📊</div>
                <p className="text-gray-500">No holdings yet</p>
                <p className="text-sm text-gray-400 mt-1">Buy stocks to start!</p>
              </div>
            ) : (
              <>
                <div className="mb-4 p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Total P&L</p>
                  <p className={`text-2xl font-bold ${totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {totalPnl >= 0 ? '+' : ''}₹{totalPnl.toFixed(2)}
                  </p>
                  <p className={`text-sm font-semibold ${totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {totalPnl >= 0 ? '+' : ''}{totalPnlPercent.toFixed(2)}%
                  </p>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto mb-4">
                  {enrichedPortfolio.map(h => (
                    <div key={h.symbol} className="p-3 border rounded-lg hover:shadow-md transition">
                      <div className="flex justify-between mb-2">
                        <p className="font-bold">{h.symbol}</p>
                        <p className="text-sm text-gray-600">{h.quantity} shares</p>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">₹{h.avgPrice.toFixed(2)}</span>
                        <span className={`font-bold ${h.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {h.pnl >= 0 ? '+' : ''}₹{h.pnl.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 🔴 NEW: Total Portfolio Value */}
                <div className="border-t-2 pt-4">
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Invested</span>
                      <span className="font-bold text-gray-800">₹{totalInv.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Current Value</span>
                      <span className="font-bold text-gray-800">₹{totalCur.toFixed(2)}</span>
                    </div>
                    <div className="h-px bg-gray-300 my-2"></div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-700">Total P&L</span>
                      <div className="text-right">
                        <div className={`text-xl font-bold ${totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {totalPnl >= 0 ? '+' : ''}₹{totalPnl.toFixed(2)}
                        </div>
                        <div className={`text-sm font-semibold ${totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {totalPnl >= 0 ? '+' : ''}{totalPnlPercent.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && selectedStock && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-scale-in">
            <div className={`text-center p-4 rounded-xl mb-4 ${
              orderType === 'buy' ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <div className="text-6xl mb-2">{orderType === 'buy' ? '📈' : '📉'}</div>
              <h3 className="text-2xl font-bold">Confirm {orderType === 'buy' ? 'Purchase' : 'Sale'}</h3>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span>Action</span>
                <span className="font-bold uppercase">{orderType}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span>Stock</span>
                <span className="font-bold">{selectedStock.symbol}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span>Quantity</span>
                <span className="font-bold">{quantity} shares</span>
              </div>
              <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                <span className="font-bold">Total</span>
                <span className="font-bold text-xl text-blue-600">
                  ₹{(selectedStock.currentPrice * quantity).toFixed(2)}
                </span>
              </div>
              
              {/* 🔴 FIXED: Expected P/L with correct quantity */}
              {orderType === 'sell' && holding && (
                (() => {
                  const buyPrice = holding.avgPrice;
                  const sellPrice = selectedStock.currentPrice;
                  const profitAmount = (sellPrice - buyPrice) * quantity;
                  const profitPercent = ((sellPrice - buyPrice) / buyPrice) * 100;
                  
                  return (
                    <div className={`p-4 rounded-lg border-2 ${
                      profitAmount >= 0
                        ? 'bg-green-50 border-green-300'
                        : 'bg-red-50 border-red-300'
                    }`}>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Quantity:</span>
                          <span className="font-semibold">{quantity} shares</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Buy Price:</span>
                          <span className="font-semibold">₹{buyPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Sell Price:</span>
                          <span className="font-semibold">₹{sellPrice.toFixed(2)}</span>
                        </div>
                        <div className="h-px bg-gray-300 my-2"></div>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-700">Expected P&L:</span>
                          <div className="text-right">
                            <div className={`text-xl font-bold ${
                              profitAmount >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {profitAmount >= 0 ? '+' : ''}₹{profitAmount.toFixed(2)}
                            </div>
                            <div className={`text-sm font-semibold ${
                              profitAmount >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {profitPercent >= 0 ? '+' : ''}{profitPercent.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 border-2 rounded-xl font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleOrder}
                className={`flex-1 py-3 rounded-xl font-semibold text-white ${
                  orderType === 'buy'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                    : 'bg-gradient-to-r from-red-500 to-rose-600'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-scale-in { animation: scale-in 0.4s ease-out; }
        .animate-slide-up { animation: slide-up 0.5s ease-out; }
      `}</style>
    </div>
  );
}

export default function App() {
  const isAuthenticated = useStore(s => s.isAuthenticated);
  return isAuthenticated ? <Dashboard /> : <Login />;
}
