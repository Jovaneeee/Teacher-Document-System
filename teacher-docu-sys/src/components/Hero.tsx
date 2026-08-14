import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import image from '../assets/image.png';
const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const visualVariants = {
    hidden: { opacity: 0, x: 50, scale: 0.95 },
    visible: { opacity: 1, x: 0, scale: 1 },
  };

  return (
    <section className="pt-24 sm:pt-32 lg:pt-40 pb-16 sm:pb-24 lg:pb-32 bg-[#F8FAFC] min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.15, delayChildren: 0.2 }}
            className="space-y-6 sm:space-y-8"
          >
            <motion.div variants={itemVariants} transition={{ duration: 0.8 }}>
              <span className="inline-block px-3 py-1.5 bg-[#EFF6FF] text-[#2563EB] text-xs sm:text-sm font-semibold rounded-full uppercase tracking-wider">
                Impasug-ong National High School - Senior High School
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              transition={{ duration: 0.8 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0F172A] leading-tight tracking-tight"
            >
              One place for every
              <br />
              <span className="text-[#0F2A43]">required document.</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              transition={{ duration: 0.8 }}
              className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-xl"
            >
              Submit school documents securely and conveniently through a simple
              digital portal designed for teachers.
            </motion.p>

            <motion.div
              variants={itemVariants}
              transition={{ duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 pt-2"
            >
              <motion.a
                href="#submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center px-6 py-3 bg-[#0F2A43] hover:bg-[#0a1f33] text-white font-semibold rounded-lg transition-colors duration-200 text-base sm:text-lg"
              >
                Submit a Document
                <Send className="ml-2 w-5 h-5" />
              </motion.a>
              <motion.a
                href="/privacy-policy"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center px-6 py-3 bg-white hover:bg-slate-50 text-[#0F172A] font-semibold rounded-lg border border-slate-200 transition-colors duration-200 text-base sm:text-lg"
              >
                Learn About Privacy
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right Side - Hero Image */}
          <motion.div
            variants={visualVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 1, delay: 0.3 }}
            className="relative"
          >
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-lg border border-slate-200 max-w-md mx-auto lg:mx-auto">
              <img
                src={image}
                alt="Teacher working with documents"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F2A43]/60 to-transparent" />
              
              {/* Image overlay text */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="text-white"
                >
                </motion.div>
              </div>
            </div>

            {/* Subtle decorative elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.4, scale: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="absolute -top-6 -right-6 w-32 h-32 bg-[#EFF6FF] rounded-full blur-3xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.3, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="absolute -bottom-8 -left-8 w-40 h-40 bg-[#EFF6FF] rounded-full blur-3xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
