import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Inbox,
  Files,
  LogOut,
  Menu,
  X,
  FileText,
  User,
} from 'lucide-react';

interface NavItem {
  label: string;
  icon: typeof LayoutDashboard;
  href: string;
}

const AdminSidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const mainNavItems: NavItem[] = [
    { label: 'Overview', icon: LayoutDashboard, href: '/admin/dashboard' },
    { label: 'Submissions', icon: Inbox, href: '/admin/submissions' },
    { label: 'Documents', icon: Files, href: '/admin/documents' },
  ];



  const isActive = (href: string) => {
    if (href === '/admin/dashboard') {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  const NavItem = ({ item }: { item: NavItem }) => {
    const active = isActive(item.href);
    const Icon = item.icon;

    return (
      <Link
        to={item.href}
        onClick={() => setIsMobileMenuOpen(false)}
        className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
          active
            ? 'bg-[#EFF6FF] text-[#2563EB]'
            : 'text-[#475569] hover:bg-slate-100 hover:text-[#0F172A]'
        }`}
      >
        <Icon className="w-5 h-5" />
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-screen bg-white border-r border-slate-200 fixed left-0 top-0">
        {/* Logo */}
        <div className="p-5 border-b border-slate-200">
          <Link to="/admin/dashboard" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-[#0F2A43] flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[#0F172A] font-semibold text-sm leading-tight">
                Teacher Document Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {/* Main Navigation */}
          <div className="mb-6">
            <div className="space-y-1">
              {mainNavItems.map((item) => (
                <NavItem key={item.href} item={item} />
              ))}
            </div>
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center">
              <User className="w-5 h-5 text-[#2563EB]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#0F172A] truncate">
                Administrator
              </p>
              <p className="text-xs text-[#64748B] truncate">Admin</p>
            </div>
          </div>
          <Link
            to="/admin"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-[#475569] hover:bg-slate-100 hover:text-[#0F172A] transition-colors duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign out</span>
          </Link>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-slate-200"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5 text-[#0F172A]" />
      </button>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-white z-50 lg:hidden shadow-xl"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200">
                  <Link to="/admin/dashboard" className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-[#0F2A43] flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[#0F172A] font-semibold text-sm leading-tight">
                        Teacher Document Portal
                      </span>
                      <span className="text-[#64748B] text-xs leading-tight">
                        Admin
                      </span>
                    </div>
                  </Link>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5 text-[#0F172A]" />
                  </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-6 px-3">
                  {/* Main Navigation */}
                  <div className="mb-6">
                    <p className="px-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">
                      Main
                    </p>
                    <div className="space-y-1">
                      {mainNavItems.map((item) => (
                        <NavItem key={item.href} item={item} />
                      ))}
                    </div>
                  </div>
                </nav>

                {/* User Profile */}
                <div className="p-4 border-t border-slate-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center">
                      <User className="w-5 h-5 text-[#2563EB]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#0F172A] truncate">
                        Administrator
                      </p>
                      <p className="text-xs text-[#64748B] truncate">Admin</p>
                    </div>
                  </div>
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-[#475569] hover:bg-slate-100 hover:text-[#0F172A] transition-colors duration-200"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign out</span>
                  </Link>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar;
