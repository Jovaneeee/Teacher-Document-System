import { motion } from 'framer-motion';
import LegalPageLayout from '../components/LegalPageLayout';

const PrivacyPolicy = () => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const sections = [
    {
      id: 'overview',
      title: '1. Overview',
      content: (
        <p className="text-[#475569] leading-relaxed">
          This Privacy Policy explains how information is handled in the Teacher
          Document Submission Portal. This portal is used by teachers and
          co-teachers to submit school-related documents to the designated
          administrator. The portal is intended to simplify document submission
          and organization for internal administrative purposes.
        </p>
      ),
    },
    {
      id: 'information-collected',
      title: '2. Information We Collect',
      content: (
        <div className="space-y-4">
          <p className="text-[#475569] leading-relaxed">
            When you submit a document through the portal, we may collect the
            following information:
          </p>
          <ul className="list-disc list-inside space-y-2 text-[#475569] ml-4">
            <li>Your full name</li>
            <li>The type of document you are submitting</li>
            <li>The uploaded document file</li>
            <li>The date and time of submission</li>
            <li>Any additional remarks you choose to provide</li>
          </ul>
          <p className="text-[#475569] leading-relaxed">
            This information is collected only to identify the submitting
            teacher and to properly organize and process the document.
          </p>
        </div>
      ),
    },
    {
      id: 'documents-submitted',
      title: '3. Documents Submitted Through the Portal',
      content: (
        <div className="space-y-4">
          <p className="text-[#475569] leading-relaxed">
            The portal supports the submission of the following document types:
          </p>
          <ul className="list-disc list-inside space-y-2 text-[#475569] ml-4">
            <li>OBAS — Official Business Authorization Slip</li>
            <li>Travel Authority (TO)</li>
            <li>Form 6 — Leave</li>
          </ul>
          <p className="text-[#475569] leading-relaxed">
            These documents are submitted for internal administrative purposes
            and may contain personal or employment-related information.
          </p>
        </div>
      ),
    },
    {
      id: 'purpose-collection',
      title: '4. Purpose of Collection',
      content: (
        <div className="space-y-4">
          <p className="text-[#475569] leading-relaxed">
            The information and documents submitted through the portal are
            collected for the following purposes:
          </p>
          <ul className="list-disc list-inside space-y-2 text-[#475569] ml-4">
            <li>To receive and organize school-related documents</li>
            <li>To identify which teacher submitted each document</li>
            <li>To facilitate administrative review and processing</li>
            <li>To maintain an organized record of submissions</li>
          </ul>
          <p className="text-[#475569] leading-relaxed">
            Information is not collected for marketing, advertising, or any
            purpose unrelated to the document submission function.
          </p>
        </div>
      ),
    },
    {
      id: 'access-information',
      title: '5. Access to Submitted Information',
      content: (
        <p className="text-[#475569] leading-relaxed">
          Submitted documents and related information are intended to be
          accessed only by the designated administrator or other personnel who
          are authorized by the school or office. You should not submit
          documents belonging to another person unless you are authorized to
          do so. Information should not be shared with unauthorized individuals.
        </p>
      ),
    },
    {
      id: 'protection-documents',
      title: '6. Protection of Documents',
      content: (
        <p className="text-[#475569] leading-relaxed">
          The administrator will take reasonable measures to protect submitted
          documents from unauthorized access. However, no system can guarantee
          complete security. You should avoid including unnecessary sensitive
          information in your submissions unless required.
        </p>
      ),
    },
    {
      id: 'data-retention',
      title: '7. Data Retention',
      content: (
        <p className="text-[#475569] leading-relaxed">
          Submitted documents and information may be retained only as long as
          necessary for the intended administrative purpose or according to
          applicable school or office practices.{' '}
          <span className="font-medium text-[#0F172A]">
            [Insert applicable retention period or practice]
          </span>
        </p>
      ),
    },
    {
      id: 'teacher-rights',
      title: '8. Teacher Rights and Requests',
      content: (
        <p className="text-[#475569] leading-relaxed">
          If you have questions or concerns about your submitted information,
          or if you wish to request access to or correction of your information,
          please contact the administrator. The administrator will respond to
          reasonable requests in accordance with applicable school or office
          procedures.
        </p>
      ),
    },
    {
      id: 'policy-updates',
      title: '9. Changes to This Privacy Policy',
      content: (
        <p className="text-[#475569] leading-relaxed">
          This Privacy Policy may be updated when necessary to reflect changes
          in the portal's operation or applicable requirements. Teachers will
          be notified of significant changes through appropriate means.
        </p>
      ),
    }
  ];

  return (
    <LegalPageLayout
      eyebrow="Privacy & Data Protection"
      heading="Privacy Policy"
      supportingText="Learn how information submitted through the Teacher Document Submission Portal is collected, used, protected, and managed."
    >
      {sections.map((section) => (
        <motion.div
          key={section.id}
          variants={itemVariants}
          className="mb-12 last:mb-0"
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-[#0F172A] mb-4">
            {section.title}
          </h2>
          <div className="text-base sm:text-lg">{section.content}</div>
        </motion.div>
      ))}
    </LegalPageLayout>
  );
};

export default PrivacyPolicy;
