import { Search } from 'lucide-react';

const SubmissionFilters = () => {
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
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <select className="px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent text-sm bg-white">
            <option>All Status</option>
            <option>Pending</option>
            <option>Reviewed</option>
          </select>
        </div>

        {/* Document Type Filter */}
        <div>
          <select className="px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent text-sm bg-white">
            <option>All Documents</option>
            <option>OBAS</option>
            <option>Travel Authority (TO)</option>
            <option>Form 6 — Leave</option>
          </select>
        </div>

        {/* Date Filter */}
        <div>
          <select className="px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent text-sm bg-white">
            <option>All Time</option>
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SubmissionFilters;
