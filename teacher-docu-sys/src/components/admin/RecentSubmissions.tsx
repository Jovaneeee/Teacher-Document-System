import { motion } from 'framer-motion';

interface RecentSubmissionsProps {
  submissions: any[];
  onRefresh?: () => void;
}

const RecentSubmissions = ({ submissions, onRefresh }: RecentSubmissionsProps) => {
  const getStatusBadge = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    if (normalizedStatus === 'pending') {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
          Pending
        </span>
      );
    }
    if (normalizedStatus === 'rejected') {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
          Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
        Reviewed
      </span>
    );
  };

  const handleView = async (id: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/submissions/${id}/view`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success && data.url) {
        window.open(data.url, '_blank');
        if (onRefresh) onRefresh();
      }
    } catch (error) {
      console.error('Error viewing document:', error);
    }
  };

  const formatDocumentType = (type: string) => {
    if (type === 'OBAS') return 'OBAS';
    if (type === 'TRAVEL_AUTHORITY') return 'Travel Authority (TO)';
    if (type === 'FORM_6') return 'Form 6 — Leave';
    return type;
  };

  if (submissions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white rounded-xl border border-slate-200 p-6"
      >
        <p className="text-sm text-[#64748B] text-center">No submissions yet</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-white rounded-xl border border-slate-200 overflow-hidden"
    >
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-[#0F172A]">
          Recent Submissions
        </h2>
      </div>

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
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {submissions.map((submission, index) => (
              <motion.tr
                key={submission.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                className="hover:bg-slate-50 transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-[#0F172A]">
                    {submission.teacher}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-[#475569]">
                    {formatDocumentType(submission.documentType)}
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
                  <button
                    onClick={() => handleView(submission.id)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View
                  </button>
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
            transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
            className="p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-[#0F172A]">
                  {submission.teacher}
                </p>
                <p className="text-sm text-[#475569] mt-1">
                  {formatDocumentType(submission.documentType)}
                </p>
              </div>
              {getStatusBadge(submission.status)}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#64748B]">
                {submission.submitted}
              </p>
              <button
                onClick={() => handleView(submission.id)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                View
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecentSubmissions;
