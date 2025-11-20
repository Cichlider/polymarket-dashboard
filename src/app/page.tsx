'use client';

import { useState, useEffect, useMemo } from 'react';
import { getTopMarkets } from '@/lib/api';
import MarketCard from '@/components/MarketCard';
import LoginModal from '@/components/LoginModal';
import { Search, Menu, User, Globe, ChevronDown, X } from 'lucide-react';

const CATEGORIES = ["All", "New", "Politics", "Sports", "Crypto", "Business", "Science", "Pop Culture"];

export default function Home() {
  const [markets, setMarkets] = useState<any[]>([]);
  const [votes, setVotes] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [user, setUser] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);

  // 初始化：加载数据和用户状态
  useEffect(() => {
    const savedUser = localStorage.getItem('poly_user');
    if (savedUser) setUser(savedUser);
    else setShowLogin(true);

    fetchData();
    fetchVotes();
    
    // 轮询投票数据
    const interval = setInterval(fetchVotes, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const data = await getTopMarkets();
      setMarkets(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVotes = async () => {
    try {
      const res = await fetch('/api/vote');
      if (res.ok) {
        setVotes(await res.json());
      }
    } catch (e) { console.error(e); }
  };

  const handleLogin = (username: string) => {
    localStorage.setItem('poly_user', username);
    setUser(username);
    setShowLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('poly_user');
    setUser(null);
  };

  const handleVote = async (marketId: string, outcome: string) => {
    // 乐观更新 UI
    setVotes((prev: any) => {
      const newVotes = { ...prev };
      if (!newVotes[marketId]) newVotes[marketId] = {};
      if (!newVotes[marketId][outcome]) newVotes[marketId][outcome] = 0;
      newVotes[marketId][outcome] += 1;
      return newVotes;
    });

    // 发送请求
    await fetch('/api/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ marketId, outcome })
    });
  };

  const filteredMarkets = useMemo(() => {
    return markets.filter(m => {
      const matchesSearch = m.question.toLowerCase().includes(search.toLowerCase());
      let matchesCategory = true;
      if (category !== 'All') {
        if (category === 'New') return true; // 简化处理
        const content = (m.question + ' ' + m.id).toLowerCase();
        // 简单的关键词匹配
        const keywords: any = {
          Politics: ['trump', 'biden', 'election', 'president', 'senate'],
          Sports: ['nba', 'football', 'soccer', 'game', 'cup'],
          Crypto: ['bitcoin', 'eth', 'token', 'price', 'nft'],
          Business: ['fed', 'stock', 'market', 'rate', 'company'],
          Science: ['space', 'nasa', 'covid', 'climate']
        };
        const keys = keywords[category] || [];
        if (keys.length) {
          matchesCategory = keys.some((k: string) => content.includes(k));
        }
      }
      return matchesSearch && matchesCategory;
    });
  }, [markets, search, category]);

  return (
    <main className="min-h-screen bg-[#0f172a] text-white font-sans">
      {/* Login Modal */}
      {!user && showLogin && <LoginModal onLogin={handleLogin} />}

      {/* Top Navigation Bar */}
      <nav className="border-b border-slate-800 bg-[#0f172a] sticky top-0 z-20">
        <div className="max-w-[1400px] mx-auto px-4 h-[60px] flex items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
            <div className="w-8 h-8 border border-white rounded-md flex items-center justify-center">
              <div className="w-4 h-4 bg-blue-500 rotate-45"></div>
            </div>
            <span className="text-xl font-bold tracking-tight hidden md:block">Polymarket</span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text"
              placeholder="Search markets"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#1e293b] border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Right Actions */}
          <div className="ml-auto flex items-center gap-4 text-sm font-medium">
            <div className="hidden lg:flex items-center gap-6 text-slate-300">
              <span className="hover:text-white cursor-pointer">How it works</span>
              <span className="hover:text-white cursor-pointer">Leaderboard</span>
            </div>
            
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <span className="text-slate-200">{user}</span>
                  <span className="text-[10px] text-green-400">Verified Human</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="bg-slate-800 hover:bg-slate-700 p-2 rounded-lg border border-slate-700"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setShowLogin(true)} className="text-white hover:text-blue-400">Log In</button>
                <button onClick={() => setShowLogin(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg">Sign Up</button>
              </div>
            )}
            <Menu className="md:hidden w-6 h-6" />
          </div>
        </div>

        {/* Secondary Navigation (Categories) */}
        <div className="border-t border-slate-800 bg-[#0f172a]">
          <div className="max-w-[1400px] mx-auto px-4 flex items-center gap-1 overflow-x-auto py-2 no-scrollbar text-sm">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors font-medium ${
                  category === cat 
                    ? 'text-white bg-slate-800' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8">
        {/* Banner / Filters (Visual Only) */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4 text-lg font-bold text-white">
            <div className="flex items-center gap-2 cursor-pointer border-b-2 border-white pb-1">
              <Globe className="w-5 h-5" />
              Trending
            </div>
            <div className="text-slate-500 cursor-pointer hover:text-slate-300 transition-colors">New</div>
            <div className="text-slate-500 cursor-pointer hover:text-slate-300 transition-colors">Ending Soon</div>
          </div>
          
          <div className="flex items-center gap-2">
             <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm flex items-center gap-2 cursor-pointer hover:bg-slate-700">
               <span className="w-2 h-2 bg-green-500 rounded-full"></span>
               Live
               <ChevronDown className="w-4 h-4 text-slate-400" />
             </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
             {[...Array(8)].map((_, i) => (
              <div key={i} className="h-[220px] bg-slate-800/50 rounded-xl animate-pulse border border-slate-700/50" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredMarkets.map((market: any) => (
              <div key={market.id} className="h-[240px]">
                <MarketCard 
                  data={market} 
                  user={user}
                  votes={votes[market.id]}
                  onVote={handleVote}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
