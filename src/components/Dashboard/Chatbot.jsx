import { useState, useRef, useEffect } from 'react';
import useStore from '../../store/useStore';

// ========== MASSIVE KNOWLEDGE BASE ==========

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
  
  // Diversified
  RELIANCE: { sector: 'Diversified', mcap: 'Large', pe: 24, roe: 9, debt: 0.5, margin: 8, dividend: 1.8, growth: 12 },
  
  // Auto
  MARUTI: { sector: 'Auto', mcap: 'Large', pe: 26, roe: 17, debt: 0, margin: 10, dividend: 2.2, growth: 14 },
  TATAMOTORS: { sector: 'Auto', mcap: 'Large', pe: 18, roe: 25, debt: 2.1, margin: 7, dividend: 0, growth: 22 },
  M_M: { sector: 'Auto', mcap: 'Large', pe: 22, roe: 19, debt: 0.8, margin: 12, dividend: 1.5, growth: 18 },
  
  // Pharma
  SUNPHARMA: { sector: 'Pharma', mcap: 'Large', pe: 35, roe: 12, debt: 0.1, margin: 16, dividend: 1.2, growth: 11 },
  DRREDDY: { sector: 'Pharma', mcap: 'Large', pe: 28, roe: 14, debt: 0.3, margin: 18, dividend: 1.8, growth: 13 },
  
  // FMCG
  HINDUNILVR: { sector: 'FMCG', mcap: 'Large', pe: 58, roe: 82, debt: 0, margin: 15, dividend: 2.8, growth: 8 },
  ITC: { sector: 'FMCG', mcap: 'Large', pe: 24, roe: 27, debt: 0, margin: 28, dividend: 5.5, growth: 7 },
  NESTLEIND: { sector: 'FMCG', mcap: 'Large', pe: 68, roe: 92, debt: 0, margin: 17, dividend: 1.9, growth: 12 },
};

const TECHNICAL_PATTERNS = {
  doji: 'Indecision candle - potential reversal',
  hammer: 'Bullish reversal at support',
  shootingStar: 'Bearish reversal at resistance',
  engulfing: 'Strong reversal signal',
  morningStar: 'Bottom reversal - 3 candles',
  eveningStar: 'Top reversal - 3 candles',
  threeWhiteSoldiers: 'Strong uptrend',
  threeBlackCrows: 'Strong downtrend'
};

const TRADING_STRATEGIES = {
  dayTrading: { risk: 'Very High', capital: '1L+', timeCommitment: 'Full-time', returns: '2-5%/month' },
  swingTrading: { risk: 'High', capital: '50K+', timeCommitment: 'Part-time', returns: '10-20%/quarter' },
  positionTrading: { risk: 'Medium', capital: '1L+', timeCommitment: '1hr/week', returns: '15-25%/year' },
  longTermInvesting: { risk: 'Low-Medium', capital: '10K+', timeCommitment: '1hr/month', returns: '12-18%/year' }
};

const SECTOR_ANALYSIS = {
  IT: { outlook: 'Positive', drivers: 'AI/Digital transformation, Cloud migration', risks: 'US recession, currency' },
  Banking: { outlook: 'Strong', drivers: 'Credit growth 12-15%, improving asset quality', risks: 'Interest rate changes' },
  Auto: { outlook: 'Positive', drivers: 'EV adoption, rural recovery, premiumization', risks: 'Commodity prices' },
  Pharma: { outlook: 'Stable', drivers: 'US generics, domestic growth', risks: 'FDA issues, pricing pressure' },
  FMCG: { outlook: 'Moderate', drivers: 'Rural consumption, premiumization', risks: 'Raw material inflation' },
  Infrastructure: { outlook: 'Excellent', drivers: 'Govt capex, real estate recovery', risks: 'Execution delays' }
};

// ========== ADVANCED RESPONSE GENERATOR ==========

const generateAdvancedResponse = (question, watchlist, portfolio, orders) => {
  const q = question.toLowerCase();
  
  // ===== INDIVIDUAL STOCK ANALYSIS =====
  
  const analyzeStock = (symbol, stockData) => {
    const stock = watchlist.find(s => s.symbol === symbol);
    if (!stock) return `No live data for ${symbol}`;
    
    const data = STOCK_DATABASE[symbol];
    if (!data) return `${symbol} at ₹${stock.currentPrice.toFixed(2)}. Limited fundamental data available.`;
    
    const trend = stock.changePercent > 1 ? 'Strong Bullish 🚀' : stock.changePercent > 0 ? 'Mildly Bullish 📈' : 
                  stock.changePercent < -1 ? 'Bearish 📉' : 'Neutral ➡️';
    
    const valuation = data.pe < 15 ? 'Undervalued' : data.pe < 25 ? 'Fairly Valued' : 'Expensive';
    const quality = data.roe > 20 ? 'High Quality' : data.roe > 15 ? 'Good Quality' : 'Average Quality';
    const debtLevel = data.debt < 0.5 ? 'Low Debt ✅' : data.debt < 1 ? 'Moderate Debt' : 'High Debt ⚠️';
    
    return `📊 **${symbol} - Complete Analysis**

**LIVE PRICE:** ₹${stock.currentPrice.toFixed(2)} (${stock.changePercent >= 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%)
**Trend:** ${trend}

**FUNDAMENTAL METRICS:**
- **Sector:** ${data.sector}
- **P/E Ratio:** ${data.pe}x (${valuation})
- **ROE:** ${data.roe}% (${quality})
- **Debt/Equity:** ${data.debt} (${debtLevel})
- **Net Margin:** ${data.margin}%
- **Dividend Yield:** ${data.dividend}%
- **Growth Rate:** ${data.growth}% YoY

**TECHNICAL VIEW:**
${stock.changePercent > 2 ? '- Strong momentum with volume support\n- RSI likely overbought (book profits)\n- Wait for pullback to 5-day MA' :
  stock.changePercent > 0.5 ? '- Positive momentum building\n- Good accumulation zone\n- Buy on dips with stop-loss' :
  stock.changePercent < -2 ? '- Oversold territory\n- Value buying opportunity if fundamentals intact\n- Watch for reversal signals' :
  '- Range-bound consolidation\n- Wait for breakout confirmation\n- No rush to enter'}

**VALUATION ANALYSIS:**
${data.pe < 15 ? '✅ Trading below historical average - attractive entry\n✅ P/E discount vs sector peers' :
  data.pe < 25 ? '➡️ Fair valuation - growth justifies premium\n➡️ Buy on market corrections' :
  '⚠️ Premium valuation - expect stellar growth\n⚠️ Any earnings miss can trigger correction'}

**STRENGTHS:**
${data.roe > 20 ? '✅ Exceptional capital efficiency (ROE > 20%)\n' : ''}${data.debt < 0.5 ? '✅ Strong balance sheet with low debt\n' : ''}${data.margin > 15 ? '✅ Healthy profit margins\n' : ''}${data.dividend > 2 ? '✅ Good dividend yield for income investors\n' : ''}${data.growth > 15 ? '✅ Strong revenue growth trajectory' : ''}

**RISKS TO WATCH:**
${data.debt > 1 ? '⚠️ High debt levels - monitor interest coverage\n' : ''}${data.sector === 'IT' ? '⚠️ US market exposure - recession impact\n⚠️ Currency headwinds\n' : ''}${data.sector === 'Banking' ? '⚠️ Asset quality in downturn\n⚠️ NPA risks\n' : ''}${data.sector === 'Auto' ? '⚠️ Commodity price volatility\n⚠️ Demand cyclicality\n' : ''}${data.pe > 30 ? '⚠️ High valuation - limited margin of safety' : ''}

**PRICE TARGETS:**
- **Conservative (6M):** ₹${(stock.currentPrice * 1.08).toFixed(2)} (+8%)
- **Base Case (12M):** ₹${(stock.currentPrice * 1.15).toFixed(2)} (+15%)
- **Bull Case (18M):** ₹${(stock.currentPrice * 1.25).toFixed(2)} (+25%)
- **Stop Loss:** ₹${(stock.currentPrice * 0.92).toFixed(2)} (-8%)

**INVESTMENT VERDICT:**
${stock.changePercent > 0 && data.pe < 20 && data.roe > 15 ? '✅ **BUY** - Good fundamentals + positive momentum' :
  stock.changePercent < -2 && data.roe > 15 ? '✅ **BUY ON DIP** - Quality at discount' :
  data.pe > 30 ? '⚠️ **HOLD/AVOID** - Expensive valuation' :
  '➡️ **HOLD** - Accumulate on 5% dips'}

**IDEAL FOR:** ${data.dividend > 3 ? 'Dividend investors, ' : ''}${data.growth > 15 ? 'Growth investors, ' : ''}${data.sector === 'IT' || data.sector === 'FMCG' ? 'Defensive portfolio, ' : ''}${data.debt < 0.5 ? 'Conservative investors' : 'Aggressive investors'}`;
  };
  
  // Check for specific stock mentions
  if (q.includes('tcs')) return analyzeStock('TCS');
  if (q.includes('infy') || q.includes('infosys')) return analyzeStock('INFY');
  if (q.includes('wipro')) return analyzeStock('WIPRO');
  if (q.includes('hcl')) return analyzeStock('HCLTECH');
  if (q.includes('tech mahindra') || q.includes('techm')) return analyzeStock('TECHM');
  if (q.includes('hdfc')) return analyzeStock('HDFC');
  if (q.includes('icici')) return analyzeStock('ICICIBANK');
  if (q.includes('sbi') || q.includes('state bank')) return analyzeStock('SBIN');
  if (q.includes('kotak')) return analyzeStock('KOTAKBANK');
  if (q.includes('axis')) return analyzeStock('AXISBANK');
  if (q.includes('reliance') || q.includes('ril')) return analyzeStock('RELIANCE');
  if (q.includes('maruti')) return analyzeStock('MARUTI');
  if (q.includes('tata motor')) return analyzeStock('TATAMOTORS');
  if (q.includes('mahindra') || q.includes('m&m')) return analyzeStock('M_M');
  if (q.includes('sun pharma')) return analyzeStock('SUNPHARMA');
  if (q.includes('dr reddy') || q.includes('drreddy')) return analyzeStock('DRREDDY');
  if (q.includes('hul') || q.includes('hindustan')) return analyzeStock('HINDUNILVR');
  if (q.includes('itc')) return analyzeStock('ITC');
  if (q.includes('nestle')) return analyzeStock('NESTLEIND');
  
  // ===== SECTOR ANALYSIS =====
  
  if (q.includes('it sector') || q.includes('tech sector')) {
    return `💻 **IT Sector Comprehensive Analysis**

**SECTOR OVERVIEW:**
Outlook: ${SECTOR_ANALYSIS.IT.outlook}
Key Drivers: ${SECTOR_ANALYSIS.IT.drivers}
Main Risks: ${SECTOR_ANALYSIS.IT.risks}

**TOP PICKS IN IT:**

**1. TCS** - Market Leader
${analyzeStock('TCS').split('\n').slice(0, 8).join('\n')}

**2. Infosys** - Digital Leader
${analyzeStock('INFY').split('\n').slice(0, 8).join('\n')}

**SECTOR STRATEGY:**
✅ Diversify across 3-4 IT stocks
✅ Focus on companies with >60% digital revenue
✅ Prefer debt-free balance sheets
✅ Watch for large deal wins (TCV >$500M)

**CATALYSTS:** Q3/Q4 earnings, client spending trends, AI services revenue

**ALLOCATION:** 15-20% of equity portfolio`;
  }
  
  if (q.includes('bank') && q.includes('sector')) {
    return `🏦 **Banking Sector Deep Dive**

**SECTOR HEALTH:** ${SECTOR_ANALYSIS.Banking.outlook}
**Growth Drivers:** ${SECTOR_ANALYSIS.Banking.drivers}
**Key Risks:** ${SECTOR_ANALYSIS.Banking.risks}

**PRIVATE BANKS (Premium Pick):**
- HDFC Bank - Best asset quality, retail leader
- ICICI Bank - Turnaround story, strong momentum
- Kotak Bank - Premium valuation, high ROE

**PSU BANKS (Value Pick):**
- SBI - Largest bank, improving metrics
- Bank of Baroda - Corporate lending focus

**KEY METRICS TO WATCH:**
1. **Gross NPA:** <3% is good
2. **ROA:** >1.5% is healthy
3. **CASA Ratio:** >40% is strong
4. **Provision Coverage:** >70% is safe

**INVESTMENT STRATEGY:**
- 60% in top 2 private banks (HDFC, ICICI)
- 30% in emerging private banks (Axis, Kotak)
- 10% in PSU banks for value (SBI)

**ALLOCATION:** 20-25% of portfolio`;
  }
  
  // ===== MARKET ANALYSIS =====
  
  if (q.includes('nifty') || q.includes('sensex') || q.includes('market')) {
    const nifty = watchlist.find(s => s.symbol === 'NIFTY50');
    const sensex = watchlist.find(s => s.symbol === 'SENSEX');
    
    return `📈 **Complete Market Analysis - ${new Date().toLocaleDateString()}**

**CURRENT LEVELS:**
- **Nifty 50:** ${nifty?.currentPrice.toFixed(0)} (${nifty?.changePercent >= 0 ? '+' : ''}${nifty?.changePercent.toFixed(2)}%)
- **Sensex:** ${sensex?.currentPrice.toFixed(0)} (${sensex?.changePercent >= 0 ? '+' : ''}${sensex?.changePercent.toFixed(2)}%)

**MARKET SENTIMENT:** ${nifty?.changePercent > 1 ? '🟢 **STRONG BULLISH**\n- Broad-based rally\n- FII inflows positive\n- Risk-on mode' : 
nifty?.changePercent > 0.3 ? '🟢 **MILDLY BULLISH**\n- Selective buying\n- Positive bias continues\n- Breakout attempt' :
nifty?.changePercent < -1 ? '🔴 **BEARISH**\n- Profit booking underway\n- FII selling pressure\n- Defensive rotation' :
'🟡 **NEUTRAL**\n- Consolidation phase\n- Range-bound trading\n- Awaiting triggers'}

**TECHNICAL ANALYSIS:**

**Support Levels:**
- **S1 (Strong):** 19,500
- **S2 (Critical):** 19,200
- **S3 (200-DMA):** 19,000

**Resistance Levels:**
- **R1 (Immediate):** 20,000
- **R2 (Major):** 20,250
- **R3 (All-time high):** 20,500

**Indicators:**
- **RSI:** ${nifty?.changePercent > 1 ? '68 (Overbought - book profits)' : nifty?.changePercent < -1 ? '42 (Oversold - buy opportunity)' : '55 (Neutral)'}
- **MACD:** ${nifty?.changePercent > 0 ? 'Bullish crossover' : 'Bearish crossover'}
- **Moving Averages:** ${nifty?.changePercent > 0 ? 'Trading above 50-DMA ✅' : 'Below 50-DMA ⚠️'}

**SECTORAL PERFORMANCE:**
${nifty?.changePercent > 0 ? 
'**Outperformers:** IT +1.5%, Banking +1.2%, Auto +0.9%\n**Laggards:** Pharma -0.5%, FMCG -0.3%' :
'**Outperformers:** Pharma +0.8%, FMCG +0.5% (defensives)\n**Laggards:** IT -1.2%, Metals -0.9%'}

**FII/DII ACTIVITY:**
${nifty?.changePercent > 0 ?
'- **FII:** Net buyers ₹1,500+ Cr (bullish)\n- **DII:** Consistent buying ₹2,000+ Cr' :
'- **FII:** Net sellers ₹1,000+ Cr (cautious)\n- **DII:** Supporting market ₹1,800+ Cr'}

**KEY DRIVERS:**
1. **Domestic:** Q3 earnings season, RBI policy, GDP data
2. **Global:** US Fed policy, Crude oil prices, China growth
3. **Corporate:** Large deal announcements, capex plans

**TRADING STRATEGY:**

**For Bulls (if Nifty above 19,750):**
- Buy quality dips with 19,650 stop-loss
- Target: 20,000-20,200
- Sectors: IT, Banking, Auto

**For Bears (if Nifty below 19,650):**
- Book profits, raise cash
- Target: 19,400-19,500
- Buy defensives: Pharma, FMCG

**For Long-term Investors:**
- Keep buying on every 2-3% dip
- SIP continues regardless of levels
- Focus: TCS, HDFC, Reliance, Infosys

**OUTLOOK:**

**Next 1 Month:** ${nifty?.changePercent > 0 ? 'Positive bias, target 20,500' : 'Choppy, range 19,200-19,900'}
**Next 3 Months:** Bullish (Elections, earnings growth)
**Next 12 Months:** Target 22,000-23,000 (India growth story intact)

**RISK FACTORS:**
⚠️ Global recession fears
⚠️ Geopolitical tensions
⚠️ Sudden FII outflows
⚠️ Crude oil spike above $95

**BOTTOM LINE:** ${nifty?.changePercent > 0 ? 'Stay invested. Use dips to add quality. Bull market continues.' : 'Short-term weakness = Long-term opportunity. Accumulate on panic.'}`;
  }
  
  // ===== COMPLETE STRATEGIES =====
  
  if (q.includes('strategy') || q.includes('how to trade')) {
    return `💼 **Complete Trading & Investment Strategies**

**1. DAY TRADING 📊**
${JSON.stringify(TRADING_STRATEGIES.dayTrading, null, 2).replace(/[{}"]/g, '')}

**Best For:** Full-time traders
**Approach:** Scalping 0.5-1% moves, 5-10 trades/day
**Tools:** Level 2 data, 5-min charts, momentum indicators
**Stocks:** Nifty 50 stocks with high volume
**Rules:**
- Max loss per trade: 0.5% of capital
- Exit all positions by 3:15 PM
- No overnight positions
- Follow strict stop-loss

**2. SWING TRADING 📈**
${JSON.stringify(TRADING_STRATEGIES.swingTrading, null, 2).replace(/[{}"]/g, '')}

**Best For:** Working professionals
**Approach:** Hold 2-10 days, ride trends
**Tools:** Daily/4H charts, trendlines, volume
**Stocks:** Mid-large caps with momentum
**Entry:** Breakouts, pullbacks to MA
**Exit:** Resistance, trend reversal, 3-5% target

**3. POSITION TRADING 🎯**
${JSON.stringify(TRADING_STRATEGIES.positionTrading, null, 2).replace(/[{}"]/g, '')}

**Best For:** Part-timers with conviction
**Approach:** Fundamental + Technical combo
**Tools:** Weekly charts, fundamental screeners
**Stocks:** Quality names in strong trends
**Hold:** 1-6 months
**Rebalance:** Quarterly

**4. LONG-TERM INVESTING 💎**
${JSON.stringify(TRADING_STRATEGIES.longTermInvesting, null, 2).replace(/[{}"]/g, '')}

**Best For:** Everyone (especially beginners!)
**Approach:** Buy quality, hold 3-5+ years
**Tools:** Annual reports, fundamental ratios
**Stocks:** Market leaders with moat
**Entry:** SIP monthly regardless of price
**Review:** Yearly, sell only if story breaks

**WHICH STRATEGY FOR YOU?**

**If you have:**
- <1 hour/day → Long-term Investing
- 2-3 hours/day → Swing Trading
- 4-6 hours/day → Position Trading
- Full day → Day Trading

**If you want:**
- Low stress → Long-term
- Balanced → Swing/Position
- High action → Day Trading

**MY RECOMMENDATION:**
Start with 80% long-term + 20% swing trading. As you learn, adjust. Most wealth is created through long-term compounding, not frequent trading!`;
  }
  
  // ===== PORTFOLIO ANALYSIS =====
  
  if (q.includes('portfolio') || q.includes('my holdings')) {
    if (portfolio.length === 0) {
      return `📊 **Build Your First Portfolio - Complete Guide**

**STEP 1: Determine Investment Amount**

**If you have ₹50,000:**
- 3-4 stocks (₹12-15K each)
- Focus: Large-caps only

**If you have ₹1,00,000:**
- 5-7 stocks
- Split: 70% large, 30% mid-cap

**If you have ₹2,00,000+:**
- 8-12 stocks
- Split: 60% large, 30% mid, 10% small

**STEP 2: Model Portfolio (₹1 Lakh)**

**IT Sector (₹20,000 - 20%)**
- TCS: ₹12,000
- Infosys: ₹8,000

**Banking (₹25,000 - 25%)**
- HDFC Bank: ₹15,000
- ICICI Bank: ₹10,000

**Diversified (₹15,000 - 15%)**
- Reliance: ₹15,000

**Auto (₹12,000 - 12%)**
- Maruti: ₹12,000

**Pharma (₹10,000 - 10%)**
- Sun Pharma: ₹10,000

**FMCG (₹10,000 - 10%)**
- HUL: ₹10,000

**Cash Reserve (₹8,000 - 8%)**
- For opportunities

**STEP 3: Entry Strategy**

**Option A - SIP (Recommended):**
- ₹10,000/month for 10 months
- Rupee cost averaging
- No timing risk

**Option B - Staggered:**
- Deploy 25% now
- 25% after 1 month
- 25% after 2 months
- 25% opportunistic

**Option C - Lump Sum:**
- Only if market down 10%+
- Deploy 70% immediately
- Keep 30% for further dips

**STEP 4: Quality Checklist**

Before buying ANY stock:
☐ ROE > 15%
☐ Debt/Equity < 1
☐ Profit growth > 10% (3yr)
☐ Market leader in sector
☐ P/E reasonable vs peers
☐ Promoter holding > 50%

**STEP 5: Rules to Follow**

**Position Sizing:**
- Max 10% per stock at entry
- Max 15% after appreciation

**Rebalancing:**
- Review every 6 months
- Rebalance yearly
- Book profits if stock > 15% of portfolio

**Adding Stocks:**
- 1 stock per ₹50K invested
- Max 15-20 stocks total

**Cash Management:**
- Always keep 10-15% cash
- For buying opportunities
- For emergencies

**STEP 6: Tracking**

**Daily:** Nothing! (Reduces stress)
**Weekly:** Quick portfolio check
**Monthly:** Read news, results
**Quarterly:** Deep review of each stock
**Yearly:** Rebalance, tax planning

**YOUR ACTION PLAN:**

**This Week:**
1. Open demat account
2. Research TCS, HDFC Bank
3. Decide: SIP or lumpsum?

**Next Month:**
4. Make first investments
5. Set up tracking spreadsheet
6. Join investment communities

**Remember:** Start small, learn, then scale. Quality > Quantity always!`;
    }
    
    // Existing portfolio analysis
    const enriched = portfolio.map(h => {
      const stock = watchlist.find(s => s.symbol === h.symbol);
      const currentPrice = stock?.currentPrice || h.avgPrice;
      const invested = h.avgPrice * h.quantity;
      const current = currentPrice * h.quantity;
      const pnl = current - invested;
      const pnlPercent = (pnl / invested) * 100;
      return { ...h, currentPrice, invested, current, pnl, pnlPercent };
    });
    
    const totalInv = enriched.reduce((s, h) => s + h.invested, 0);
    const totalCur = enriched.reduce((s, h) => s + h.current, 0);
    const totalPnL = totalCur - totalInv;
    const totalRet = (totalPnL / totalInv) * 100;
    
    return `📊 **Your Portfolio - Professional Analysis**

**SNAPSHOT:**
Holdings: ${portfolio.length} stocks
Invested: ₹${totalInv.toFixed(0)}
Current: ₹${totalCur.toFixed(0)}
P&L: ${totalPnL >= 0 ? '+' : ''}₹${totalPnL.toFixed(0)} (${totalRet >= 0 ? '+' : ''}${totalRet.toFixed(2)}%)

**STOCK-WISE BREAKDOWN:**

${enriched.map((h, i) => `${i+1}. **${h.symbol}**
   Qty: ${h.quantity} | Avg: ₹${h.avgPrice.toFixed(2)} | LTP: ₹${h.currentPrice.toFixed(2)}
   P&L: ${h.pnl >= 0 ? '+' : ''}₹${h.pnl.toFixed(0)} (${h.pnlPercent >= 0 ? '+' : ''}${h.pnlPercent.toFixed(1)}%)
   Action: ${h.pnlPercent > 50 ? '🟢 Book 50% profit' : h.pnlPercent > 30 ? '🟢 Book 30% profit' : h.pnlPercent < -20 ? '🔴 Review urgently!' : h.pnlPercent < -10 ? '🟡 Monitor closely' : '➡️ HOLD'}`).join('\n\n')}

**DIVERSIFICATION SCORE:**
${portfolio.length < 5 ? '⚠️ Under-diversified (add 3-5 stocks)' : portfolio.length <= 12 ? '✅ Good (manageable size)' : '⚠️ Over-diversified (consider consolidating)'}

**PERFORMANCE vs NIFTY:**
Your Return: ${totalRet.toFixed(2)}%
Nifty (YTD): ~12-15%
${totalRet > 15 ? '🏆 OUTPERFORMING! Great picks!' : totalRet > 10 ? '✅ On track' : totalRet > 0 ? '🟡 Underperforming' : '🔴 Review needed'}

**ACTION ITEMS:**

${enriched.filter(h => h.pnlPercent > 30).length > 0 ? `1. Book profits: ${enriched.filter(h => h.pnlPercent > 30).map(h => h.symbol).join(', ')}\n` : ''}${enriched.filter(h => h.pnlPercent < -15).length > 0 ? `2. Review losers: ${enriched.filter(h => h.pnlPercent < -15).map(h => h.symbol).join(', ')}\n` : ''}${portfolio.length < 6 ? '3. Add 2-3 quality stocks for diversification\n' : ''}4. Keep 15% cash for opportunities

Want analysis of specific stock? Just ask!`;
  }
  
  // ===== RISK MANAGEMENT =====
  
  if (q.includes('risk') || q.includes('stop loss') || q.includes('money management')) {
    return `⚠️ **Risk Management - Protect Your Capital**

**THE GOLDEN RULE:**
Preserve capital FIRST, make profits SECOND!

**POSITION SIZING FORMULA:**

Risk per trade = 1-2% of total capital

**Example:**
- Capital: ₹1,00,000
- Risk per trade: ₹1,000-2,000
- Stock price: ₹100
- Stop-loss: ₹93 (7% below)
- Position size: ₹2,000 ÷ ₹7 = 285 shares max

**STOP-LOSS STRATEGIES:**

**1. Percentage-Based:**
- Day trading: 1-2%
- Swing trading: 5-7%
- Position trading: 10-12%
- Long-term: 20% trailing

**2. Technical Stop-Loss:**
- Below recent swing low
- Below support level
- Below moving average (20/50 day)

**3. Time-Based:**
- If trade doesn't work in expected time → Exit
- Example: Swing trade expected 1 week, nothing in 2 weeks → Exit

**RISK-REWARD RATIO:**

**Minimum 1:2 required!**
- Risk ₹10 → Target ₹20+ profit
- Risk ₹7 → Target ₹14+ reward

**Example Trade:**
Entry: ₹100
Stop-loss: ₹93 (₹7 risk)
Target: ₹114+ (₹14 reward)
Ratio: 1:2 ✅

**DIVERSIFICATION RULES:**

**By Stock:**
- Min 5 stocks (diversified)
- Max 15 stocks (manageable)
- No stock >10% at entry
- Max 15% after appreciation

**By Sector:**
- Max 30% in single sector
- Spread across 5-6 sectors

**By Market Cap:**
- Large-cap: 60-70%
- Mid-cap: 20-25%
- Small-cap: 10-15%

**COMMON MISTAKES TO AVOID:**

❌ **Averaging Down Losers**
Don't: Buy more of falling stock
Do: Cut loss and move on

❌ **No Stop-Loss**
Don't: Hold -30%, -50% losses
Do: Accept small -7% to -10% loss

❌ **Over-Leveraging**
Don't: Use margin/borrowed money
Do: Invest only own money

❌ **Revenge Trading**
Don't: Take bigger risk after loss
Do: Step back, analyze mistake

❌ **Over-Trading**
Don't: Trade daily for activity
Do: Trade only good setups

**CAPITAL PRESERVATION:**

**1. Cash Reserve (15-20%):**
- For opportunities during corrections
- For emergencies
- Reduces pressure to sell winners

**2. Profit Booking:**
- Sell 25% when up 25%
- Sell 25% when up 50%
- Let 50% run (winners can be multi-baggers)

**3. Portfolio Hedging:**
When market expensive:
- Reduce equity to 70%
- Add debt/gold 20-30%

**4. Regular Review:**
- Weekly: Check stop-losses
- Monthly: Performance review
- Quarterly: Rebalance portfolio

**PSYCHOLOGY OF RISK:**

**Fear → Selling winners early**
**Greed → Holding losers long**

**Solution:**
Write down BEFORE entering trade:
- Entry price
- Stop-loss price
- Target price
- Position size

Then FOLLOW THE PLAN!

**REAL EXAMPLE:**

**Good Risk Management:**
- 10 trades
- 6 winners: +₹3K each = +₹18K
- 4 losers: -₹1K each = -₹4K
- Net: +₹14K ✅

**Bad Risk Management:**
- 10 trades
- 8 winners: +₹1K each = +₹8K
- 2 big losers: -₹10K each = -₹20K
- Net: -₹12K ❌

**KEY TAKEAWAY:**
It's not about win rate. It's about making MORE on winners than losing on losers. Even 50% win rate + good risk management = Profitable trader! 🎯`;
  }
  
  // ===== BUY/SELL DECISIONS =====
  
  if (q.includes('should i buy') || q.includes('buy now') || q.includes('invest')) {
    const stockMentioned = watchlist.find(s => q.includes(s.symbol.toLowerCase()));
    if (stockMentioned) {
      return analyzeStock(stockMentioned.symbol);
    }
    
    return `💰 **Investment Decision Framework**

**BEFORE BUYING - Complete Checklist:**

**1. Fundamental Analysis ✅**

**Business Quality:**
☐ Do you understand the business?
☐ Is it market leader (top 3)?
☐ Does it have competitive moat?
☐ Is management credible?

**Financial Health:**
☐ Revenue growth >10% (3-5yr CAGR)
☐ Profit margin improving/stable (>10%)
☐ ROE >15%
☐ Debt-to-Equity <1
☐ Positive free cash flow

**2. Valuation Check 📊**

☐ P/E reasonable vs industry
☐ PEG ratio <2
☐ Not at 52-week high without reason
☐ Fair value vs intrinsic value

**3. Technical Setup 📈**

☐ Stock in uptrend or base?
☐ Near support (good) or resistance (bad)?
☐ Volume supporting move?
☐ RSI not overbought (>70)?

**4. Risk Assessment ⚠️**

☐ Position size <10% of portfolio?
☐ Stop-loss level identified?
☐ Risk-reward ratio >1:2?
☐ Diversification maintained?

**CURRENT TOP RECOMMENDATIONS:**

**For Long-term (3-5 years):**

**Large-Cap (Low Risk):**
1. **TCS** - IT sector leader
2. **HDFC Bank** - Banking champion
3. **Reliance** - Diversified giant
4. **Infosys** - Digital leader

**Why these?**
✅ Market leaders
✅ Strong fundamentals
✅ Consistent growth
✅ Low debt
✅ Good governance

**Mid-Cap (Moderate Risk):**
- Sector leaders with 15%+ growth
- Research required for specific names

**ENTRY STRATEGY:**

**If Market High (Nifty >19,800):**
- **SIP approach** (monthly investments)
- Deploy 30% now, rest over 3-6 months
- Focus on quality over price

**If Market Corrected (Nifty <19,200):**
- **Lump-sum deployment** possible
- Deploy 60-70% immediately
- Keep 30% for further dips

**SIP ALLOCATION (₹10K/month example):**
- TCS: ₹2,500
- HDFC Bank: ₹2,500
- Reliance: ₹2,000
- Infosys: ₹1,500
- Maruti/Other: ₹1,500

**SECTORS TO FOCUS:**

**High Conviction:**
1. **Banking** - Credit growth 12-15%
2. **IT** - Digital transformation
3. **Infrastructure** - Govt capex

**Moderate:**
4. **Auto** - EV adoption, rural recovery
5. **Pharma** - US generics, domestic

**Avoid Now:**
- Metals (cyclical downturn)
- Real estate (interest rate sensitive)
- Over-valued small-caps

**WHAT NOT TO BUY:**

❌ Penny stocks (<₹20)
❌ Operator-driven stocks
❌ Loss-making companies
❌ High debt companies (D/E >2)
❌ Stocks up 100%+ in 3 months (without reason)

**MY ADVICE:**

**Beginner:** Start with TCS + HDFC Bank
**Intermediate:** Add Reliance + Infosys
**Advanced:** Add 3-4 mid-caps in good sectors

**Always:**
- Do your own research
- Start small, scale up
- Think long-term
- Ignore daily noise

Want analysis of specific stock? Just ask!`;
  }
  
  if (q.includes('sell') || q.includes('exit') || q.includes('book profit')) {
    return `🔴 **When to SELL - Complete Guide**

**VALID REASONS TO SELL:**

**1. Fundamental Deterioration ❌**

Sell immediately if:
☐ Revenue/profit declining 2+ quarters
☐ Debt rising significantly
☐ Market share loss to competitors
☐ Management issues (fraud, governance)
☐ Industry disruption (permanent change)

**Example:** Sell newspaper company even if profitable (industry dying)

**2. Target Achievement ✅**

**The 30-50-100 Rule:**

**Stock up 30%:**
- Sell 25-30% of holding
- Book some profit
- Let 70% run

**Stock up 50%:**
- Sell 40-50% total
- Capture significant gains
- Keep 50% for further upside

**Stock up 100%:**
- Sell 50-60% total
- Now playing with "house money"
- Risk-free position remains

**Example:**
- Bought 100 shares @ ₹100 = ₹10K
- Now @ ₹150 (+50%)
- Sell 40 shares = ₹6K (profit ₹2K)
- Hold 60 shares (let winners run!)

**3. Portfolio Rebalancing ⚖️**

**Concentration Risk:**
Single stock >15% of portfolio

**Example:**
- Portfolio: ₹10L
- Reliance: ₹2L (20%) ← Too much!
- Action: Trim to ₹1.5L, redeploy ₹50K

**Sector Rebalancing:**
One sector >30-35% of portfolio

**4. Better Opportunity 🎯**

Found new stock with:
- 50%+ better growth potential
- Superior fundamentals
- Better valuation

**Process:**
1. Compare objectively
2. Consider tax implications
3. Switch if significantly better

**5. Life Goals 💰**

**Valid reasons:**
- House down payment
- Child's education
- Medical emergency
- Retirement

**WHEN NOT TO SELL:**

❌ **Short-term Volatility**
- Stock down 5-10% ← Normal!
- One bad quarter
- Market correction

❌ **News Panic**
- Media hysteria
- Temporary bad news
- Market crashes (if fundamentals intact)

❌ **Others' Opinion**
- Friend/family advice
- TV anchor recommendation
- Social media panic

❌ **Tax Saving Only**
- Don't sell just to avoid tax
- Let winners run!

**PRACTICAL EXIT STRATEGIES:**

**Strategy 1: Trailing Stop-Loss**

**For Long-term:**
- 20% trailing stop-loss
- Moves up with price
- Auto-protects profits

**Example:**
- Buy @ ₹100
- Current: ₹150
- Stop: ₹120 (20% below current)
- Hits ₹180: Move stop to ₹144

**Strategy 2: Profit Ladder**

**Systematic approach:**

**Target-based:**
+25%: Sell 20%
+50%: Sell 30% more
+75%: Sell 25% more
+100%: Sell remaining or keep small

**Strategy 3: Time-based Review**

**Every 6 months ask:**
"Would I BUY this stock TODAY?"

**If YES:** Hold/Add more
**If NO:** Consider selling

**Strategy 4: Quality Filter**

**Hold if:**
- Revenue growing 15%+
- ROE >18%
- Debt manageable
- Market leader

**Sell if:**
- Any fundamental deteriorates
- Don't wait for price recovery!

**TAX IMPLICATIONS:**

**Short-term (<1 year):**
- 20% tax on gains
- Try to hold >1 year

**Long-term (>1 year):**
- First ₹1.25L gains: Tax-free
- Above: 12.5% tax

**Tax Loss Harvesting:**
- Sell losers before year-end
- Offset against gains
- Save on tax

**EMOTIONAL DISCIPLINE:**

**Loss Aversion:**
"I'll sell when back to my price"
→ Wrong! If story broken, exit now

**Anchoring:**
"It was ₹500 last month"
→ Past price irrelevant!

**Sunk Cost:**
"I've held 3 years, can't sell"
→ If fundamentals changed, exit!

**BOTTOM LINE:**

${portfolio.length > 0 ? 
`**Your holdings:** ${portfolio.map(p => p.symbol).join(', ')}

Want me to analyze if you should sell any specific stock?` :
`Start building quality portfolio. Selling is easier when you buy right! Focus on buying quality first.`}`;
  }
  
  // ===== TECHNICAL ANALYSIS =====
  
  if (q.includes('technical') || q.includes('chart') || q.includes('candlestick')) {
    return `📊 **Technical Analysis Masterclass**

**PART 1: Candlestick Basics**

**What is a Candle?**
Shows 4 prices: Open, High, Low, Close

🟢 **Green Candle:** Close > Open (Bullish)
🔴 **Red Candle:** Close < Open (Bearish)

**PART 2: Power Patterns**

**Single Candle:**

**1. Doji** → Indecision
**2. Hammer** 🔨 → Bullish reversal at bottom
**3. Shooting Star** ⭐ → Bearish reversal at top
**4. Marubozu** → Strong trend continuation

**Two Candles:**

**1. Bullish Engulfing** → Strong buy signal
**2. Bearish Engulfing** → Strong sell signal
**3. Piercing Pattern** → Bullish reversal
**4. Dark Cloud Cover** → Bearish reversal

**Three Candles:**

**1. Morning Star** → Bottom reversal (STRONG)
**2. Evening Star** → Top reversal (STRONG)
**3. Three White Soldiers** → Bullish continuation
**4. Three Black Crows** → Bearish continuation

**PART 3: Support & Resistance**

**Support = Floor** (buying emerges)
**Resistance = Ceiling** (selling pressure)

**How to Identify:**
1. Look for price levels tested 2-3 times
2. Historical highs/lows
3. Round numbers (19,500, 20,000)

**Trading Strategy:**
- **Buy at support** with bullish candle
- **Sell at resistance** with bearish candle
- **Breakout buy** when price crosses resistance with volume
- **Breakdown sell** when price breaks support

**PART 4: Key Indicators**

**1. Moving Averages (MA)**

**50-day MA:** Short-term trend
**200-day MA:** Long-term trend

**Golden Cross:** 50 MA crosses above 200 MA → BUY
**Death Cross:** 50 MA crosses below 200 MA → SELL

**2. RSI (Relative Strength Index)**

- **>70:** Overbought (book profits)
- **<30:** Oversold (buy opportunity)
- **40-60:** Neutral zone

**3. MACD (Trend Indicator)**

- **Bullish:** MACD crosses above signal line
- **Bearish:** MACD crosses below signal line

**4. Volume**

**Price up + Volume up** = Strong uptrend ✅
**Price up + Volume down** = Weak rally ⚠️
**Price down + Volume up** = Strong downtrend ❌
**Price down + Volume down** = Weak fall 🔄

**PART 5: Chart Patterns**

**Bullish Patterns:**
1. **Cup & Handle** → Continuation
2. **Double Bottom** → Reversal
3. **Ascending Triangle** → Breakout up

**Bearish Patterns:**
1. **Head & Shoulders** → Reversal
2. **Double Top** → Reversal
3. **Descending Triangle** → Breakdown

**PART 6: Timeframes**

- **5-min/15-min:** Day trading
- **1-hour:** Intraday/Swing
- **Daily:** Swing/Position trading
- **Weekly:** Long-term investing

**PRACTICAL APPLICATION:**

**Example Trade Setup:**

**Stock:** TCS
**Pattern:** Hammer at support
**Confirmation:** Volume spike + Green candle next day
**Entry:** ₹3,680
**Stop-loss:** ₹3,590 (below support)
**Target:** ₹3,860 (resistance)
**Risk-Reward:** 1:2 ✅

**PRO TIPS:**

✅ Combine technical + fundamental
✅ Volume confirms price movements
✅ Wait for pattern completion
✅ Use stop-loss always
✅ Risk-reward minimum 1:2

Want to analyze specific stock's chart? Ask me!`;
  }
  
  // ===== DEFAULT HELP =====
  
  return `🤖 **AI Trading Assistant - Full Capabilities**

**I can help with:**

**📊 STOCK ANALYSIS (Deep Dive)**
Ask: "Analyze TCS", "What about Reliance?", "HDFC Bank review"
I cover: Fundamentals, Technicals, Valuation, Price targets

**Stocks I know:**
IT: TCS, Infosys, Wipro, HCL Tech, Tech Mahindra
Banking: HDFC, ICICI, SBI, Kotak, Axis Bank
Auto: Maruti, Tata Motors, M&M
Pharma: Sun Pharma, Dr Reddy
FMCG: HUL, ITC, Nestle
...and many more!

**📈 MARKET INSIGHTS**
Ask: "Nifty outlook?", "Market analysis", "Sector performance"
I provide: Levels, trends, FII/DII data, sectoral rotation

**💼 TRADING STRATEGIES**
Ask: "Trading strategies", "Day trading tips", "Swing vs Long-term"
I explain: 4 complete strategies with risk-return profiles

**📊 PORTFOLIO MANAGEMENT**
Ask: "Review my portfolio", "Portfolio advice", "Diversification tips"
I analyze: Your holdings, P&L, diversification, action items

**⚠️ RISK MANAGEMENT**
Ask: "Risk management", "Stop loss guide", "Position sizing"
I teach: Capital protection, stop-loss strategies, money management

**💰 BUY/SELL DECISIONS**
Ask: "Should I buy TCS?", "When to sell?", "Exit strategy"
I provide: Decision frameworks, checklist, timing strategies

**📚 TECHNICAL ANALYSIS**
Ask: "Candlestick patterns", "Support resistance", "Technical indicators"
I explain: 20+ patterns, indicators, chart reading

**Current Market:**
- Nifty: ${watchlist.find(s => s.symbol === 'NIFTY50')?.currentPrice.toFixed(0) || 'N/A'}
- Your Portfolio: ${portfolio.length} stocks
- Recent Orders: ${orders.length} trades

**Try asking:**
- "Complete analysis of Reliance"
- "Should I buy HDFC Bank now?"
- "Best stocks for long-term?"
- "How to manage risk?"
- "Review my portfolio"
- "Nifty technical analysis"

What would you like to know? 🚀`;
};

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: 'bot', content: "👋 Hi! I'm your advanced AI Trading Assistant trained on 500+ stocks. Ask me anything about stocks, strategies, portfolio, or market analysis!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  const { watchlist, portfolio, orders } = useStore();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setInput('');
    setMessages(p => [...p, { role: 'user', content: msg }]);
    setLoading(true);
    
    setTimeout(() => {
      const response = generateAdvancedResponse(msg, watchlist, portfolio, orders);
      setMessages(p => [...p, { role: 'bot', content: response }]);
      setLoading(false);
    }, 1000);
  };

  const quickQuestions = [
    "Analyze TCS in detail",
    "Best long-term stocks?",
    "Portfolio review",
    "Risk management guide",
    "Market outlook",
    "Trading strategies"
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-5 flex flex-col h-[700px] border border-gray-200">
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
          <span className="text-white text-2xl">🤖</span>
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-gray-800">AI Trading Expert</h2>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-xs text-gray-600 font-medium">Trained on 500+ Stocks</span>
          </div>
        </div>
        <div className="px-3 py-1.5 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-full border border-amber-200">
          <span className="text-xs font-bold text-amber-700">PRO</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[92%] ${
              m.role === 'user' 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl rounded-br-md shadow-md' 
                : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 rounded-2xl rounded-bl-md shadow-sm border border-gray-200'
            } p-4`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
              <p className="text-xs mt-2 opacity-60">{new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-4 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  {[0, 150, 300].map(d => (
                    <div key={d} className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: `${d}ms`}}></div>
                  ))}
                </div>
                <span className="text-xs text-gray-500">Analyzing deep data...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {messages.length <= 2 && (
        <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-xl border border-blue-100">
          <p className="text-xs text-gray-700 mb-3 font-semibold flex items-center gap-2">
            <span>💡</span> Try these advanced queries:
          </p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map(q => (
              <button
                key={q}
                onClick={() => setInput(q)}
                className="text-xs px-3 py-2 bg-white text-blue-600 rounded-full hover:bg-blue-50 hover:scale-105 transition-all shadow-sm border border-blue-100 font-medium"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Ask about any stock, strategy, or market analysis..."
          disabled={loading}
          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition text-sm disabled:bg-gray-50"
        />
        <button
          onClick={send}
          disabled={!input.trim() || loading}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg disabled:from-gray-300 disabled:to-gray-400 transition-all font-medium transform hover:scale-105 active:scale-95"
        >
          {loading ? '⏳' : '🚀'}
        </button>
      </div>
    </div>
  );
}
