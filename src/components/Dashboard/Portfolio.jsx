import { useState } from 'react';
import useStore from '../../store/useStore';

export default function OrderPanel({ selectedStock }) {
  const [orderType, setOrderType] = useState('market');
  const [action, setAction] = useState('buy');
  const [quantity, setQuantity] = useState(1);
  const [limitPrice, setLimitPrice] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const placeOrder = useStore(state => state.placeOrder);

  const handlePlaceOrder = () => {
    if (!selectedStock) return;

    const order = {
      symbol: selectedStock.symbol,
      name: selectedStock.name,
      type: action,
      orderType,
      quantity: parseInt(quantity),
      price: orderType === 'market' ? selectedStock.currentPrice : parseFloat(limitPrice)
    };

    placeOrder(order);
    setShowConfirm(false);
    setQuantity(1);
    setLimitPrice('');
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4">Place Order</h2>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => setAction('buy')}
            className={`flex-1 py-2 rounded-lg font-medium transition ${
              action === 'buy' ? 'bg-success text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => setAction('sell')}
            className={`flex-1 py-2 rounded-lg font-medium transition ${
              action === 'sell' ? 'bg-danger text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Sell
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Stock</label>
          <input
            type="text"
            value={selectedStock?.symbol || 'Select a stock'}
            disabled
            className="w-full px-3 py-2 border rounded-lg bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Order Type</label>
          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="market">Market Order</option>
            <option value="limit">Limit Order</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Quantity</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        {orderType === 'limit' && (
          <div>
            <label className="block text-sm font-medium mb-1">Limit Price</label>
            <input
              type="number"
              step="0.01"
              value={limitPrice}
              onChange={(e) => setLimitPrice(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        )}

        <button
          onClick={() => setShowConfirm(true)}
          disabled={!selectedStock}
          className={`w-full py-2 rounded-lg font-medium text-white transition ${
            action === 'buy' ? 'bg-success hover:bg-green-600' : 'bg-danger hover:bg-red-600'
          } disabled:bg-gray-300 disabled:cursor-not-allowed`}
        >
          {action === 'buy' ? 'Place Buy Order' : 'Place Sell Order'}
        </button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Confirm Order</h3>
            <div className="space-y-2 mb-6">
              <p><span className="font-medium">Action:</span> {action.toUpperCase()}</p>
              <p><span className="font-medium">Stock:</span> {selectedStock?.symbol}</p>
              <p><span className="font-medium">Quantity:</span> {quantity}</p>
              <p><span className="font-medium">Price:</span> ₹
                {orderType === 'market' ? selectedStock?.currentPrice.toFixed(2) : limitPrice}
              </p>
              <p><span className="font-medium">Total:</span> ₹
                {(quantity * (orderType === 'market' ? selectedStock?.currentPrice : parseFloat(limitPrice))).toFixed(2)}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePlaceOrder}
                className={`flex-1 py-2 rounded-lg text-white ${
                  action === 'buy' ? 'bg-success' : 'bg-danger'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
