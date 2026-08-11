import { motion } from 'framer-motion';
import AdminLayout from '../components/admin/AdminLayout';
import StatCard from '../components/admin/StatCard';
import SubmissionActivityChart from '../components/admin/SubmissionActivityChart';
import DocumentTypeChart from '../components/admin/DocumentTypeChart';
import RecentSubmissions from '../components/admin/RecentSubmissions';
import {
  dashboardStats,
  submissionActivityData,
  documentTypeData,
  recentSubmissions,
} from '../data/adminMockData';

const AdminDashboard = () => {
  const totalDocuments = documentTypeData.reduce((acc, item) => acc + item.count, 0);

  return (
    <AdminLayout title="Overview" subtitle="Teacher Document Portal">
      {/* Dashboard Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1">
              ADMINISTRATIVE WORKSPACE
            </p>
            <h1 className="text-2xl lg:text-3xl font-semibold text-[#0F172A] mb-2">
              Overview
            </h1>
            <p className="text-[#475569]">
              Monitor and manage teacher document submissions from one organized
              workspace.
            </p>
          </div>
          <div className="text-sm text-[#64748B]">August 2026</div>
        </div>
      </motion.div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        {dashboardStats.map((stat, index) => (
          <StatCard key={stat.label} stat={stat} delay={index * 0.1} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <SubmissionActivityChart data={submissionActivityData} />
        </div>
        <div>
          <DocumentTypeChart data={documentTypeData} total={totalDocuments} />
        </div>
      </div>

      {/* Recent Submissions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-[#0F172A]">
            Recent Submissions
          </h2>
          <p className="text-sm text-[#64748B]">
            Latest documents submitted by teachers.
          </p>
        </div>
        <RecentSubmissions submissions={recentSubmissions} />
      </motion.div>
    </AdminLayout>
  );
};

export default AdminDashboard;
