import { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';
import { generateOHLCData } from '../../utils/dummyData';

export default function CandlestickChart({ selectedStock }) {
  const chartContainerRef = useRef();
  const chartRef = useRef();
  const seriesRef = useRef();
  const dataRef = useRef([]);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    chartRef.current = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#ffffff' },
        textColor: '#333'
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      grid: {
        vertLines: { color: '#f0f0f0' },
        horzLines: { color: '#f0f0f0' }
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false
      }
    });

    seriesRef.current = chartRef.current.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderUpColor: '#22c55e',
      borderDownColor: '#ef4444',
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444'
    });

    dataRef.current = generateOHLCData(90);
    seriesRef.current.setData(dataRef.current);
    chartRef.current.timeScale().fitContent();

    // Auto-update last candle
    const interval = setInterval(() => {
      const data = dataRef.current;
      const lastCandle = data[data.length - 1];
      const change = (Math.random() - 0.5) * 20;
      const newClose = lastCandle.close + change;
      const updatedCandle = {
        ...lastCandle,
        close: parseFloat(newClose.toFixed(2)),
        high: Math.max(lastCandle.high, newClose),
        low: Math.min(lastCandle.low, newClose)
      };
      seriesRef.current.update(updatedCandle);
    }, 2000);

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth
        });
      }
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
      chartRef.current.remove();
    };
  }, []);

  useEffect(() => {
    if (selectedStock && seriesRef.current) {
      dataRef.current = generateOHLCData(90);
      seriesRef.current.setData(dataRef.current);
      chartRef.current.timeScale().fitContent();
    }
  }, [selectedStock?.symbol]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 border-2 border-gray-200">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        {selectedStock?.symbol || 'Select Stock'} - Live Chart
      </h2>
      <div ref={chartContainerRef} className="relative" />
    </div>
  );
}
