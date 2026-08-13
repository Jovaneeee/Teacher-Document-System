import { Search } from 'lucide-react';
import { useState } from 'react';

interface SubmissionFiltersProps {
  onFiltersChange: (filters: {
    search: string;
    status: string;
    documentType: string;
    dateRange: string;
  }) => void;
}

const SubmissionFilters = ({ onFiltersChange }: SubmissionFiltersProps) => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [documentType, setDocumentType] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onFiltersChange({ search: value, status, documentType, dateRange });
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    onFiltersChange({ search, status: value, documentType, dateRange });
  };

  const handleDocumentTypeChange = (value: string) => {
    setDocumentType(value);
    onFiltersChange({ search, status, documentType: value, dateRange });
  };

  const handleDateRangeChange = (value: string) => {
    setDateRange(value);
    onFiltersChange({ search, status, documentType, dateRange: value });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search by teacher or document..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
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
            value={documentType}
            onChange={(e) => handleDocumentTypeChange(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent text-sm bg-white"
          >
            <option value="all">All Documents</option>
            <option value="OBAS">OBAS</option>
            <option value="TRAVEL_AUTHORITY">Travel Authority (TO)</option>
            <option value="FORM_6">Form 6 — Leave</option>
          </select>
        </div>

        {/* Date Filter */}
        <div>
          <select
            value={dateRange}
            onChange={(e) => handleDateRangeChange(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent text-sm bg-white"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="this_week">This Week</option>
            <option value="this_month">This Month</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SubmissionFilters;
