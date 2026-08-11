import { motion } from 'framer-motion';
import { FileText, Plane, CalendarDays } from 'lucide-react';

interface DocumentCategoryCardProps {
  name: string;
  count: number;
  description: string;
  icon: string;
  delay?: number;
}

const iconMap = {
  FileText,
  Plane,
  CalendarDays,
};

const DocumentCategoryCard = ({
  name,
  count,
  description,
  icon,
  delay = 0,
}: DocumentCategoryCardProps) => {
  const Icon = iconMap[icon as keyof typeof iconMap];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-sm transition-shadow duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-lg bg-[#EFF6FF]">
          {Icon && <Icon className="w-6 h-6 text-[#2563EB]" />}
        </div>
      </div>
      <h3 className="text-xl font-semibold text-[#0F172A] mb-1">{name}</h3>
      <p className="text-3xl font-bold text-[#0F172A] mb-2">{count}</p>
      <p className="text-sm text-[#475569] mb-6">{description}</p>

    </motion.div>
  );
};

export default DocumentCategoryCard;
