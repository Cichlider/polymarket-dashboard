export interface Market {
  id: string;
  question: string;
  image: string;
  endDate: string;
  volume: number;
  outcomes: string[]; 
  outcomePrices: string[]; 
}

function safeParse(data: any) {
  try {
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') {
      const cleaned = data.replace(/'/g, '"');
      return JSON.parse(cleaned);
    }
    return [];
  } catch (e) {
    return [];
  }
}

export async function getTopMarkets() {
  try {
    const res = await fetch('/api/markets', { 
      cache: 'no-store'
    });
    
    if (!res.ok) {
      // 获取详细的错误信息
      const errorData = await res.json().catch(() => ({}));
      console.error("Server responded with error:", res.status, errorData);
      throw new Error(errorData.details || 'Failed to fetch data');
    }
    
    const data = await res.json();
    
    return data.map((event: any) => {
      const market = event.markets ? event.markets[0] : null;
      if (!market) return null;

      return {
        id: event.id,
        question: event.title,
        image: event.image,
        endDate: event.endDate,
        volume: event.volume,
        outcomes: safeParse(market.outcomes),
        outcomePrices: safeParse(market.outcomePrices)
      };
    }).filter(Boolean);
  } catch (error) {
    console.error('Client Fetch Error:', error);
    return [];
  }
}
