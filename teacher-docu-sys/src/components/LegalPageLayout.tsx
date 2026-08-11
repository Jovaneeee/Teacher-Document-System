import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';

interface LegalPageLayoutProps {
  children: ReactNode;
  eyebrow: string;
  heading: string;
  supportingText: string;
  lastUpdated?: string;
  note?: string;
}

const LegalPageLayout = ({
  children,
  eyebrow,
  heading,
  supportingText,
  lastUpdated,
  note,
}: LegalPageLayoutProps) => {
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
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <section className="pt-24 sm:pt-32 lg:pt-40 pb-12 sm:pb-16 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="max-w-4xl"
            >
              <motion.div variants={itemVariants}>
                <span className="inline-block px-3 py-1.5 bg-[#EFF6FF] text-[#2563EB] text-xs sm:text-sm font-semibold rounded-full uppercase tracking-wider mb-4">
                  {eyebrow}
                </span>
              </motion.div>
              <motion.h1
                variants={itemVariants}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] leading-tight mb-4"
              >
                {heading}
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="text-base sm:text-lg text-[#475569] max-w-3xl"
              >
                {supportingText}
              </motion.p>
              {lastUpdated && (
                <motion.p
                  variants={itemVariants}
                  className="mt-4 text-sm text-[#475569]"
                >
                  Last Updated: {lastUpdated}
                </motion.p>
              )}
              {note && (
                <motion.div
                  variants={itemVariants}
                  className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                >
                  <p className="text-sm text-yellow-800">{note}</p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Page Content */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
              >
                {children}
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LegalPageLayout;
