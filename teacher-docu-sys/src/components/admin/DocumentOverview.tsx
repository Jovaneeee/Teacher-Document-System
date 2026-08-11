import { motion } from 'framer-motion';

interface DocumentType {
  name: string;
  count: number;
  total: number;
}

interface DocumentOverviewProps {
  documentTypes: DocumentType[];
}

const DocumentOverview = ({ documentTypes }: DocumentOverviewProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white rounded-xl border border-slate-200 p-6"
    >
      <h2 className="text-lg font-semibold text-[#0F172A] mb-6">
        Document Overview
      </h2>
      <div className="space-y-6">
        {documentTypes.map((doc, index) => {
          const percentage = (doc.count / doc.total) * 100;

          return (
            <div key={doc.name}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[#0F172A]">
                  {doc.name}
                </span>
                <span className="text-sm text-[#64748B]">
                  {doc.count} submissions
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                  className="bg-[#2563EB] h-2 rounded-full"
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default DocumentOverview;
