// src/lib/polymarket-data.ts
import { Market, PriceHistory } from './types';
import { MOCK_MARKETS, MOCK_HISTORY } from './mock-data';

// 注意：API_URL 和 GraphQL 查询已被注释，使用 Mock Data 替代

/**
 * 返回所有活跃市场数据 (使用 Mock Data)
 */
export async function fetchAllMarkets(): Promise<Market[]> {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500)); 
  return MOCK_MARKETS;
}

/**
 * 获取单个市场详情和历史价格 (使用 Mock Data)
 */
export async function fetchMarketDetails(marketId: string | undefined): Promise<{ market: Market | null, history: PriceHistory[] }> {
    await new Promise(resolve => setTimeout(resolve, 300));

    if (!marketId) {
        return { market: null, history: [] };
    }

    const market = MOCK_MARKETS.find(m => m.id === marketId) || null;
    
    // 如果是我们的模拟 ETF 市场，返回模拟历史数据
    const history = marketId.includes('bitcoin-etf') ? MOCK_HISTORY : [];
    
    return { market, history };
}