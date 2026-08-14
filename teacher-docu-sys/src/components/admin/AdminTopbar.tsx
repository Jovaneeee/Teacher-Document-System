import { Search, Bell, User, FileText, ArrowUpRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface AdminTopbarProps {
  title: string;
  subtitle?: string;
  recentSubmissions?: any[];
}

const formatDocumentType = (type: string) => {
  if (type === 'OBAS') return 'OBAS';
  if (type === 'TRAVEL_AUTHORITY') return 'Travel Authority (TO)';
  if (type === 'FORM_6') return 'Form 6 — Leave';
  return type;
};

const AdminTopbar = ({ title, subtitle, recentSubmissions = [] }: AdminTopbarProps) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const notificationCount = recentSubmissions.length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const handleNotificationClick = () => {
    navigate('/admin/submissions');
    setShowNotifications(false);
  };

  const handleViewAll = () => {
    navigate('/admin/submissions');
    setShowNotifications(false);
  };

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
        <div className="relative">
          <button
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200 relative"
            aria-label="Notifications"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="w-5 h-5 text-[#64748B]" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-xs font-medium rounded-full px-1">
                {notificationCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div ref={dropdownRef} className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-xl border border-slate-200 shadow-lg z-50">
              <div className="p-4 border-b border-slate-200">
                <h3 className="text-sm font-semibold text-[#0F172A]">Notifications</h3>
              </div>
              
              {recentSubmissions.length === 0 ? (
                <div className="p-4 text-sm text-[#64748B] text-center">
                  No recent submissions
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto">
                  {recentSubmissions.map((submission) => (
                    <button
                      key={submission.id}
                      onClick={handleNotificationClick}
                      className="w-full p-4 hover:bg-slate-50 transition-colors duration-200 text-left border-b border-slate-100 last:border-b-0"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-[#2563EB]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#0F172A] truncate">
                            New Document Submitted
                          </p>
                          <p className="text-xs text-[#475569] mt-0.5">
                            {formatDocumentType(submission.documentType)}
                          </p>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-[#64748B] flex-shrink-0" />
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {recentSubmissions.length > 0 && (
                <div className="p-3 border-t border-slate-200">
                  <button
                    onClick={handleViewAll}
                    className="w-full text-sm font-medium text-[#2563EB] hover:text-[#1d4ed8] transition-colors duration-200 py-2"
                  >
                    View All Submissions
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center border border-slate-200">
          <User className="w-5 h-5 text-[#2563EB]" />
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
