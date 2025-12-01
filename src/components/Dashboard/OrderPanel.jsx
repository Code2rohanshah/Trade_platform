import { useState } from 'react';
import useStore from '../../store/useStore';

export default function OrderPanel() {
  const { selectedStock, placeOrder, portfolio } = useStore();
  const [orderType, setOrderType] = useState('buy');
  const [quantity, setQuantity] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderAnimation, setOrderAnimation] = useState(false);

  const stock = selectedStock;
  const holding = portfolio.find(p => p.symbol === stock?.symbol);
  const maxSellQty = holding?.quantity || 0;

  const handlePlaceOrder = () => {
    if (!stock) return;

    const order = {
      symbol: stock.symbol,
      name: stock.name,
      type: orderType,
      quantity: parseInt(quantity),
      price: stock.currentPrice,
      timestamp: new Date().toISOString()
    };

    // Trigger animation
    setOrderAnimation(true);
    
    setTimeout(() => {
      placeOrder(order);
      setShowConfirm(false);
      setOrderSuccess(true);
      setQuantity(1);
      
      // Reset success message
      setTimeout(() => {
        setOrderSuccess(false);
        setOrderAnimation(false);
      }, 3000);
    }, 800);
  };

  const totalValue = stock ? stock.currentPrice * quantity : 0;

  return (
    <div className="bg-white rounded-lg shadow-lg p-5 border border-gray-200 relative overflow-hidden">
      {/* Success Animation Overlay */}
      {orderSuccess && (
        <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 z-50 flex items-center justify-center animate-fade-in">
          <div className="text-center text-white animate-scale-in">
            <div className="text-6xl mb-3">✅</div>
            <h3 className="text-2xl font-bold mb-2">Order Placed!</h3>
            <p className="text-lg">{orderType === 'buy' ? 'Bought' : 'Sold'} {quantity} {stock?.symbol}</p>
            <p className="text-sm mt-2 opacity-90">Check your portfolio</p>
          </div>
        </div>
      )}

      {/* Processing Animation */}
      {orderAnimation && !orderSuccess && (
        <div className="absolute inset-0 bg-white/95 z-40 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-700 font-medium">Processing order...</p>
          </div>
        </div>
      )}

      <h2 className="text-xl font-bold mb-4 text-gray-800">Place Order</h2>

      {/* Buy/Sell Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setOrderType('buy')}
          className={`flex-1 py-3 rounded-lg font-semibold transition-all transform ${
            orderType === 'buy'
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg scale-105'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <span className="text-lg">📈</span> BUY
        </button>
        <button
          onClick={() => setOrderType('sell')}
          disabled={!holding || holding.quantity === 0}
          className={`flex-1 py-3 rounded-lg font-semibold transition-all transform ${
            orderType === 'sell'
              ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg scale-105'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed'
          }`}
        >
          <span className="text-lg">📉</span> SELL
        </button>
      </div>

      {/* Stock Selection */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Stock</label>
        <div className={`p-4 rounded-lg border-2 transition-all ${
          stock ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-300'
        }`}>
          {stock ? (
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-lg text-gray-800">{stock.symbol}</span>
                <span className={`text-lg font-bold ${stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{stock.currentPrice.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-gray-600">{stock.name}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className={`text-sm font-medium ${stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stock.changePercent >= 0 ? '▲' : '▼'} {Math.abs(stock.changePercent).toFixed(2)}%
                </span>
                {holding && (
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                    Holding: {holding.quantity} shares
                  </span>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center">← Select from watchlist</p>
          )}
        </div>
      </div>

      {/* Quantity Input */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Quantity {orderType === 'sell' && holding && `(Max: ${maxSellQty})`}
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-gray-700 transition"
          >
            −
          </button>
          <input
            type="number"
            min="1"
            max={orderType === 'sell' ? maxSellQty : 1000}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="flex-1 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          <button
            onClick={() => setQuantity(quantity + 1)}
            disabled={orderType === 'sell' && quantity >= maxSellQty}
            className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>
        {orderType === 'sell' && quantity > maxSellQty && (
          <p className="text-xs text-red-600 mt-1">Cannot sell more than you own!</p>
        )}
      </div>

      {/* Order Summary */}
      {stock && (
        <div className="mb-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Price per share</span>
            <span className="font-semibold">₹{stock.currentPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Quantity</span>
            <span className="font-semibold">{quantity}</span>
          </div>
          <div className="border-t border-gray-300 pt-2 mt-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-800">Total Value</span>
              <span className="font-bold text-xl text-blue-600">₹{totalValue.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Place Order Button */}
      <button
        onClick={() => setShowConfirm(true)}
        disabled={!stock || (orderType === 'sell' && (!holding || quantity > maxSellQty))}
        className={`w-full py-4 rounded-lg font-bold text-lg transition-all transform ${
          stock && (orderType === 'buy' || (holding && quantity <= maxSellQty))
            ? orderType === 'buy'
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
              : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {stock ? `${orderType === 'buy' ? '🛒 Place Buy Order' : '💰 Place Sell Order'}` : 'Select Stock First'}
      </button>

      {/* Confirmation Modal */}
      {showConfirm && stock && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-slide-up">
            <div className={`text-center mb-4 p-4 rounded-xl ${
              orderType === 'buy' ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <div className="text-5xl mb-2">{orderType === 'buy' ? '📈' : '📉'}</div>
              <h3 className="text-2xl font-bold text-gray-800">Confirm {orderType === 'buy' ? 'Purchase' : 'Sale'}</h3>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Action</span>
                <span className={`font-bold uppercase ${orderType === 'buy' ? 'text-green-600' : 'text-red-600'}`}>
                  {orderType}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Stock</span>
                <span className="font-bold">{stock.symbol}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Quantity</span>
                <span className="font-bold">{quantity} shares</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Price</span>
                <span className="font-bold">₹{stock.currentPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border-2 border-blue-300">
                <span className="font-bold text-gray-800">Total Amount</span>
                <span className="font-bold text-xl text-blue-600">₹{totalValue.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handlePlaceOrder}
                className={`flex-1 py-3 rounded-xl font-semibold text-white transition shadow-lg hover:shadow-xl transform hover:scale-105 ${
                  orderType === 'buy'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                    : 'bg-gradient-to-r from-red-500 to-rose-600'
                }`}
              >
                Confirm {orderType === 'buy' ? 'Buy' : 'Sell'}
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
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes scale-in {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
