import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const AdminLayout = ({ children, title, subtitle }: AdminLayoutProps) => {
  const [recentSubmissions, setRecentSubmissions] = useState<any[]>([]);

  const fetchRecentSubmissions = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success && data.data?.recentSubmissions) {
        setRecentSubmissions(data.data.recentSubmissions);
      }
    } catch (error) {
      console.error('Error fetching recent submissions:', error);
    }
  };

  useEffect(() => {
    fetchRecentSubmissions();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AdminSidebar />
      <div className="lg:ml-64">
        <AdminTopbar title={title} subtitle={subtitle} recentSubmissions={recentSubmissions} />
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
