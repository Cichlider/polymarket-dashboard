// src/components/PriceChart.tsx
"use client";

import { PriceHistory } from '@/lib/types';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

interface PriceChartProps {
  data: PriceHistory[];
  outcomeTitle: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const date = new Date(label).toLocaleString('zh-CN', { 
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
    
    return (
      <div className="bg-white p-2 border border-gray-300 rounded shadow-md text-sm">
        <p className="font-semibold text-gray-800">{date}</p>
        <p className="text-green-600">
          赔率: {(payload[0].value * 100).toFixed(2)}%
        </p>
      </div>
    );
  }

  return null;
};

export default function PriceChart({ data, outcomeTitle }: PriceChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center bg-white border border-dashed border-gray-300 rounded">
        <p className="text-gray-500">😭 暂无 {outcomeTitle} 历史价格数据。</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={data}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={(value) => new Date(value).toLocaleDateString('zh-CN')}
          />
          
          <YAxis 
            domain={[0, 1]} 
            tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
            width={70}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#10B981" 
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}