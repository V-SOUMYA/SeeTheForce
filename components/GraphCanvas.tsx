
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';
import { PhysicsData } from '../types';

interface GraphCanvasProps {
  data: NonNullable<PhysicsData['graph']>;
}

const GraphCanvas: React.FC<GraphCanvasProps> = ({ data }) => {
  return (
    <div className="w-full h-full min-h-[400px] bg-[#213448] rounded-xl border border-[#547792] p-4 flex flex-col">
       <div className="flex justify-between items-center mb-6">
        <span className="px-3 py-1 bg-[#547792] rounded-full text-xs font-bold text-[#EAE0CF] uppercase tracking-wider">Graph View</span>
        <h3 className="text-sm text-[#94B4C1] font-medium">{data.type.replace(/_/g, ' ').toUpperCase()}</h3>
      </div>
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.points} margin={{ top: 20, right: 30, left: 30, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#54779233" />
            <XAxis 
              dataKey="time" 
              stroke="#547792" 
              tick={{ fontSize: 11, fill: '#94B4C1' }}
              type="number"
              domain={['dataMin', 'dataMax']}
            >
              <Label 
                value={data.x_label} 
                offset={-20} 
                position="insideBottom" 
                fill="#EAE0CF" 
                style={{ fontSize: '13px', fontWeight: 'bold' }} 
              />
            </XAxis>
            <YAxis 
              stroke="#547792" 
              tick={{ fontSize: 11, fill: '#94B4C1' }}
            >
              <Label 
                value={data.y_label} 
                angle={-90} 
                position="insideLeft" 
                offset={10}
                fill="#EAE0CF" 
                style={{ fontSize: '13px', fontWeight: 'bold', textAnchor: 'middle' }} 
              />
            </YAxis>
            <Tooltip 
              contentStyle={{ backgroundColor: '#213448', border: '1px solid #547792', borderRadius: '8px', color: '#EAE0CF' }}
              itemStyle={{ color: '#94B4C1' }}
              cursor={{ stroke: '#94B4C1', strokeWidth: 1 }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#94B4C1" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#547792', stroke: '#EAE0CF', strokeWidth: 2 }}
              activeDot={{ r: 8, fill: '#EAE0CF', stroke: '#94B4C1' }}
              animationDuration={2000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GraphCanvas;
