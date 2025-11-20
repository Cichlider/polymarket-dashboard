// src/app/markets/[slug]/page.tsx
import { fetchMarketDetails } from '@/lib/polymarket-data';
import PriceChart from '@/components/PriceChart';
import Link from 'next/link';

// 定义页面接收的动态参数类型
interface MarketDetailPageProps {
  params: {
    slug: string; // 市场 ID (编码后)
  };
}

export default async function MarketDetailPage({ params }: MarketDetailPageProps) {
  
  // 【关键修正】：解码接收到的 slug
  let marketId = params.slug;
  try {
    marketId = decodeURIComponent(params.slug);
  } catch (e) {
    // 如果解码失败，使用原始 slug
    console.error("Failed to decode market ID, using raw slug:", e);
  }

  // 1. 获取单个市场详情和历史数据
  const { market, history } = await fetchMarketDetails(marketId);

  // 2. 市场不存在处理
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

  // 找到赔率最高的选项（图表应该绘制这个选项的历史价格）
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
          
          {/* 3. 嵌入图表组件 */}
          {/* 确保 PriceChart.tsx 已经被创建并填充了代码 */}
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
                      backgroundColor: outcome.price > 0.5 ? '#10B981' : '#EF4444' // Tailwind 颜色
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