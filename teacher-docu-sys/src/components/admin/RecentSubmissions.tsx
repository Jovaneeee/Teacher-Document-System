import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

type SubmissionStatus = 'Pending' | 'Reviewed';

interface Submission {
  id: string;
  teacher: string;
  documentType: string;
  submitted: string;
  status: SubmissionStatus;
}

interface RecentSubmissionsProps {
  submissions: Submission[];
}

const RecentSubmissions = ({ submissions }: RecentSubmissionsProps) => {
  const getStatusBadge = (status: SubmissionStatus) => {
    if (status === 'Pending') {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
          Pending
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
        Reviewed
      </span>
    );
  };

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
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <Link
                    to={`/admin/submissions/${submission.id}`}
                    className="inline-flex items-center text-sm font-medium text-[#2563EB] hover:underline"
                  >
                    View
                  </Link>
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
                  {submission.documentType}
                </p>
              </div>
              {getStatusBadge(submission.status)}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#64748B]">
                {submission.submitted}
              </p>
              <Link
                to={`/admin/submissions/${submission.id}`}
                className="inline-flex items-center text-sm font-medium text-[#2563EB] hover:underline"
              >
                View
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecentSubmissions;
