import { motion } from 'framer-motion';
import { Loader2, AlertCircle } from 'lucide-react';
import AdminLayout from '../components/admin/AdminLayout';
import SubmissionFilters from '../components/admin/SubmissionFilters';
import SubmissionTable from '../components/admin/SubmissionTable';
import type { Submission } from '../data/adminMockData';
import { formatDocumentType } from '../lib/documentTypes';
import { useSubmissions } from '../lib/useSubmissions';

const formatSubmittedAt = (isoDate: string) =>
  new Date(isoDate).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

const Submissions = () => {
  const { submissions, loading, error, viewDocument, downloadDocument } = useSubmissions();

  const rows: Submission[] = submissions.map((submission) => ({
    id: submission.id,
    teacher: submission.teacher_name,
    documentType: formatDocumentType(submission.document_type),
    submitted: formatSubmittedAt(submission.created_at),
    status: submission.status === 'REVIEWED' ? 'Reviewed' : 'Pending',
    filename: submission.original_file_name,
  }));

  return (
    <AdminLayout title="Submissions" subtitle="Teacher Document Portal">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-semibold text-[#0F172A] mb-2">
              Submissions
            </h1>
            <p className="text-[#475569]">
              Review and manage documents submitted by teachers.
            </p>
          </div>
          <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-[#0F172A] hover:bg-slate-50 transition-colors duration-200">
            Export
          </button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <SubmissionFilters />
      </motion.div>

      {/* Submission Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {error && (
          <div className="flex items-start space-x-2 p-4 mb-6 rounded-xl border border-red-200 bg-red-50">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-16 bg-white rounded-xl border border-slate-200">
            <Loader2 className="w-6 h-6 text-[#2563EB] animate-spin" />
          </div>
        ) : rows.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-xl border border-slate-200">
            <p className="text-[#475569]">No submissions yet.</p>
          </div>
        ) : (
          <SubmissionTable
            submissions={rows}
            onView={viewDocument}
            onDownload={downloadDocument}
          />
        )}
      </motion.div>
    </AdminLayout>
  );
};

export default Submissions;
