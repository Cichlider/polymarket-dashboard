// src/app/markets/details/page.tsx
"use client";

import { fetchMarketDetails } from '@/lib/polymarket-data';
import PriceChart from '@/components/PriceChart';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Market, PriceHistory } from '@/lib/types'; 

export default function MarketDetailPage() {
  const searchParams = useSearchParams();
  const rawMarketId = searchParams.get('id'); 

  const [marketData, setMarketData] = useState<{ market: Market | null, history: PriceHistory[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 解码 ID
  let marketId = "";
  if (rawMarketId) {
    try {
      marketId = decodeURIComponent(rawMarketId);
    } catch (e) {
      console.error("Failed to decode market ID:", e);
      marketId = rawMarketId;
    }
  }

  // 使用 useEffect 在客户端获取数据
  useEffect(() => {
    if (!marketId) {
        setIsLoading(false);
        return;
    }
    
    fetchMarketDetails(marketId).then(data => {
      setMarketData(data);
      setIsLoading(false);
    });

  }, [marketId]);

  // --- 渲染逻辑 ---

  if (isLoading) {
      return <div className="container mx-auto px-4 py-16 text-center text-xl font-medium">数据加载中...</div>;
  }

  const market = marketData?.market;
  const history = marketData?.history || [];

  // 市场不存在处理
  if (!market) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">404 - 市场未找到</h1>
        <p className="text-gray-600">无法加载 ID 为 "{marketId}" 的市场数据。</p>
        <Link href="/markets" className="mt-4 inline-block text-blue-600 hover:underline">
          返回市场概览
        </Link>
      </div>
    );
  }

  // 格式化交易量
  const volumeFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(market.volume);

  const highestPriceOutcome = market.outcomes.reduce((prev, current) => 
    (prev.price > current.price ? prev : current)
  );
  
  return (
    <main className="container mx-auto px-4 py-8 bg-white">
      {/* 头部信息 */}
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{market.question}</h1>
      <p className="text-lg text-gray-600 mb-6 border-b pb-4">
        类别: <span className="font-semibold">{market.category || 'N/A'}</span> 
        &nbsp;|&nbsp; 
        总交易量: <span className="font-semibold text-green-600">{volumeFormatted}</span>
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左侧：图表区域 (2/3 宽度) */}
        <div className="lg:col-span-2 bg-gray-50 p-6 rounded-lg shadow-inner">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            {highestPriceOutcome.title} 赔率历史
          </h2>
          <PriceChart data={history} outcomeTitle={highestPriceOutcome.title} /> 

          <p className="mt-4 text-sm text-gray-500">
            图表展示了该选项的历史交易价格（0.00 到 1.00，对应 0% 到 100%）。
          </p>
        </div>

        {/* 右侧：市场选项和详情 (1/3 宽度) */}
        <div className="lg:col-span-1">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">当前赔率</h2>
          <div className="space-y-4">
            {market.outcomes.map(outcome => (
              <div key={outcome.id} className="bg-white p-4 border border-gray-200 rounded-lg shadow">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-lg text-gray-700">{outcome.title}</span>
                  <span className={`text-3xl font-extrabold ${outcome.price > 0.5 ? 'text-green-600' : 'text-red-600'}`}>
                    {(outcome.price * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="h-2 rounded-full" 
                    style={{ 
                      width: `${(outcome.price * 100).toFixed(1)}%`,
                      backgroundColor: outcome.price > 0.5 ? '#10B981' : '#EF4444' 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}