import { motion } from 'framer-motion';
import { Shield, Lock, CheckCircle, FileText, Upload } from 'lucide-react';

const SecureSimple = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const visualVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, delay: 0.2 },
    },
  };

  const features = [
    {
      icon: Lock,
      title: 'Private by design',
      description:
        'Submitted documents are handled through controlled access and are available only to authorized personnel.',
    },
    {
      icon: Upload,
      title: 'Simple submission',
      description:
        'Teachers can submit required documents without creating or remembering another account.',
    },
    {
      icon: CheckCircle,
      title: 'Organized for review',
      description:
        'Submissions are structured and organized so administrators can easily review submitted documents.',
    },
  ];

  return (
    <section className="py-20 sm:py-24 lg:py-32 bg-[#F8FAFC]">
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
              Secure & Simple
            </span>
          </motion.div>
          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] leading-tight mb-4"
          >
            Built to keep document submission simple and protected.
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg text-[#475569] max-w-2xl"
          >
            Everything teachers need to submit their documents, without
            unnecessary steps or complicated account setup.
          </motion.p>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Side - Product Visual */}
          <motion.div
            variants={visualVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="order-2 lg:order-1"
          >
            <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 max-w-md mx-auto lg:mx-0">
              {/* Document Card */}
              <div className="bg-[#F8FAFC] rounded-lg border border-slate-200 p-4 sm:p-5 mb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#EFF6FF] rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-[#2563EB]" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-semibold text-[#0F172A]">
                        Teaching_Cert_2024.pdf
                      </h3>
                      <p className="text-xs sm:text-sm text-[#475569]">
                        2.4 MB • PDF Document
                      </p>
                    </div>
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                  >
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                  </motion.div>
                </div>

                {/* Upload Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-[#475569]">Upload progress</span>
                    <span className="text-[#0F172A] font-medium">100%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '100%' }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
                      className="h-full bg-[#2563EB] rounded-full"
                    />
                  </div>
                </div>
              </div>

              {/* Secure Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-[#0F2A43]" />
                  <span className="text-xs sm:text-sm text-[#475569]">
                    Encrypted transfer
                  </span>
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 }}
                  className="flex items-center space-x-1.5 bg-green-50 px-3 py-1.5 rounded-full"
                >
                  <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                  <span className="text-xs sm:text-sm font-medium text-green-700">
                    Secure
                  </span>
                </motion.div>
              </div>

              {/* Subtle decorative elements */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 0.3, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="absolute -top-3 -right-3 w-16 h-16 bg-[#EFF6FF] rounded-full blur-2xl"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 0.2, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="absolute -bottom-4 -left-4 w-20 h-20 bg-[#EFF6FF] rounded-full blur-2xl"
              />
            </div>
          </motion.div>

          {/* Right Side - Features */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="order-1 lg:order-2 space-y-6 sm:space-y-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="group"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#EFF6FF] rounded-lg flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-[#2563EB]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold text-[#0F172A] mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
                {index < features.length - 1 && (
                  <div className="mt-6 sm:mt-8 border-b border-slate-200" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SecureSimple;
