import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import SubmissionFilters from '../components/admin/SubmissionFilters';
import SubmissionTable from '../components/admin/SubmissionTable';

const Submissions = () => {
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    documentType: 'all',
    dateRange: 'all'
  });

  useEffect(() => {
    fetchSubmissions();
  }, [filters]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const params = new URLSearchParams();
      if (filters.status !== 'all') params.append('status', filters.status);
      if (filters.documentType !== 'all') params.append('document_type', filters.documentType);
      if (filters.dateRange !== 'all') params.append('date_range', filters.dateRange);
      if (filters.search.trim()) params.append('search', filters.search.trim());

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/submissions?${params.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (data.success) {
        setSubmissions(data.data);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: {
    search: string;
    status: string;
    documentType: string;
    dateRange: string;
  }) => {
    setFilters(newFilters);
  };

  return (
    <AdminLayout title="Submissions" subtitle="HRIS Document Approval System">
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
        <SubmissionFilters onFiltersChange={handleFiltersChange} />
      </motion.div>

      {/* Submission Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {loading ? (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <p className="text-sm text-[#64748B] text-center">Loading submissions...</p>
          </div>
        ) : (
          <SubmissionTable submissions={submissions} onRefresh={fetchSubmissions} />
        )}
      </motion.div>
    </AdminLayout>
  );
};

export default Submissions;
