// src/lib/mock-data.ts
import { Market, PriceHistory } from './types';

export const MOCK_MARKETS: Market[] = [
  {
    id: '0x1234...bitcoin-etf',
    question: 'Will a Bitcoin Spot ETF be approved by the SEC before Jan 1, 2026?',
    conditionId: '0x1234',
    state: 'Open',
    volume: 1850000,
    category: 'Crypto',
    end_date: new Date(Date.now() + 86400 * 30 * 1000).toISOString(),
    outcomes: [
      { id: 'yes', title: 'Yes', price: 0.78, volume: 1500000 },
      { id: 'no', title: 'No', price: 0.22, volume: 350000 },
    ],
  },
  {
    id: '0x5678...election',
    question: 'Will the incumbent party win the next US Presidential Election?',
    conditionId: '0x5678',
    state: 'Open',
    volume: 345000,
    category: 'Politics',
    end_date: new Date(Date.now() + 86400 * 60 * 1000).toISOString(),
    outcomes: [
      { id: 'win', title: 'Yes, will win', price: 0.55, volume: 190000 },
      { id: 'lose', title: 'No, will lose', price: 0.45, volume: 155000 },
    ],
  },
];

export const MOCK_HISTORY: PriceHistory[] = [
    { timestamp: new Date(Date.now() - 86400 * 30 * 1000).toISOString(), price: 0.50 },
    { timestamp: new Date(Date.now() - 86400 * 20 * 1000).toISOString(), price: 0.65 },
    { timestamp: new Date(Date.now() - 86400 * 10 * 1000).toISOString(), price: 0.75 },
    { timestamp: new Date().toISOString(), price: 0.78 },
];