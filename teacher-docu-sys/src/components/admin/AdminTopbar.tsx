import { Search, Bell, User, FileText, ArrowUpRight, LogOut, User as UserIcon, Trash2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

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
  const [showProfile, setShowProfile] = useState(false);
  const [localSubmissions, setLocalSubmissions] = useState<any[]>(recentSubmissions);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  // Update local submissions when prop changes
  useEffect(() => {
    setLocalSubmissions(recentSubmissions);
  }, [recentSubmissions]);

  // Count unread notifications (is_read = false AND is_notification_deleted = false)
  const notificationCount = localSubmissions.filter(
    (s) => !s.isRead && !s.isNotificationDeleted
  ).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    };

    if (showNotifications || showProfile) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications, showProfile]);

  const handleNotificationClick = async (submissionId: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      // Mark notification as read
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/submissions/${submissionId}/notification-read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Update local state
      setLocalSubmissions(prev =>
        prev.map(s =>
          s.id === submissionId ? { ...s, isRead: true } : s
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }

    navigate('/admin/submissions');
    setShowNotifications(false);
  };

  const handleViewAll = () => {
    navigate('/admin/submissions');
    setShowNotifications(false);
  };

  const handleDeleteNotification = async (e: React.MouseEvent, submissionId: string) => {
    e.stopPropagation(); // Prevent triggering notification click

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      // Delete notification (soft delete)
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/submissions/${submissionId}/notification-delete`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Remove from local state
      setLocalSubmissions(prev => prev.filter(s => s.id !== submissionId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
    setShowProfile(false);
  };

  const getUserInitials = () => {
    if (!user?.email) return 'U';
    const emailParts = user.email.split('@')[0];
    const parts = emailParts.split('.');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return emailParts.slice(0, 2).toUpperCase();
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
              
              {localSubmissions.length === 0 ? (
                <div className="p-4 text-sm text-[#64748B] text-center">
                  No recent submissions
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto">
                  {localSubmissions.map((submission) => (
                    <div
                      key={submission.id}
                      className={`w-full p-4 hover:bg-slate-50 transition-colors duration-200 text-left border-b border-slate-100 last:border-b-0 ${
                        !submission.isRead ? 'bg-slate-50' : 'bg-white'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <button
                          onClick={() => handleNotificationClick(submission.id)}
                          className="flex-1 flex items-start space-x-3 min-w-0"
                        >
                          <div className="w-8 h-8 rounded-full bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
                            <FileText className="w-4 h-4 text-[#2563EB]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#0F172A] truncate">
                              New Document Submitted
                            </p>
                            <p className="text-xs text-[#475569] mt-0.5">
                              {submission.teacher ? `${submission.teacher} • ` : ''}
                              {formatDocumentType(submission.documentType)}
                            </p>
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-[#64748B] flex-shrink-0" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteNotification(e, submission.id)}
                          className="p-1.5 rounded hover:bg-red-50 hover:text-red-500 transition-colors duration-200 flex-shrink-0"
                          aria-label="Delete notification"
                        >
                          <Trash2 className="w-4 h-4 text-[#64748B]" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {localSubmissions.length > 0 && (
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

        {/* Profile */}
        <div className="relative">
          <button
            className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center border border-slate-200 hover:bg-slate-100 transition-colors duration-200"
            aria-label="Profile"
            onClick={() => setShowProfile(!showProfile)}
          >
            <User className="w-5 h-5 text-[#2563EB]" />
          </button>

          {/* Profile Dropdown */}
          {showProfile && (
            <div ref={profileDropdownRef} className="absolute right-0 top-full mt-2 w-72 max-w-[calc(100vw-2rem)] bg-white rounded-xl border border-slate-200 shadow-lg z-50">
              {/* Profile Header */}
              <div className="p-6 border-b border-slate-200">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-[#EFF6FF] flex items-center justify-center border border-slate-200 mb-3">
                    <span className="text-xl font-semibold text-[#2563EB]">
                      {getUserInitials()}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-[#0F172A]">
                    {user?.email?.split('@')[0] || 'Administrator'}
                  </h3>
                  <p className="text-sm text-[#64748B] mt-1">
                    {user?.email || 'admin@email.com'}
                  </p>
                  <span className="inline-block mt-2 px-3 py-1 bg-[#EFF6FF] text-[#2563EB] text-xs font-medium rounded-full">
                    {user?.role == "admin" ? "Administrator" : "User"}
                  </span>
                </div>
              </div>

              {/* Profile Actions */}
              <div className="p-2">
                <button
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors duration-200 text-left"
                  onClick={() => {
                    setShowProfile(false);
                    navigate('/admin/profile');
                  }}
                >
                  <UserIcon className="w-5 h-5 text-[#64748B]" />
                  <span className="text-sm font-medium text-[#0F172A]">My Profile</span>
                </button>
                <button
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 transition-colors duration-200 text-left group"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5 text-[#64748B] group-hover:text-red-500" />
                  <span className="text-sm font-medium text-[#0F172A] group-hover:text-red-500">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
