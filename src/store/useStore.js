import { create } from 'zustand';
import { INDIAN_STOCKS, generateDummyPrice } from '../utils/dummyData';

const useStore = create((set, get) => ({
  // Authentication
  isAuthenticated: localStorage.getItem('loggedIn') === 'true',
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  
  login: (email, password) => {
    const user = { email, name: email.split('@')[0] };
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(user));
    set({ isAuthenticated: true, user });
  },
  
  signup: (email, password, name) => {
    const user = { email, name };
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(user));
    set({ isAuthenticated: true, user });
  },
  
  logout: () => {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('user');
    set({ isAuthenticated: false, user: null });
  },
  
  // Watchlist
  watchlist: INDIAN_STOCKS.map(stock => ({
    ...stock,
    currentPrice: stock.basePrice,
    previousPrice: stock.basePrice,
    change: 0,
    changePercent: 0
  })),
  
  updateWatchlist: () => {
    set(state => ({
      watchlist: state.watchlist.map(stock => {
        const newPrice = generateDummyPrice(stock.basePrice);
        const change = newPrice - stock.currentPrice;
        const changePercent = (change / stock.currentPrice) * 100;
        
        return {
          ...stock,
          previousPrice: stock.currentPrice,
          currentPrice: newPrice,
          change,
          changePercent
        };
      })
    }));
  },
  
  // Orders
  orders: [],
  
  placeOrder: (order) => {
    const newOrder = {
      ...order,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      status: 'executed'
    };
    set(state => ({ orders: [newOrder, ...state.orders] }));
    
    // Update portfolio
    get().updatePortfolio(order);
  },
  
  // Portfolio
  portfolio: JSON.parse(localStorage.getItem('portfolio') || '[]'),
  
  updatePortfolio: (order) => {
    set(state => {
      const portfolio = [...state.portfolio];
      const existingIndex = portfolio.findIndex(p => p.symbol === order.symbol);
      
      if (order.type === 'buy') {
        if (existingIndex >= 0) {
          const existing = portfolio[existingIndex];
          const totalQty = existing.quantity + order.quantity;
          const avgPrice = ((existing.avgPrice * existing.quantity) + 
                          (order.price * order.quantity)) / totalQty;
          
          portfolio[existingIndex] = {
            ...existing,
            quantity: totalQty,
            avgPrice
          };
        } else {
          portfolio.push({
            symbol: order.symbol,
            name: order.name,
            quantity: order.quantity,
            avgPrice: order.price
          });
        }
      } else if (order.type === 'sell' && existingIndex >= 0) {
        const existing = portfolio[existingIndex];
        const newQty = existing.quantity - order.quantity;
        
        if (newQty <= 0) {
          portfolio.splice(existingIndex, 1);
        } else {
          portfolio[existingIndex].quantity = newQty;
        }
      }
      
      localStorage.setItem('portfolio', JSON.stringify(portfolio));
      return { portfolio };
    });
  }
}));

export default useStore;
