import { motion } from 'framer-motion';

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  documentInfo: {
    teacherName: string;
    documentType: string;
    fileName: string;
  };
}

const DeleteConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  documentInfo
}: DeleteConfirmationDialogProps) => {
  if (!isOpen) return null;

  const formatDocumentType = (type: string) => {
    if (type === 'OBAS') return 'OBAS';
    if (type === 'TRAVEL_AUTHORITY') return 'Travel Authority (TO)';
    if (type === 'FORM_6') return 'Form 6 — Leave';
    return type;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6"
      >
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
            Delete Document?
          </h3>
          <p className="text-sm text-[#64748B] mb-4">
            Are you sure you want to permanently delete this document?
          </p>
          <p className="text-xs text-[#EF4444] font-medium">
            This action cannot be undone.
          </p>
        </div>

        {/* Document Information */}
        <div className="bg-slate-50 rounded-lg p-4 mb-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-[#64748B]">Teacher:</span>
              <span className="text-sm font-medium text-[#0F172A]">{documentInfo.teacherName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-[#64748B]">Document Type:</span>
              <span className="text-sm font-medium text-[#0F172A]">{formatDocumentType(documentInfo.documentType)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-[#64748B]">File Name:</span>
              <span className="text-sm font-medium text-[#0F172A] max-w-[200px] truncate">{documentInfo.fileName}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-[#0F172A] hover:bg-slate-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-sm font-medium text-white hover:bg-red-700 transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DeleteConfirmationDialog;
