import { motion } from 'framer-motion';
import AdminLayout from '../components/admin/AdminLayout';
import SubmissionFilters from '../components/admin/SubmissionFilters';
import SubmissionTable from '../components/admin/SubmissionTable';
import { allSubmissions } from '../data/adminMockData';

const Submissions = () => {
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
        <SubmissionTable submissions={allSubmissions} />
      </motion.div>
    </AdminLayout>
  );
};

export default Submissions;
