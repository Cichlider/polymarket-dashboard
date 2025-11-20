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
      // 处理可能是 Python 风格的字符串列表 (如 "['Yes', 'No']")
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
    const res = await fetch('https://gamma-api.polymarket.com/events?limit=20&active=true&closed=false&order=volume24hr&ascending=false', { 
      cache: 'no-store'
    });
    
    if (!res.ok) throw new Error('Failed to fetch data');
    
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
    console.error('Polymarket API Error:', error);
    return [];
  }
}
