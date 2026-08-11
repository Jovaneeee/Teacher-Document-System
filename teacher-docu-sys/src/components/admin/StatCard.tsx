import { motion } from 'framer-motion';
import { Files, Clock, CircleCheck, TrendingUp } from 'lucide-react';
import type { DashboardStat } from '../../data/adminMockData';

interface StatCardProps {
  stat: DashboardStat;
  delay?: number;
}

const iconMap = {
  Files,
  Clock,
  CircleCheck,
  TrendingUp,
};

const StatCard = ({ stat, delay = 0 }: StatCardProps) => {
  const Icon = iconMap[stat.icon as keyof typeof iconMap];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-sm transition-shadow duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-lg bg-[#EFF6FF]">
          {Icon && <Icon className="w-5 h-5 text-[#2563EB]" />}
        </div>
      </div>
      <p className="text-sm font-medium text-[#64748B] mb-1">{stat.label}</p>
      <p className="text-3xl lg:text-4xl font-bold text-[#0F172A] mb-1">
        {stat.value}
      </p>
      <p className="text-sm text-[#475569]">{stat.description}</p>
    </motion.div>
  );
};

export default StatCard;
