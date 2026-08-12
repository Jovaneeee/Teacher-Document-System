import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, FolderOpen, LockKeyhole, Eye, EyeOff, CheckCircle, Loader2, Check, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { changePassword } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const passwordRequirements = {
    minLength: formData.newPassword.length >= 8,
    hasUppercase: /[A-Z]/.test(formData.newPassword),
    hasLowercase: /[a-z]/.test(formData.newPassword),
    hasNumber: /[0-9]/.test(formData.newPassword),
  };

  const allRequirementsMet = Object.values(passwordRequirements).every(Boolean);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.newPassword) {
      newErrors.newPassword = 'Please enter your new password.';
    } else if (!allRequirementsMet) {
      newErrors.newPassword = 'Password does not meet requirements.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password.';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
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
      await changePassword(formData.newPassword);
      setIsSuccess(true);
      // Clear password fields after successful submission
      setFormData({ newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      setErrors({
        submit: error.message || 'Failed to update password. Please try again.'
      });
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

      {/* Right Side - Reset Password Form */}
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
                  Create a new password
                </h2>
                <p className="text-[#475569]">
                  Choose a strong password for your administrator account.
                </p>
              </motion.div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* New Password */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-[#0F172A] mb-2"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockKeyhole className="w-5 h-5 text-[#64748B]" />
                    </div>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      id="newPassword"
                      value={formData.newPassword}
                      onChange={(e) => {
                        setFormData({ ...formData, newPassword: e.target.value });
                        if (errors.newPassword) setErrors({ ...errors, newPassword: '' });
                      }}
                      placeholder="Enter your new password"
                      className={`w-full pl-10 pr-12 px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent bg-white ${
                        errors.newPassword
                          ? 'border-red-300 bg-red-50'
                          : 'border-slate-300 focus:border-[#2563EB]'
                      }`}
                      aria-invalid={errors.newPassword ? 'true' : 'false'}
                      aria-describedby={errors.newPassword ? 'newPassword-error' : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#64748B] hover:text-[#0F172A] transition-colors duration-200"
                      aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      id="newPassword-error"
                      className="mt-1 text-sm text-red-600"
                    >
                      {errors.newPassword}
                    </motion.p>
                  )}
                </motion.div>

                {/* Password Requirements */}
                {formData.newPassword && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-50 rounded-lg p-4"
                  >
                    <p className="text-sm font-medium text-[#0F172A] mb-3">
                      Password requirements
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm">
                        {passwordRequirements.minLength ? (
                          <Check className="w-4 h-4 text-green-600 mr-2" />
                        ) : (
                          <X className="w-4 h-4 text-slate-400 mr-2" />
                        )}
                        <span className={passwordRequirements.minLength ? 'text-green-700' : 'text-slate-500'}>
                          At least 8 characters
                        </span>
                      </li>
                      <li className="flex items-center text-sm">
                        {passwordRequirements.hasUppercase ? (
                          <Check className="w-4 h-4 text-green-600 mr-2" />
                        ) : (
                          <X className="w-4 h-4 text-slate-400 mr-2" />
                        )}
                        <span className={passwordRequirements.hasUppercase ? 'text-green-700' : 'text-slate-500'}>
                          Contains an uppercase letter
                        </span>
                      </li>
                      <li className="flex items-center text-sm">
                        {passwordRequirements.hasLowercase ? (
                          <Check className="w-4 h-4 text-green-600 mr-2" />
                        ) : (
                          <X className="w-4 h-4 text-slate-400 mr-2" />
                        )}
                        <span className={passwordRequirements.hasLowercase ? 'text-green-700' : 'text-slate-500'}>
                          Contains a lowercase letter
                        </span>
                      </li>
                      <li className="flex items-center text-sm">
                        {passwordRequirements.hasNumber ? (
                          <Check className="w-4 h-4 text-green-600 mr-2" />
                        ) : (
                          <X className="w-4 h-4 text-slate-400 mr-2" />
                        )}
                        <span className={passwordRequirements.hasNumber ? 'text-green-700' : 'text-slate-500'}>
                          Contains a number
                        </span>
                      </li>
                    </ul>
                  </motion.div>
                )}

                {/* Confirm Password */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-[#0F172A] mb-2"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockKeyhole className="w-5 h-5 text-[#64748B]" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={(e) => {
                        setFormData({ ...formData, confirmPassword: e.target.value });
                        if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                      }}
                      placeholder="Confirm your new password"
                      className={`w-full pl-10 pr-12 px-4 py-3 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent bg-white ${
                        errors.confirmPassword
                          ? 'border-red-300 bg-red-50'
                          : formData.confirmPassword && formData.newPassword === formData.confirmPassword
                          ? 'border-green-300 bg-green-50'
                          : 'border-slate-300 focus:border-[#2563EB]'
                      }`}
                      aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                      aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#64748B] hover:text-[#0F172A] transition-colors duration-200"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      id="confirmPassword-error"
                      className="mt-1 text-sm text-red-600"
                    >
                      {errors.confirmPassword}
                    </motion.p>
                  )}
                  {formData.confirmPassword && !errors.confirmPassword && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-sm text-green-600"
                    >
                      {formData.newPassword === formData.confirmPassword
                        ? 'Passwords match.'
                        : 'Passwords do not match.'}
                    </motion.p>
                  )}
                </motion.div>

                {/* Update Password Button */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#0F2A43] hover:bg-[#0a1f33] text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Updating password...
                    </>
                  ) : (
                    'Update Password'
                  )}
                </motion.button>

                {/* Submit Error */}
                {errors.submit && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-600 text-center"
                  >
                    {errors.submit}
                  </motion.p>
                )}
              </form>

              {/* Back to Login */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="mt-6"
              >
                <button
                  onClick={() => navigate('/admin')}
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
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </div>

                <p className="text-sm text-[#64748B] uppercase tracking-wide mb-2">
                  ADMINISTRATOR ACCESS
                </p>
                <h2 className="text-2xl lg:text-3xl font-semibold text-[#0F172A] mb-4">
                  Password updated
                </h2>
                <p className="text-[#475569] mb-6">
                  Your administrator password has been updated successfully.
                </p>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/admin')}
                  className="w-full bg-[#0F2A43] hover:bg-[#0a1f33] text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  Return to Admin Login
                </motion.button>
              </motion.div>
            </>
          )}

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
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

export default ResetPassword;
