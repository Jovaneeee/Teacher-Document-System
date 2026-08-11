import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import AdminLayout from '../components/admin/AdminLayout';
import DocumentCategoryCard from '../components/admin/DocumentCategoryCard';
import DocumentList from '../components/admin/DocumentList';
import { documentCategories, documentRecords } from '../data/adminMockData';

const Documents = () => {
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
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Document Type Filter */}
            <div>
              <select className="px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent text-sm bg-white">
                <option>Document Type</option>
                <option>OBAS</option>
                <option>Travel Authority (TO)</option>
                <option>Form 6 — Leave</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <select className="px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent text-sm bg-white">
                <option>Newest first</option>
                <option>Oldest first</option>
              </select>
            </div>
          </div>
        </div>

        {/* Document List */}
        <DocumentList documents={documentRecords} />
      </motion.div>
    </AdminLayout>
  );
};

export default Documents;
