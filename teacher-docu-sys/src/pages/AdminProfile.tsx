import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import AdminLayout from '../components/admin/AdminLayout';
import { useAuth } from '../contexts/AuthContext';

const AdminProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const getUserInitials = () => {
    if (!user?.email) return 'U';
    const emailParts = user.email.split('@')[0];
    const parts = emailParts.split('.');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return emailParts.slice(0, 2).toUpperCase();
  };

  const getDisplayName = () => {
    if (!user?.email) return 'Administrator';
    return user.email.split('@')[0];
  };

  const getRoleDisplay = () => {
    return user?.role === 'admin' ? 'Administrator' : 'User';
  };

  return (
    <AdminLayout title="Profile" subtitle="Manage your administrator profile information">
      {/* Back Button */}
      <button
        onClick={() => navigate('/admin/dashboard')}
        className="flex items-center space-x-2 text-sm font-medium text-[#64748B] hover:text-[#2563EB] transition-colors duration-200 mb-6"
      >
        <span>← Back to Dashboard</span>
      </button>

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 max-w-2xl mx-auto">
        <div className="flex flex-col items-center text-center">
          {/* Profile Picture */}
          <div className="w-24 h-24 rounded-full bg-[#EFF6FF] flex items-center justify-center border border-slate-200 mb-4">
            {user?.email ? (
              <span className="text-2xl font-semibold text-[#2563EB]">
                {getUserInitials()}
              </span>
            ) : (
              <User className="w-12 h-12 text-[#2563EB]" />
            )}
          </div>

          {/* Profile Information */}
          <h2 className="text-xl font-semibold text-[#0F172A] mb-1">
            {getDisplayName()}
          </h2>
          <p className="text-[#64748B] mb-3">
            {user?.email || 'admin@email.com'}
          </p>
          <span className="inline-block px-4 py-1.5 bg-[#EFF6FF] text-[#2563EB] text-sm font-medium rounded-full">
            {getRoleDisplay()}
          </span>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProfile;
