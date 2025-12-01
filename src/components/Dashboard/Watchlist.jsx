import { useEffect } from 'react';
import useStore from '../../store/useStore';

export default function Watchlist({ onSelectStock }) {
  const { watchlist, updateWatchlist } = useStore();

  useEffect(() => {
    const interval = setInterval(updateWatchlist, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4">Watchlist</h2>
      <div className="space-y-2">
        {watchlist.map((stock) => (
          <div
            key={stock.symbol}
            onClick={() => onSelectStock(stock)}
            className={`p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-all duration-200 ${
              stock.change > 0 ? 'bg-green-50' : stock.change < 0 ? 'bg-red-50' : ''
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-800">{stock.symbol}</p>
                <p className="text-xs text-gray-500">{stock.name}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">₹{stock.currentPrice.toFixed(2)}</p>
                <p className={`text-sm ${stock.change >= 0 ? 'text-success' : 'text-danger'}`}>
                  {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
