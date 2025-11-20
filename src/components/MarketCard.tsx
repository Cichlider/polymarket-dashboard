// src/components/MarketCard.tsx
import { Market } from '@/lib/types';
import Link from 'next/link';

interface MarketCardProps {
  market: Market;
}

export default function MarketCard({ market }: MarketCardProps) {
  const highestPriceOutcome = market.outcomes.reduce((prev, current) => 
    (prev.price > current.price ? prev : current)
  );
  
  const pricePercent = (highestPriceOutcome.price * 100).toFixed(0);
  const otherPricePercent = ((1 - highestPriceOutcome.price) * 100).toFixed(0);
  
  const volumeFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(market.volume);

  // 【关键修正】：对 ID 进行编码，并修正为正确的路由路径
  const marketIdEncoded = encodeURIComponent(market.id); 

  return (
    <Link href={`/markets/details?id=${marketIdEncoded}`} className="block h-full">
      <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border border-gray-100 flex flex-col h-full">
        <div className="flex justify-between items-start mb-3">
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            {market.category || '未分类'}
          </span>
          <span className="text-sm text-gray-500">
            Volume: {volumeFormatted}
          </span>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 mb-4 line-clamp-2 flex-grow">
          {market.question}
        </h2>

        <div className="bg-gray-50 p-4 rounded-lg mt-auto">
          <div className="flex justify-between items-center mb-1">
            <span className="font-bold text-lg text-green-700">
              {highestPriceOutcome.title}
            </span>
            <span className="text-2xl font-extrabold text-green-700">
              {pricePercent}%
            </span>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>{highestPriceOutcome.title === 'Yes' ? 'No' : 'Other'}</span>
            <span>{otherPricePercent}%</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-1 mt-3">
            <div 
              className="bg-green-500 h-1 rounded-full" 
              style={{ width: `${pricePercent}%` }}
            ></div>
          </div>
        </div>
      </div>
    </Link>
  );
}