import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import StatCard from '../components/admin/StatCard';
import SubmissionActivityChart from '../components/admin/SubmissionActivityChart';
import DocumentTypeChart from '../components/admin/DocumentTypeChart';
import RecentSubmissions from '../components/admin/RecentSubmissions';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard = () => {
  useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setDashboardData(data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const dashboardStats = dashboardData ? [
    {
      value: dashboardData.stats.total,
      label: 'Total Submissions',
      description: 'All submitted documents',
      icon: 'Files',
    },
    {
      value: dashboardData.stats.pending,
      label: 'Pending Review',
      description: 'Awaiting administrative review',
      icon: 'Clock',
    },
    {
      value: dashboardData.stats.reviewed,
      label: 'Reviewed',
      description: 'Processed submissions',
      icon: 'CircleCheck',
    },
    {
      value: dashboardData.stats.rejected,
      label: 'Rejected',
      description: 'Rejected submissions',
      icon: 'CircleX',
    },
  ] : [];

  const documentTypeData = dashboardData ? [
    { name: 'OBAS', count: dashboardData.typeCounts.OBAS, color: '#2563EB' },
    { name: 'Travel Authority', count: dashboardData.typeCounts.TRAVEL_AUTHORITY, color: '#0F2A43' },
    { name: 'Form 6 — Leave', count: dashboardData.typeCounts.FORM_6, color: '#64748B' },
  ] : [];

  const totalDocuments = documentTypeData.reduce((acc, item) => acc + item.count, 0);

  const recentSubmissions = dashboardData?.recentSubmissions || [];

  if (loading) {
    return (
      <AdminLayout title="Overview" subtitle="HRIS Document Approval System">
        <div className="flex items-center justify-center h-64">
          <div className="text-[#64748B]">Loading dashboard...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Overview" subtitle="HRIS Document Approval System">
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
          <SubmissionActivityChart data={documentTypeData} />
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
        <RecentSubmissions submissions={recentSubmissions} onRefresh={fetchDashboardData} />
      </motion.div>
    </AdminLayout>
  );
};

export default AdminDashboard;