import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, Send, Home, Loader2 } from 'lucide-react';
import FileUpload from './FileUpload';

const SubmissionForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    documentType: '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);


  const documentTypes = [
    'OBAS — Official Business Authorization Slip',
    'Travel Authority (TO)',
    'Form 6 — Leave',
  ];

  const mapDocumentType = (type: string): string => {
    if (type.includes('OBAS')) return 'OBAS';
    if (type.includes('Travel')) return 'TRAVEL_AUTHORITY';
    if (type.includes('Form 6')) return 'FORM_6';
    return 'OBAS';
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.documentType) {
      newErrors.documentType = 'Document type is required';
    }

    if (!selectedFile) {
      newErrors.file = 'Please select a file to upload';
    } else if (
      !['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'].includes(
        selectedFile.type
      )
    ) {
      newErrors.file = 'Unsupported file format. Please use PDF, JPG, JPEG, or PNG';
    } else if (selectedFile.size > 10 * 1024 * 1024) {
      newErrors.file = 'File size exceeds 10 MB limit';
    }

    if (!privacyAgreed) {
      newErrors.privacy = 'Please agree to the Data Privacy Notice';
    }

    if (!termsAgreed) {
      newErrors.terms = 'Please agree to the Terms and Conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const submissionFormData = new FormData();
      submissionFormData.append('teacher_name', formData.fullName);
      submissionFormData.append('document_type', mapDocumentType(formData.documentType));
      if (selectedFile) {
        submissionFormData.append('file', selectedFile);
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/submissions`, {
        method: 'POST',
        body: submissionFormData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ submit: data.error || 'Submission failed. Please try again.' });
        }
        setIsSubmitting(false);
        return;
      }

      setSubmissionId(data.data.id);
      setIsSubmitting(false);
      setShowSuccess(true);
    } catch (error) {
      console.error('Submission error:', error);
      setErrors({ submit: 'Network error. Please check your connection and try again.' });
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      documentType: '',
    });
    setSelectedFile(null);
    setPrivacyAgreed(false);
    setTermsAgreed(false);
    setErrors({});
    setShowSuccess(false);
    setSubmissionId(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  if (showSuccess) {
    return (
      <section id="submit" className="py-20 sm:py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-10 h-10 text-green-600" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl font-bold text-[#0F172A] mb-4"
            >
              Document submitted successfully.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base sm:text-lg text-[#475569] mb-6"
            >
              Your document has been submitted and is pending administrative review.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="inline-block px-4 py-2 bg-[#EFF6FF] rounded-lg mb-8"
            >
              <p className="text-sm font-medium text-[#2563EB]">
                Submission Reference: {submissionId || 'N/A'}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReset}
                className="inline-flex items-center justify-center px-6 py-3 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Submit Another Document
              </motion.button>
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 bg-white hover:bg-slate-50 text-[#0F172A] font-semibold rounded-lg border border-slate-200 transition-colors duration-200"
              >
                <Home className="w-5 h-5 mr-2" />
                Back to Home
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="submit" className="py-20 sm:py-24 lg:py-32 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Introduction */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mb-16 sm:mb-20 lg:mb-24"
        >
          <motion.div variants={itemVariants}>
            <span className="inline-block px-3 py-1.5 bg-[#EFF6FF] text-[#2563EB] text-xs sm:text-sm font-semibold rounded-full uppercase tracking-wider mb-4">
              Document Submission
            </span>
          </motion.div>
          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] leading-tight mb-4"
          >
            Submit your required document.
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg text-[#475569] max-w-2xl"
          >
            Complete the information below and upload your document for
            administrative review.
          </motion.p>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Side - Information Panel */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="order-2 lg:order-1"
          >
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-semibold text-[#0F172A] mb-6">
                Before you submit
              </h3>

              <ul className="space-y-4 mb-8">
                {[
                  'Make sure your information is correct.',
                  'Use a supported file format.',
                  'Review the document before submitting.',
                  'Confirm the Data Privacy agreement.',
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    className="flex items-start space-x-3"
                  >
                    <div className="w-2 h-2 bg-[#2563EB] rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-[#475569]">
                      {item}
                    </span>
                  </motion.li>
                ))}
              </ul>

              <div className="pt-6 border-t border-slate-200">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-[#EFF6FF] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-[#2563EB]" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-[#0F172A] mb-1">
                      Your information matters.
                    </h4>
                    <p className="text-sm sm:text-base text-[#475569]">
                      Your submitted document is intended for authorized
                      administrative review.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="order-1 lg:order-2"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <motion.div variants={itemVariants}>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-[#0F172A] mb-2"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent ${
                    errors.fullName
                      ? 'border-red-300 bg-red-50'
                      : 'border-slate-300 focus:border-[#2563EB]'
                  }`}
                />
                {errors.fullName && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.fullName}
                  </motion.p>
                )}
              </motion.div>

              {/* Document Type */}
              <motion.div variants={itemVariants}>
                <label
                  htmlFor="documentType"
                  className="block text-sm font-medium text-[#0F172A] mb-2"
                >
                  Document Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="documentType"
                  value={formData.documentType}
                  onChange={(e) =>
                    setFormData({ ...formData, documentType: e.target.value })
                  }
                  className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent bg-white ${
                    errors.documentType
                      ? 'border-red-300 bg-red-50'
                      : 'border-slate-300 focus:border-[#2563EB]'
                  }`}
                >
                  <option value="">Select document type</option>
                  {documentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.documentType && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.documentType}
                  </motion.p>
                )}
              </motion.div>

              {/* File Upload */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">
                  Upload Document <span className="text-red-500">*</span>
                </label>
                <FileUpload
                  onFileSelect={setSelectedFile}
                  selectedFile={selectedFile}
                  error={errors.file}
                />
              </motion.div>

              {/* Privacy Agreement */}
              <motion.div variants={itemVariants}>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacyAgreed}
                    onChange={(e) => setPrivacyAgreed(e.target.checked)}
                    className="mt-1 w-4 h-4 text-[#2563EB] border-slate-300 rounded focus:ring-[#2563EB] focus:ring-2"
                  />
                  <span className="text-sm text-[#475569]">
                    I have read and agree to the{' '}
                    <Link
                      to="/privacy-policy"
                      className="text-[#2563EB] hover:underline font-medium"
                    >
                      Data Privacy Notice
                    </Link>
                    .
                  </span>
                </label>
                {errors.privacy && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.privacy}
                  </motion.p>
                )}
              </motion.div>

              {/* Terms Agreement */}
              <motion.div variants={itemVariants}>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAgreed}
                    onChange={(e) => setTermsAgreed(e.target.checked)}
                    className="mt-1 w-4 h-4 text-[#2563EB] border-slate-300 rounded focus:ring-[#2563EB] focus:ring-2"
                  />
                  <span className="text-sm text-[#475569]">
                    I agree to the{' '}
                    <Link
                      to="/terms"
                      className="text-[#2563EB] hover:underline font-medium"
                    >
                      Terms and Conditions
                    </Link>
                    .
                  </span>
                </label>
                {errors.terms && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.terms}
                  </motion.p>
                )}
              </motion.div>

              {/* Submit Error */}
              {errors.submit && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 rounded-lg p-4"
                >
                  <p className="text-sm text-red-600">{errors.submit}</p>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.div variants={itemVariants}>
                <motion.button
                  type="submit"
                  disabled={
                    !privacyAgreed ||
                    !termsAgreed ||
                    isSubmitting ||
                    !selectedFile
                  }
                  whileHover={
                    !privacyAgreed ||
                    !termsAgreed ||
                    isSubmitting ||
                    !selectedFile
                      ? {}
                      : { scale: 1.02 }
                  }
                  whileTap={
                    !privacyAgreed ||
                    !termsAgreed ||
                    isSubmitting ||
                    !selectedFile
                      ? {}
                      : { scale: 0.98 }
                  }
                  className={`w-full inline-flex items-center justify-center px-6 py-4 rounded-lg font-semibold transition-all duration-200 ${
                    !privacyAgreed ||
                    !termsAgreed ||
                    isSubmitting ||
                    !selectedFile
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      : 'bg-[#2563EB] hover:bg-[#1d4ed8] text-white'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Document
                      <Send className="ml-2 w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SubmissionForm;
