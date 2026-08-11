import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { SubmissionActivity } from '../../data/adminMockData';

interface SubmissionActivityChartProps {
  data: SubmissionActivity[];
}

const SubmissionActivityChart = ({ data }: SubmissionActivityChartProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-xl border border-slate-200 p-6"
    >
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[#0F172A]">
          Submission Activity
        </h2>
        <p className="text-sm text-[#64748B]">
          Document submissions over the past six months
        </p>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E2E8F0"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748B', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748B', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F2A43',
                border: 'none',
                borderRadius: '8px',
                padding: '12px',
              }}
              itemStyle={{ color: '#FFFFFF' }}
            />
            <Bar
              dataKey="submissions"
              fill="#2563EB"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default SubmissionActivityChart;
