import { Search, Bell, User } from 'lucide-react';

interface AdminTopbarProps {
  title: string;
  subtitle?: string;
}

const AdminTopbar = ({ title, subtitle }: AdminTopbarProps) => {
  return (
    <header className="h-16 lg:h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8">
      {/* Left - Page Title */}
      <div className="flex-1">
        <h1 className="text-xl lg:text-2xl font-semibold text-[#0F172A]">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-[#64748B]">{subtitle}</p>
        )}
      </div>

      {/* Right - Actions */}
      <div className="flex items-center space-x-2 lg:space-x-4">
        {/* Search */}
        <button
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
          aria-label="Search"
        >
          <Search className="w-5 h-5 text-[#64748B]" />
        </button>

        {/* Notifications */}
        <button
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200 relative"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-[#64748B]" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center border border-slate-200">
          <User className="w-5 h-5 text-[#2563EB]" />
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
