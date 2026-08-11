import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0F2A43]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 sm:py-16 lg:py-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 items-start">
            {/* Left - School Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-white/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-semibold text-base sm:text-lg leading-tight">
                    Document Submission Portal
                  </span>
                </div>
              </div>
              <p className="text-sm sm:text-base text-[#CBD5E1] leading-relaxed max-w-sm">
                A simple and secure portal for submitting required school
                documents.
              </p>
            </div>

            {/* Center - Quick Links */}
            <div className="space-y-6 pt-2 sm:pt-3">
              <h3 className="text-white font-semibold text-base sm:text-lg mb-4">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {[
                  { label: 'Home', href: '/' },
                  { label: 'Privacy Policy', href: '/privacy-policy' },
                  { label: 'Terms & Conditions', href: '/terms' },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm sm:text-base text-[#CBD5E1] hover:text-white hover:underline transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right - Help */}
            <div className="space-y-6 pt-2 sm:pt-3">
              <h3 className="text-white font-semibold text-base sm:text-lg mb-4">
                Need Help?
              </h3>
              <p className="text-sm sm:text-base text-[#CBD5E1] leading-relaxed">
                Contact your school administrator for assistance.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Footer Bar */}
        <div className="border-t border-white/10 py-6 sm:py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-[#CBD5E1]">
              © {currentYear} Document Submission Portal. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <Link
                to="/privacy-policy"
                className="text-sm text-[#CBD5E1] hover:text-white hover:underline transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-sm text-[#CBD5E1] hover:text-white hover:underline transition-colors duration-200"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
