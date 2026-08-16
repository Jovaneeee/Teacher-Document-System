import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, ShieldCheck, CircleCheck, Lock, ArrowLeft } from 'lucide-react';
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
    <AdminLayout title="Profile" subtitle="Manage your administrator account and profile information">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => navigate('/admin/dashboard')}
        className="flex items-center space-x-2 text-sm font-medium text-[#64748B] hover:text-[#2563EB] transition-colors duration-200 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </motion.button>

      <div className="space-y-6">
        {/* Profile Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:p-8"
        >
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-full bg-[#EFF6FF] flex items-center justify-center border-2 border-slate-200 shadow-sm">
                {user?.email ? (
                  <span className="text-3xl lg:text-4xl font-semibold text-[#2563EB]">
                    {getUserInitials()}
                  </span>
                ) : (
                  <User className="w-14 h-14 lg:w-16 lg:h-16 text-[#2563EB]" />
                )}
              </div>
            </div>

            {/* Profile Information */}
            <div className="flex-1 text-center lg:text-left">
              <div className="mb-4">
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">
                  Administrator Profile
                </p>
                <h2 className="text-2xl lg:text-3xl font-semibold text-[#0F172A] mb-1">
                  {getDisplayName()}
                </h2>
                <p className="text-[#64748B]">
                  {user?.email || 'admin@email.com'}
                </p>
              </div>

              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-3">
                <span className="inline-flex items-center px-3 py-1.5 bg-[#EFF6FF] text-[#2563EB] text-sm font-medium rounded-lg">
                  <CircleCheck className="w-3.5 h-3.5 mr-1.5" />
                  Active
                </span>
                <span className="inline-flex items-center px-3 py-1.5 bg-[#0F172A] text-white text-sm font-medium rounded-lg">
                  {getRoleDisplay()}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Information Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-6"
          >
            <h3 className="text-base font-semibold text-[#0F172A] mb-4">
              Personal Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
                  <User className="w-5 h-5 text-[#2563EB]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#64748B] uppercase tracking-wider mb-1">
                    Full Name
                  </p>
                  <p className="text-sm font-medium text-[#0F172A] truncate">
                    {getDisplayName()}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[#2563EB]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#64748B] uppercase tracking-wider mb-1">
                    Email Address
                  </p>
                  <p className="text-sm font-medium text-[#0F172A] truncate">
                    {user?.email || 'admin@email.com'}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-[#2563EB]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#64748B] uppercase tracking-wider mb-1">
                    Role
                  </p>
                  <p className="text-sm font-medium text-[#0F172A]">
                    {getRoleDisplay()}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
                  <CircleCheck className="w-5 h-5 text-[#2563EB]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#64748B] uppercase tracking-wider mb-1">
                    Account Status
                  </p>
                  <p className="text-sm font-medium text-[#0F172A]">
                    Active
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Account Security Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-6"
          >
            <h3 className="text-base font-semibold text-[#0F172A] mb-4">
              Account Security
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
                  <Lock className="w-5 h-5 text-[#2563EB]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#64748B] uppercase tracking-wider mb-1">
                    Password
                  </p>
                  <p className="text-sm font-medium text-[#0F172A]">
                    Password protected
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-[#2563EB]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#64748B] uppercase tracking-wider mb-1">
                    Authentication
                  </p>
                  <p className="text-sm font-medium text-[#0F172A]">
                    Secure administrator authentication
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
                  <User className="w-5 h-5 text-[#2563EB]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#64748B] uppercase tracking-wider mb-1">
                    Access Level
                  </p>
                  <p className="text-sm font-medium text-[#0F172A]">
                    {getRoleDisplay()}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Access & Permissions Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-6"
        >
          <h3 className="text-base font-semibold text-[#0F172A] mb-4">
            Access & Permissions
          </h3>
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-lg bg-[#0F172A] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-lg font-semibold text-[#0F172A] mb-3">
                Administrator
              </p>
              <p className="text-sm text-[#64748B] mb-4">
                Full access to:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                <div className="flex items-center space-x-2 text-sm text-[#0F172A]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                  <span>Dashboard</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-[#0F172A]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                  <span>Documents</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-[#0F172A]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                  <span>Submissions</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-[#0F172A]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                  <span>Notifications</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-[#0F172A]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                  <span>Reports</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminProfile;
