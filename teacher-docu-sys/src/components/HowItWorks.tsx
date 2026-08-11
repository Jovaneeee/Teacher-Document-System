import { motion } from 'framer-motion';
import { FileText, Upload, ShieldCheck } from 'lucide-react';

const HowItWorks = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const steps = [
    {
      number: '01',
      icon: FileText,
      title: 'Complete your details',
      description:
        'Provide the required information so your submission can be properly identified and organized.',
    },
    {
      number: '02',
      icon: Upload,
      title: 'Upload your document',
      description:
        'Choose your required PDF or supported image file and attach it to your submission.',
    },
    {
      number: '03',
      icon: ShieldCheck,
      title: 'Submit securely',
      description:
        'Review your information, confirm the privacy agreement, and submit your document for administrative review.',
    },
  ];

  return (
    <section className="py-20 sm:py-24 lg:py-32 bg-white">
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
              How It Works
            </span>
          </motion.div>
          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] leading-tight mb-4"
          >
            Submit your documents in three simple steps.
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg text-[#475569] max-w-2xl"
          >
            Designed to keep document submission clear, quick, and convenient for
            every teacher.
          </motion.p>
        </motion.div>

        {/* Steps Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="relative"
        >
          <div className="grid lg:grid-cols-3 gap-8 sm:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                variants={itemVariants}
                className="relative"
              >
                {/* Step Number */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 + 0.3, duration: 0.5 }}
                  className="text-5xl sm:text-6xl lg:text-6xl font-bold text-[#0F2A43] opacity-20 mb-4"
                >
                  {step.number}
                </motion.div>

                {/* Icon */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 + 0.4, duration: 0.5 }}
                  className="w-12 h-12 sm:w-14 sm:h-14 bg-[#EFF6FF] rounded-lg flex items-center justify-center mb-4"
                >
                  <step.icon className="w-6 h-6 sm:w-7 sm:h-7 text-[#2563EB]" />
                </motion.div>

                {/* Title */}
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 + 0.5, duration: 0.5 }}
                  className="text-xl sm:text-2xl font-semibold text-[#0F172A] mb-3"
                >
                  {step.title}
                </motion.h3>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 + 0.6, duration: 0.5 }}
                  className="text-sm sm:text-base text-[#475569] leading-relaxed"
                >
                  {step.description}
                </motion.p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
