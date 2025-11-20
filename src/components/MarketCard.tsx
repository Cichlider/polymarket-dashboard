import { format } from 'date-fns';

interface MarketCardProps {
  data: any;
}

export default function MarketCard({ data }: MarketCardProps) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-slate-500 transition-colors">
      <div className="flex items-start gap-4 mb-4">
        {/* 使用标准 img 标签替代 next/image 以避免域名白名单导致的 500 错误 */}
        {data.image ? (
          <img 
            src={data.image} 
            alt="icon" 
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 bg-slate-600 rounded-full" />
        )}
        <h3 className="font-semibold text-lg leading-tight line-clamp-2">
          {data.question}
        </h3>
      </div>

      <div className="space-y-2 mb-4">
        {data.outcomes.map((outcome: string, idx: number) => {
          const price = parseFloat(data.outcomePrices[idx] || '0');
          const percentage = Math.round(price * 100);
          
          return (
            <div key={idx} className="flex justify-between items-center text-sm">
              <span className="text-slate-300">{outcome}</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500" 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="font-mono font-bold w-8 text-right">{percentage}%</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between text-xs text-slate-400 border-t border-slate-700 pt-3">
        <span>Vol: ${(data.volume || 0).toLocaleString()}</span>
        <span>Ends: {data.endDate ? format(new Date(data.endDate), 'MMM d, yyyy') : 'N/A'}</span>
      </div>
    </div>
  );
}
