'use client';

import { useState, useEffect } from 'react';
import { getTopMarkets } from '@/lib/api';
import MarketCard from '@/components/MarketCard';

export default function Home() {
  const [markets, setMarkets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTopMarkets();
        setMarkets(data);
      } catch (error) {
        console.error("Failed to fetch markets", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="min-h-screen p-8 max-w-7xl mx-auto">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            PolyMirror
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time Data • Client Side Mode
          </p>
        </div>
        <div className="text-right text-xs text-slate-500">
          API: Gamma-Polymarket
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {markets.map((market: any) => (
            <MarketCard key={market.id} data={market} />
          ))}
        </div>
      )}
    </main>
  );
}
