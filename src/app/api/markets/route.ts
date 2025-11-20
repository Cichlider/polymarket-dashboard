import { NextResponse } from 'next/server';
import axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';

// ⚠️ 确保端口正确 (ClashX 默认 7890)
const PROXY_URL = 'http://127.0.0.1:7897';

export async function GET() {
  try {
    console.log(`[API] Attempting to connect via proxy: ${PROXY_URL}`);
    
    const agent = new HttpsProxyAgent(PROXY_URL);

    const response = await axios.get('https://gamma-api.polymarket.com/events', {
      params: {
        limit: 50,
        active: 'true',
        closed: 'false',
        order: 'volume24hr',
        ascending: 'false'
      },
      // Axios 必须显式指定 httpsAgent 才能走代理
      httpsAgent: agent,
      // 加上 httpAgent 以防万一
      httpAgent: agent,
      // 设置超时时间 15秒
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Origin': 'https://polymarket.com'
      }
    });

    console.log(`[API] Success! Fetched ${response.data.length} items.`);
    return NextResponse.json(response.data);

  } catch (error: any) {
    console.error('[API] Proxy Error:', error.message);
    
    // 如果是连接错误，提供更具体的建议
    let tip = 'Unknown error';
    if (error.code === 'ECONNRESET' || error.code === 'ECONNREFUSED') {
      tip = `Could not connect to proxy at ${PROXY_URL}. Please check if your VPN is ON and the port is correct.`;
    }

    return NextResponse.json({ 
      error: 'Failed to fetch data', 
      details: error.message,
      tip: tip
    }, { status: 500 });
  }
}
