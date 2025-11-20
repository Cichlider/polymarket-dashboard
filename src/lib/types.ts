// src/lib/types.ts

export interface Market {
  id: string;
  question: string;
  conditionId: string; 
  state: 'Open' | 'Closed' | 'Resolved';
  volume: number; // 总交易量
  category: string;
  end_date: string;
  outcomes: Outcome[]; 
}

export interface Outcome {
  id: string;
  title: string; // 'Yes', 'No', or 'Option C'
  price: number; // 当前价格 (0 到 1, 对应 0% 到 100%)
  volume: number;
}

export interface PriceHistory {
  timestamp: string;
  price: number;
}