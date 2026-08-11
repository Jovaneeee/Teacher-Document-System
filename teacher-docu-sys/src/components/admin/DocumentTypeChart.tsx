import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { DocumentType } from '../../data/adminMockData';

interface DocumentTypeChartProps {
  data: DocumentType[];
  total: number;
}

const DocumentTypeChart = ({ data, total }: DocumentTypeChartProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-xl border border-slate-200 p-6"
    >
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[#0F172A]">
          Documents by Type
        </h2>
        <p className="text-sm text-[#64748B]">
          Distribution of submitted document types
        </p>
      </div>
      <div className="relative h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="count"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F2A43',
                border: 'none',
                borderRadius: '8px',
                padding: '12px',
              }}
              itemStyle={{ color: '#FFFFFF' }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center Content */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="text-3xl font-bold text-[#0F172A]">{total}</p>
          <p className="text-xs text-[#64748B]">Total</p>
        </div>
      </div>
      {/* Legend */}
      <div className="mt-6 space-y-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-[#475569]">{item.name}</span>
            </div>
            <span className="text-sm font-medium text-[#0F172A]">
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default DocumentTypeChart;
