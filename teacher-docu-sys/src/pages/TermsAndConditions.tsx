import { motion } from 'framer-motion';
import LegalPageLayout from '../components/LegalPageLayout';

const TermsAndConditions = () => {
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
      id: 'purpose',
      title: '1. Purpose of the Portal',
      content: (
        <p className="text-[#475569] leading-relaxed">
          The Teacher Document Submission Portal is provided to simplify the
          submission and organization of school-related documents. The portal
          allows teachers and co-teachers to submit documents to the designated
          administrator for internal administrative purposes.
        </p>
      ),
    },
    {
      id: 'who-may-use',
      title: '2. Who May Use the Portal',
      content: (
        <p className="text-[#475569] leading-relaxed">
          The portal is intended for use by teachers and co-teachers who are
          authorized to submit school-related documents. Access to the portal is
          granted by the school or office administration.
        </p>
      ),
    },
    {
      id: 'appropriate-use',
      title: '3. Appropriate Use',
      content: (
        <p className="text-[#475569] leading-relaxed">
          The portal should be used only for its intended purpose: submitting
          school-related documents for administrative review and processing.
          Users should use the portal responsibly and in accordance with
          applicable school or office policies.
        </p>
      ),
    },
    {
      id: 'accuracy',
      title: '4. Accuracy of Submitted Information',
      content: (
        <p className="text-[#475569] leading-relaxed">
          When submitting documents, you are responsible for providing accurate
          and complete information. Please ensure that the information you
          provide is correct and that you are submitting the appropriate
          document type.
        </p>
      ),
    },
    {
      id: 'document-submission',
      title: '5. Document Submission',
      content: (
        <div className="space-y-4">
          <p className="text-[#475569] leading-relaxed">
            You should submit only documents that you are authorized to submit.
            When using the portal:
          </p>
          <ul className="list-disc list-inside space-y-2 text-[#475569] ml-4">
            <li>Submit only documents that belong to you or that you are authorized to submit</li>
            <li>Ensure the document is relevant to the administrative purpose</li>
            <li>Verify that you are selecting the correct document type</li>
            <li>Do not upload files that contain malicious or harmful content</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'document-types',
      title: '6. Supported Document Types',
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
            and will be reviewed by the designated administrator.
          </p>
        </div>
      ),
    },
    {
      id: 'file-requirements',
      title: '7. File Requirements',
      content: (
        <div className="space-y-4">
          <p className="text-[#475569] leading-relaxed">
            To ensure smooth processing, submitted files must meet the following
            requirements:
          </p>
          <div className="bg-[#F8FAFC] p-4 rounded-lg border border-slate-200">
            <p className="text-[#475569]">
              <span className="font-medium text-[#0F172A]">Accepted formats:</span>{' '}
              PDF, JPG, JPEG, PNG
              <br />
              <span className="font-medium text-[#0F172A]">
                Maximum file size:
              </span>{' '}
              10 MB
            </p>
          </div>
          <p className="text-[#475569] leading-relaxed">
            Files that do not meet these requirements may not be accepted by the
            system.
          </p>
        </div>
      ),
    },
    {
      id: 'confidentiality',
      title: '8. Confidentiality and Appropriate Access',
      content: (
        <p className="text-[#475569] leading-relaxed">
          Submitted documents and related information are intended to be
          accessed only by the designated administrator or other authorized
          personnel. You should not share private submission information with
          unauthorized individuals or attempt to access another teacher's
          submissions.
        </p>
      ),
    },
    {
      id: 'administrative-review',
      title: '9. Administrative Review',
      content: (
        <p className="text-[#475569] leading-relaxed">
          Submitted documents will be reviewed by the designated administrator
          or other authorized personnel. The review process and approval
          timelines are determined by applicable school or office procedures.
        </p>
      ),
    },
    {
      id: 'leave-travel',
      title: '10. Leave and Travel Approval',
      content: (
        <p className="text-[#475569] leading-relaxed">
          <span className="font-medium text-[#0F172A]">Important:</span> Submitting
          a document through this portal does not automatically mean that a
          request, leave, travel authority, or other document has been approved.
          Approval remains subject to the applicable school or office procedures
          and the authorized personnel responsible for reviewing the submission.
        </p>
      ),
    },
    {
      id: 'prohibited',
      title: '11. Prohibited Activities',
      content: (
        <div className="space-y-4">
          <p className="text-[#475569] leading-relaxed">
            When using the portal, you should not:
          </p>
          <ul className="list-disc list-inside space-y-2 text-[#475569] ml-4">
            <li>Submit false or misleading information</li>
            <li>Upload documents you are not authorized to submit</li>
            <li>Attempt to access another teacher's submissions</li>
            <li>Share private submission information without authorization</li>
            <li>Attempt to interfere with the operation of the portal</li>
            <li>Upload malicious or harmful files</li>
            <li>Use the portal for purposes unrelated to its intended administrative function</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'availability',
      title: '12. Portal Availability',
      content: (
        <p className="text-[#475569] leading-relaxed">
          The portal may be temporarily unavailable for maintenance, updates, or
          operational reasons. The school or office does not guarantee
          uninterrupted availability of the portal.
        </p>
      ),
    },
    {
      id: 'changes',
      title: '13. Changes to the Terms',
      content: (
        <p className="text-[#475569] leading-relaxed">
          These Terms and Conditions may be updated when necessary to reflect
          changes in the portal's operation or applicable requirements. Teachers
          will be notified of significant changes through appropriate means.
        </p>
      ),
    }
  ];

  return (
    <LegalPageLayout
      eyebrow="Portal Guidelines"
      heading="Terms & Conditions"
      supportingText="Please review these terms before using the Teacher Document Submission Portal."
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

export default TermsAndConditions;
