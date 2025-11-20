// src/app/markets/page.tsx
import { fetchAllMarkets } from '@/lib/polymarket-data';
import { Market } from '@/lib/types';
import MarketCard from '@/components/MarketCard';

export default async function MarketsPage() {
  const markets: Market[] = await fetchAllMarkets();

  return (
    <main className="container mx-auto px-4 py-8 bg-gray-50">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-4">
        📈 热门预测市场概览
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {markets.length > 0 ? (
          markets.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))
        ) : (
          <div className="col-span-full text-center py-10 bg-white rounded-lg shadow">
            <p className="text-xl text-red-500 font-medium mb-2">数据加载失败或市场未开放</p>
            <p className="text-gray-500">请检查 Mock Data 或网络连接。</p>
          </div>
        )}
      </div>
    </main>
  );
}