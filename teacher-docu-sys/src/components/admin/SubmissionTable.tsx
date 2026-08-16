import { motion } from 'framer-motion';
import { useState } from 'react';
import { FileText, Clock, CheckCircle, Eye, CircleX, Trash2, Download } from 'lucide-react';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

interface SubmissionTableProps {
  submissions: any[];
  onRefresh?: () => void;
}

const SubmissionTable = ({ submissions, onRefresh }: SubmissionTableProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState<any>(null);

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

  const handleDeleteClick = (submission: any) => {
    setSubmissionToDelete(submission);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!submissionToDelete) return;

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/submissions/${submissionToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setDeleteDialogOpen(false);
        setSubmissionToDelete(null);
        if (onRefresh) onRefresh();
      } else {
        console.error('Error deleting submission:', data.error);
        alert('Failed to delete document. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting submission:', error);
      alert('Failed to delete document. Please try again.');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSubmissionToDelete(null);
  };

  const formatDocumentType = (type: string) => {
    if (type === 'OBAS') return 'OBAS';
    if (type === 'TRAVEL_AUTHORITY') return 'Travel Authority (TO)';
    if (type === 'FORM_6') return 'Form 6 — Leave';
    return type;
  };

  if (submissions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <p className="text-sm text-[#64748B] text-center">No submissions found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Responsive Table with Horizontal Scroll */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider min-w-[140px]">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider min-w-[180px]">
                Document Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider min-w-[140px]">
                Submitted
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider min-w-[120px]">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider min-w-[200px]">
                File
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-[#64748B] uppercase tracking-wider min-w-[180px]">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {submissions.map((submission, index) => (
              <motion.tr
                key={submission.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="hover:bg-slate-50 transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-[#0F172A]">
                    {submission.teacher}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-[#475569]">
                    {formatDocumentType(submission.type)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-[#475569]">
                    {submission.submitted}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(submission.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-[#64748B]" />
                    <span className="text-sm text-[#475569] max-w-[200px] truncate">
                      {submission.filename}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => handleView(submission.id)}
                    className="ml-2 inline-flex items-center justify-center rounded-lg border border-blue-200 bg-blue-50 p-2 text-blue-600 transition-colors duration-200 hover:border-blue-300 hover:bg-blue-100 hover:text-blue-700"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDownload(submission.id, submission.filename)}
                    className="ml-2 inline-flex items-center justify-center rounded-lg border border-green-200 bg-green-50 p-2 text-green-600 transition-colors duration-200 hover:border-green-300 hover:bg-green-100 hover:text-green-700"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                 <button
                    onClick={() => handleDeleteClick(submission)}
                    className="ml-2 inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 p-2 text-red-600 transition-colors duration-200 hover:border-red-300 hover:bg-red-100 hover:text-red-700"
                    aria-label="Delete document"
                    title="Delete document"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        documentInfo={{
          teacherName: submissionToDelete?.teacher || '',
          documentType: submissionToDelete?.type || '',
          fileName: submissionToDelete?.filename || ''
        }}
      />
    </div>
  );
};

export default SubmissionTable;
