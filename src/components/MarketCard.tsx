import { format } from 'date-fns';
import { ThumbsUp } from 'lucide-react';

interface MarketCardProps {
  data: any;
  votes?: Record<string, number>;
  onVote?: (marketId: string, outcome: string) => void;
  user?: string | null;
}

export default function MarketCard({ data, votes = {}, onVote, user }: MarketCardProps) {
  const marketUrl = `https://polymarket.com/event/${data.id}`;

  // 处理点击：如果是用户已登录且点击了按钮区域，则是投票；否则跳转官网
  const handleInteraction = (e: React.MouseEvent, outcome: string) => {
    if (user && onVote) {
      e.preventDefault();
      e.stopPropagation();
      onVote(data.id, outcome);
    }
  };

  return (
    <a 
      href={marketUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col justify-between bg-[#1e293b] border border-slate-700/50 hover:border-slate-600 rounded-xl p-4 transition-all h-full relative overflow-hidden"
    >
      {/* Header: Icon & Title */}
      <div className="flex items-start gap-3 mb-4">
        {data.image ? (
          <img src={data.image} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
        ) : (
          <div className="w-10 h-10 bg-slate-700 rounded-full shrink-0" />
        )}
        <h3 className="font-medium text-[15px] leading-snug text-slate-200 group-hover:text-blue-400 transition-colors line-clamp-3">
          {data.question}
        </h3>
      </div>

      {/* Outcomes List */}
      <div className="space-y-3 mt-auto">
        {data.outcomes.slice(0, 2).map((outcome: string, idx: number) => {
          const price = parseFloat(data.outcomePrices[idx] || '0');
          const percentage = Math.round(price * 100);
          const voteCount = votes[outcome] || 0;
          
          // 颜色逻辑: 通常第一个是 Yes (Green), 第二个是 No (Red)
          const isYes = idx === 0;
          const colorClass = isYes ? "text-[#22c55e]" : "text-[#ef4444]";
          const bgClass = isYes ? "bg-[#22c55e]/10 hover:bg-[#22c55e]/20" : "bg-[#ef4444]/10 hover:bg-[#ef4444]/20";
          
          return (
            <div key={idx} className="flex items-center justify-between gap-4">
              <span className="text-slate-400 text-sm font-medium truncate flex-1">{outcome}</span>
              
              <div className="flex items-center gap-2">
                {/* 社区投票数显示 */}
                {voteCount > 0 && (
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <ThumbsUp className="w-3 h-3" />
                    {voteCount}
                  </div>
                )}

                {/* 价格/投票按钮 */}
                <button
                  onClick={(e) => handleInteraction(e, outcome)}
                  className={`relative w-[88px] h-[34px] rounded-md font-bold text-sm flex items-center justify-center transition-colors ${bgClass} ${colorClass}`}
                >
                  {percentage}%
                  {user && <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer info */}
      <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-700/50 text-xs text-slate-500 font-mono">
        <span>${(data.volume || 0).toLocaleString()} Vol</span>
        {user && <span className="text-blue-400 ml-auto">Click % to Vote</span>}
      </div>
    </a>
  );
}
