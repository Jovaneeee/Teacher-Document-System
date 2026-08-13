import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, FolderOpen, Mail, MailCheck, Loader2 } from 'lucide-react';
import { api } from '../lib/api';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const validateEmail = (email: string): boolean => {
    if (!email.trim()) {
      setError('Email address is required.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await api.forgotPassword({ email });
      setIsSuccess(true);
    } catch (error: any) {
      setError(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
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

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* Left Side - Branding */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 bg-[#0F2A43] p-12 lg:p-16 flex-col justify-center items-center relative overflow-hidden"
      >
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-64 h-64 border border-white/20 rounded-full" />
          <div className="absolute bottom-20 right-20 w-96 h-96 border border-white/20 rounded-full" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/10 rounded-full" />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 text-center max-w-md"
        >
          {/* Logo */}
          <motion.div variants={itemVariants} className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
              <FileText className="w-10 h-10 text-white" />
            </div>
          </motion.div>

          {/* School Name */}
          <motion.h1
            variants={itemVariants}
            className="text-3xl lg:text-4xl font-bold text-white mb-3"
          >
            Teacher Document Portal
          </motion.h1>

          {/* Heading */}
          <motion.h2
            variants={itemVariants}
            className="text-2xl lg:text-3xl font-semibold text-white/90 mb-4"
          >
            Administrative Workspace
          </motion.h2>

          {/* Supporting Text */}
          <motion.p
            variants={itemVariants}
            className="text-base lg:text-lg text-white/70 leading-relaxed"
          >
            Manage teacher document submissions from one organized workspace.
          </motion.p>

          {/* Abstract Document Visual */}
          <motion.div
            variants={itemVariants}
            className="mt-12 flex justify-center gap-4"
          >
            <div className="w-16 h-20 bg-white/10 rounded-lg backdrop-blur-sm flex items-center justify-center">
              <FolderOpen className="w-8 h-8 text-white/60" />
            </div>
            <div className="w-16 h-20 bg-white/10 rounded-lg backdrop-blur-sm flex items-center justify-center">
              <FileText className="w-8 h-8 text-white/60" />
            </div>
            <div className="w-16 h-20 bg-white/10 rounded-lg backdrop-blur-sm flex items-center justify-center">
              <FolderOpen className="w-8 h-8 text-white/60" />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Right Side - Forgot Password Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="w-16 h-16 rounded-xl bg-[#0F2A43] flex items-center justify-center">
              <FileText className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Mobile Heading */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-2xl font-bold text-[#0F172A] mb-2">
              Teacher Document Portal
            </h1>
            <p className="text-sm text-[#64748B] uppercase tracking-wide">ADMINISTRATOR ACCESS</p>
          </div>

          {!isSuccess ? (
            <>
              {/* Welcome */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mb-8"
              >
                <p className="text-sm text-[#64748B] uppercase tracking-wide mb-2">
                  ADMINISTRATOR ACCESS
                </p>
                <h2 className="text-2xl lg:text-3xl font-semibold text-[#0F172A] mb-2">
                  Forgot your password?
                </h2>
                <p className="text-[#475569]">
                  Enter your administrator email address and we'll send you a link to reset your password.
                </p>
              </motion.div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[#0F172A] mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-[#64748B]" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) validateEmail(e.target.value);
                      }}
                      placeholder="Enter your email address"
                      className={`w-full pl-10 px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent bg-white ${
                        error
                          ? 'border-red-300 bg-red-50'
                          : 'border-slate-300 focus:border-[#2563EB]'
                      }`}
                      aria-invalid={error ? 'true' : 'false'}
                      aria-describedby={error ? 'email-error' : undefined}
                    />
                  </div>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      id="email-error"
                      className="mt-1 text-sm text-red-600"
                    >
                      {error}
                    </motion.p>
                  )}
                </motion.div>

                {/* Send Reset Link Button */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#0F2A43] hover:bg-[#0a1f33] text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Sending reset link...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </motion.button>
              </form>

              {/* Back to Login */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="mt-6"
              >
                <button
                  onClick={() => navigate('/admin/login')}
                  className="text-sm text-[#475569] hover:text-[#2563EB] transition-colors duration-200"
                >
                  ← Back to Admin Login
                </button>
              </motion.div>
            </>
          ) : (
            <>
              {/* Success State */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                    <MailCheck className="w-8 h-8 text-green-600" />
                  </div>
                </div>

                <p className="text-sm text-[#64748B] uppercase tracking-wide mb-2">
                  ADMINISTRATOR ACCESS
                </p>
                <h2 className="text-2xl lg:text-3xl font-semibold text-[#0F172A] mb-4">
                  Check your email
                </h2>
                <p className="text-[#475569] mb-6">
                  If an account exists with that email address, you'll receive instructions to reset your password.
                </p>

                <div className="bg-slate-50 rounded-lg p-4 mb-6 text-sm text-[#475569]">
                  <p className="mb-2">Didn't receive the email?</p>
                  <p>Check your spam folder or try again.</p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/admin/login')}
                  className="text-sm text-[#2563EB] hover:underline transition-colors duration-200"
                >
                  Back to Admin Login
                </motion.button>
              </motion.div>
            </>
          )}

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-8 text-center"
          >
            <p className="text-xs text-[#64748B] mb-2">
              Authorized personnel only.
            </p>
            <p className="text-xs text-[#64748B]">
              © 2026 Teacher Document Portal
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
