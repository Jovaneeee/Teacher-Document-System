import { motion } from 'framer-motion';
import { FileText, Clock, CheckCircle, ArrowUpRight, ArrowDown, CircleX } from 'lucide-react';

interface DocumentListProps {
  documents: any[];
  onRefresh?: () => void;
}

const DocumentList = ({ documents, onRefresh }: DocumentListProps) => {
  const getStatusBadge = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    if (normalizedStatus === 'pending') {
      return (
        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
          <Clock className="w-3 h-3" />
          <span>Pending</span>
        </span>
      );
    }
    if (normalizedStatus === 'rejected') {
      return (
        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
          <CircleX className="w-3 h-3" />
          <span>Rejected</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
        <CheckCircle className="w-3 h-3" />
        <span>Reviewed</span>
      </span>
    );
  };

  const handleView = async (id: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/submissions/${id}/view`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success && data.url) {
        window.open(data.url, '_blank');
        if (onRefresh) onRefresh();
      }
    } catch (error) {
      console.error('Error viewing document:', error);
    }
  };

  const handleDownload = async (id: string, filename: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/submissions/${id}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success && data.url) {
        const link = document.createElement('a');
        link.href = data.url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  const formatDocumentType = (type: string) => {
    if (type === 'OBAS') return 'OBAS';
    if (type === 'TRAVEL_AUTHORITY') return 'Travel Authority (TO)';
    if (type === 'FORM_6') return 'Form 6 — Leave';
    return type;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Responsive Table with Horizontal Scroll */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider min-w-[200px]">
                Document
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider min-w-[140px]">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider min-w-[180px]">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider min-w-[140px]">
                Submitted
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider min-w-[120px]">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-[#64748B] uppercase tracking-wider min-w-[180px]">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {documents.map((document, index) => (
              <motion.tr
                key={document.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="hover:bg-slate-50 transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-[#64748B]" />
                    <span className="text-sm font-medium text-[#0F172A] max-w-[200px] truncate">
                      {document.filename}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-[#475569]">
                    {document.teacher}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-[#475569]">
                    {formatDocumentType(document.type)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-[#475569]">
                    {document.submitted}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(document.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => handleView(document.id)}
                    className="inline-flex items-center space-x-1 text-sm font-medium text-[#2563EB] hover:underline mr-3"
                  >
                    <span>View</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDownload(document.id, document.filename)}
                    className="inline-flex items-center space-x-1 text-sm font-medium text-green-600 hover:underline"
                  >
                    <span>Download</span>
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentList;
