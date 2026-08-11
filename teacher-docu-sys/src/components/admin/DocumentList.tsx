import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, Clock, CheckCircle, ArrowUpRight, ArrowDown } from 'lucide-react';
import type { DocumentRecord } from '../../data/adminMockData';

interface DocumentListProps {
  documents: DocumentRecord[];
}

const DocumentList = ({ documents }: DocumentListProps) => {
  const getStatusBadge = (status: string) => {
    if (status === 'Pending') {
      return (
        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
          <Clock className="w-3 h-3" />
          <span>Pending</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
        <CheckCircle className="w-3 h-3" />
        <span>Reviewed</span>
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                Document
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                Teacher
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                Submitted
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {documents.map((document, index) => (
              <motion.tr
                key={document.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="hover:bg-slate-50 transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-[#64748B]" />
                    <span className="text-sm font-medium text-[#0F172A]">
                      {document.filename}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-[#475569]">
                    {document.teacher}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-[#475569]">
                    {document.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-[#475569]">
                    {document.submitted}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(document.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <Link
                    to="/admin/submissions"
                    className="inline-flex items-center space-x-1 text-sm font-medium text-[#2563EB] hover:underline"
                  >
                    <span>View</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                  <Link
                to="/admin/documents"
                className="inline-flex items-center space-x-1 text-sm font-medium text-green-600 hover:underline"
              >
                <span>Download</span>
                <ArrowDown className="w-4 h-4" />
              </Link>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-slate-200">
        {documents.map((document, index) => (
          <motion.div
            key={document.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="p-4"
          >
            <div className="flex items-center space-x-2 mb-3">
              <FileText className="w-4 h-4 text-[#64748B]" />
              <span className="text-sm font-medium text-[#0F172A]">
                {document.filename}
              </span>
            </div>
            <div className="space-y-2 mb-3">
              <div className="flex justify-between">
                <span className="text-xs text-[#64748B]">Teacher</span>
                <span className="text-sm text-[#475569]">{document.teacher}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-[#64748B]">Type</span>
                <span className="text-sm text-[#475569]">{document.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-[#64748B]">Submitted</span>
                <span className="text-sm text-[#475569]">{document.submitted}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              {getStatusBadge(document.status)}
              <Link
                to="/admin/submissions"
                className="inline-flex items-center space-x-1 text-sm font-medium text-[#2563EB] hover:underline"
              >
                <span>View</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DocumentList;
