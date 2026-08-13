import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import DocumentCategoryCard from '../components/admin/DocumentCategoryCard';
import DocumentList from '../components/admin/DocumentList';

const Documents = () => {
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<any[]>([]);
  const [typeCounts, setTypeCounts] = useState({ OBAS: 0, TRAVEL_AUTHORITY: 0, FORM_6: 0 });
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    documentType: 'all',
    dateRange: 'all'
  });

  useEffect(() => {
    fetchDocuments();
  }, [filters]);

  const fetchDocuments = async () => {
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
        setDocuments(data.data);
        // Calculate type counts from unfiltered data for category cards
        const counts = data.data.reduce((acc: any, doc: any) => {
          if (doc.type === 'OBAS') acc.OBAS++;
          if (doc.type === 'TRAVEL_AUTHORITY') acc.TRAVEL_AUTHORITY++;
          if (doc.type === 'FORM_6') acc.FORM_6++;
          return acc;
        }, { OBAS: 0, TRAVEL_AUTHORITY: 0, FORM_6: 0 });
        setTypeCounts(counts);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const documentCategories = [
    {
      name: 'OBAS',
      count: typeCounts.OBAS,
      description: 'Official Business / related submissions',
      icon: 'FileText',
    },
    {
      name: 'Travel Authority (TO)',
      count: typeCounts.TRAVEL_AUTHORITY,
      description: 'Travel authority submissions',
      icon: 'Plane',
    },
    {
      name: 'Form 6 — Leave',
      count: typeCounts.FORM_6,
      description: 'Leave-related submissions',
      icon: 'CalendarDays',
    },
  ];

  if (loading) {
    return (
      <AdminLayout title="Documents" subtitle="Teacher Document Portal">
        <div className="flex items-center justify-center h-64">
          <div className="text-[#64748B]">Loading documents...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Documents" subtitle="Teacher Document Portal">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-2xl lg:text-3xl font-semibold text-[#0F172A] mb-2">
          Documents
        </h1>
        <p className="text-[#475569]">
          Browse submitted files organized by document type.
        </p>
      </motion.div>

      {/* Document Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {documentCategories.map((category, index) => (
          <DocumentCategoryCard
            key={category.name}
            name={category.name}
            count={category.count}
            description={category.description}
            icon={category.icon}
            delay={index * 0.1}
          />
        ))}
      </div>

      {/* All Documents Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-[#0F172A]">
            All Documents
          </h2>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                <input
                  type="text"
                  placeholder="Search filename or teacher..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent text-sm bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Document Type Filter */}
            <div>
              <select
                value={filters.documentType}
                onChange={(e) => setFilters({ ...filters, documentType: e.target.value })}
                className="px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent text-sm bg-white"
              >
                <option value="all">Document Type</option>
                <option value="OBAS">OBAS</option>
                <option value="TRAVEL_AUTHORITY">Travel Authority (TO)</option>
                <option value="FORM_6">Form 6 — Leave</option>
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                className="px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent text-sm bg-white"
              >
                <option value="all">All Time</option>
                <option value="this_month">This Month</option>
                <option value="last_month">Last Month</option>
                <option value="this_year">This Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Document List */}
        <DocumentList documents={documents} onRefresh={fetchDocuments} />
      </motion.div>
    </AdminLayout>
  );
};

export default Documents;
