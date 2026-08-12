export const DOCUMENT_TYPES = ['OBAS', 'TRAVEL_AUTHORITY', 'FORM_6'] as const;

export type DocumentTypeValue = (typeof DOCUMENT_TYPES)[number];

// Labels shown in the submission form (unchanged from the original UI copy)
export const DOCUMENT_TYPE_OPTIONS: { value: DocumentTypeValue; label: string }[] = [
  { value: 'OBAS', label: 'OBAS — Official Business Authorization Slip' },
  { value: 'TRAVEL_AUTHORITY', label: 'Travel Authority (TO)' },
  { value: 'FORM_6', label: 'Form 6 — Leave' },
];

// Shorter labels used in the admin tables and filters
export const DOCUMENT_TYPE_LABELS: Record<DocumentTypeValue, string> = {
  OBAS: 'OBAS',
  TRAVEL_AUTHORITY: 'Travel Authority (TO)',
  FORM_6: 'Form 6 — Leave',
};

export const isDocumentType = (value: string): value is DocumentTypeValue =>
  (DOCUMENT_TYPES as readonly string[]).includes(value);

export const formatDocumentType = (value: string): string =>
  isDocumentType(value) ? DOCUMENT_TYPE_LABELS[value] : value;

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export const ACCEPTED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
];
