import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Image as ImageIcon, X, AlertCircle } from 'lucide-react';
import { ACCEPTED_MIME_TYPES, MAX_UPLOAD_BYTES } from '../lib/documentTypes';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  error?: string;
}

const FileUpload = ({ onFileSelect, selectedFile, error }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [rejectionError, setRejectionError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptedFormats = ACCEPTED_MIME_TYPES;
  const maxFileSize = MAX_UPLOAD_BYTES; // 10 MB

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    validateAndSetFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    if (!acceptedFormats.includes(file.type)) {
      setRejectionError('Unsupported file format. Please use PDF, JPG, JPEG, or PNG');
      onFileSelect(null);
      return;
    }

    if (file.size > maxFileSize) {
      setRejectionError('File size exceeds 10 MB limit');
      onFileSelect(null);
      return;
    }

    setRejectionError('');
    onFileSelect(file);
  };

  const handleRemove = () => {
    setRejectionError('');
    onFileSelect(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = () => {
    if (!selectedFile) return Upload;
    if (selectedFile.type === 'application/pdf') return FileText;
    return ImageIcon;
  };

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Upload document"
      />

      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-lg p-8 sm:p-12 text-center cursor-pointer transition-colors duration-200 ${
              isDragging
                ? 'border-[#2563EB] bg-[#EFF6FF]'
                : error
                ? 'border-red-300 bg-red-50'
                : 'border-slate-300 hover:border-[#2563EB] hover:bg-[#EFF6FF]'
            }`}
          >
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: isDragging ? 1.05 : 1 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-[#EFF6FF] rounded-full flex items-center justify-center">
                <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-[#2563EB]" />
              </div>
              <div>
                <p className="text-base sm:text-lg font-medium text-[#0F172A] mb-2">
                  Choose a file or drag it here
                </p>
                <p className="text-sm text-[#475569]">
                  PDF, JPG, JPEG, PNG • Maximum 10 MB
                </p>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="relative border border-slate-200 rounded-lg p-4 sm:p-6 bg-white"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="w-12 h-12 bg-[#EFF6FF] rounded-lg flex items-center justify-center flex-shrink-0">
                  {(() => {
                    const Icon = getFileIcon();
                    return <Icon className="w-6 h-6 text-[#2563EB]" />;
                  })()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base font-medium text-[#0F172A] truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs sm:text-sm text-[#475569]">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                aria-label="Remove file"
              >
                <X className="w-5 h-5 text-[#475569]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {(error || rejectionError) && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 text-red-600 text-sm"
        >
          <AlertCircle className="w-4 h-4" />
          <span>{error || rejectionError}</span>
        </motion.div>
      )}
    </div>
  );
};

export default FileUpload;
