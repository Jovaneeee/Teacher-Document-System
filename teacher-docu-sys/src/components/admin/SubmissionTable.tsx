import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, Clock, CheckCircle, ArrowUpRight, ArrowDown } from 'lucide-react';
import type { Submission } from '../../data/adminMockData';

interface SubmissionTableProps {
  submissions: Submission[];
  onView?: (id: string) => void;
  onDownload?: (id: string) => void;
}

const SubmissionTable = ({ submissions, onView, onDownload }: SubmissionTableProps) => {
  const viewClassName =
    'inline-flex items-center space-x-1 text-sm font-medium text-[#2563EB] hover:underline';
  const downloadClassName =
    'inline-flex items-center space-x-1 text-sm font-medium text-green-600 hover:underline';

  const renderViewAction = (id: string) =>
    onView ? (
      <button type="button" onClick={() => onView(id)} className={viewClassName}>
        <span>View</span>
        <ArrowUpRight className="w-4 h-4" />
      </button>
    ) : (
      <Link to="/admin/documents" className={viewClassName}>
        <span>View</span>
        <ArrowUpRight className="w-4 h-4" />
      </Link>
    );

  const renderDownloadAction = (id: string) =>
    onDownload ? (
      <button type="button" onClick={() => onDownload(id)} className={downloadClassName}>
        <span>Download</span>
        <ArrowDown className="w-4 h-4" />
      </button>
    ) : (
      <Link to="/admin/documents" className={downloadClassName}>
        <span>Download</span>
        <ArrowDown className="w-4 h-4" />
      </Link>
    );

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
                Teacher
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                Document Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                Submitted
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                File
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {submissions.map((submission, index) => (
              <motion.tr
                key={submission.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="hover:bg-slate-50 transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-[#0F172A]">
                    {submission.teacher}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-[#475569]">
                    {submission.documentType}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-[#475569]">
                    {submission.submitted}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(submission.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-[#64748B]" />
                    <span className="text-sm text-[#475569]">
                      {submission.filename}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  {renderViewAction(submission.id)}
                  {renderDownloadAction(submission.id)}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-slate-200">
        {submissions.map((submission, index) => (
          <motion.div
            key={submission.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-[#0F172A]">
                  {submission.teacher}
                </p>
                <p className="text-sm text-[#475569] mt-1">
                  {submission.documentType}
                </p>
              </div>
              {getStatusBadge(submission.status)}
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <FileText className="w-4 h-4 text-[#64748B]" />
              <span className="text-sm text-[#475569]">
                {submission.filename}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#64748B]">{submission.submitted}</p>
              <div className="flex items-center space-x-4">
                {renderViewAction(submission.id)}
                {renderDownloadAction(submission.id)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SubmissionTable;
