import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Skill } from '../types';

interface SkillChartProps {
  skills: Skill[];
  limit?: number;
}

export const SkillChart: React.FC<SkillChartProps> = ({ skills, limit = 7 }) => {
  // Sort by score
  const sortedData = [...skills].sort((a, b) => b.confidenceScore - a.confidenceScore);
  
  // Slice data if limit is positive, otherwise show all
  const data = limit > 0 ? sortedData.slice(0, limit) : sortedData;

  // Dynamic height calculation: 50px per item if showing all, otherwise fixed 300px
  const height = limit > 0 ? 300 : Math.max(300, data.length * 50);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-card border border-dark-border p-3 rounded shadow-lg text-white z-50">
          <p className="font-bold">{label}</p>
          <p className="text-neon-green">Confidence: {payload[0].value}%</p>
          <p className="text-xs text-gray-400 mt-1 max-w-[200px]">{payload[0].payload.evidence}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ height: `${height}px` }} className="w-full transition-all duration-500 ease-in-out">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" />
          <YAxis 
            type="category" 
            dataKey="name" 
            stroke="#f8fafc" 
            width={100}
            tick={{fontSize: 12}}
          />
          <Tooltip content={<CustomTooltip />} cursor={{fill: '#334155', opacity: 0.4}} />
          <Bar dataKey="confidenceScore" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.confidenceScore > 80 ? '#00D186' : entry.confidenceScore > 50 ? '#FACC15' : '#F87171'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};