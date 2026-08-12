import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import AdminLayout from '../components/admin/AdminLayout';
import DocumentCategoryCard from '../components/admin/DocumentCategoryCard';
import DocumentList from '../components/admin/DocumentList';
import { documentCategories } from '../data/adminMockData';
import type { DocumentRecord } from '../data/adminMockData';
import { DOCUMENT_TYPE_LABELS, formatDocumentType } from '../lib/documentTypes';
import type { DocumentTypeValue } from '../lib/documentTypes';
import { useSubmissions } from '../lib/useSubmissions';

const formatSubmittedAt = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const Documents = () => {
  const { submissions, loading, error, viewDocument, downloadDocument } = useSubmissions();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  const categories = useMemo(
    () =>
      documentCategories.map((category) => {
        const type = (Object.keys(DOCUMENT_TYPE_LABELS) as DocumentTypeValue[]).find(
          (key) => DOCUMENT_TYPE_LABELS[key] === category.name
        );

        return {
          ...category,
          count: submissions.filter((submission) => submission.document_type === type).length,
        };
      }),
    [submissions]
  );

  const documents: DocumentRecord[] = useMemo(() => {
    const term = search.trim().toLowerCase();

    return submissions
      .filter((submission) => !typeFilter || submission.document_type === typeFilter)
      .filter(
        (submission) =>
          !term ||
          submission.teacher_name.toLowerCase().includes(term) ||
          submission.original_file_name.toLowerCase().includes(term)
      )
      .sort((a, b) => {
        const diff = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        return sortOrder === 'oldest' ? diff : -diff;
      })
      .map((submission) => ({
        id: submission.id,
        filename: submission.original_file_name,
        teacher: submission.teacher_name,
        type: formatDocumentType(submission.document_type),
        submitted: formatSubmittedAt(submission.created_at),
        status: submission.status === 'REVIEWED' ? 'Reviewed' : 'Pending',
      }));
  }, [submissions, search, typeFilter, sortOrder]);

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
        {categories.map((category, index) => (
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
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search filename or teacher..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Document Type Filter */}
            <div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent text-sm bg-white"
              >
                <option value="">Document Type</option>
                <option value="OBAS">OBAS</option>
                <option value="TRAVEL_AUTHORITY">Travel Authority (TO)</option>
                <option value="FORM_6">Form 6 — Leave</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent text-sm bg-white"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-start space-x-2 p-4 mb-6 rounded-xl border border-red-200 bg-red-50">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        {/* Document List */}
        {loading ? (
          <div className="flex items-center justify-center py-16 bg-white rounded-xl border border-slate-200">
            <Loader2 className="w-6 h-6 text-[#2563EB] animate-spin" />
          </div>
        ) : documents.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-xl border border-slate-200">
            <p className="text-[#475569]">No documents found.</p>
          </div>
        ) : (
          <DocumentList
            documents={documents}
            onView={viewDocument}
            onDownload={downloadDocument}
          />
        )}
      </motion.div>
    </AdminLayout>
  );
};

export default Documents;
