import { motion } from 'framer-motion';

interface AdminStatCardProps {
  value: string | number;
  label: string;
  description: string;
  delay?: number;
}

const AdminStatCard = ({
  value,
  label,
  description,
  delay = 0,
}: AdminStatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-sm transition-shadow duration-200"
    >
      <p className="text-sm font-medium text-[#64748B] mb-2">{label}</p>
      <p className="text-3xl lg:text-4xl font-bold text-[#0F172A] mb-1">
        {value}
      </p>
      <p className="text-sm text-[#475569]">{description}</p>
    </motion.div>
  );
};

export default AdminStatCard;
