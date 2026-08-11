type SubmissionStatus = 'Pending' | 'Reviewed';

export interface DashboardStat {
  value: number;
  label: string;
  description: string;
  icon: string;
}

export interface SubmissionActivity {
  month: string;
  submissions: number;
}

export interface DocumentType {
  name: string;
  count: number;
  color: string;
}

export interface Submission {
  id: string;
  teacher: string;
  documentType: string;
  submitted: string;
  status: SubmissionStatus;
  filename: string;
}

export interface DocumentRecord {
  id: string;
  filename: string;
  teacher: string;
  type: string;
  submitted: string;
  status: SubmissionStatus;
}

// Dashboard Statistics
export const dashboardStats: DashboardStat[] = [
  {
    value: 128,
    label: 'Total Submissions',
    description: 'All submitted documents',
    icon: 'Files',
  },
  {
    value: 14,
    label: 'Pending Review',
    description: 'Awaiting administrative review',
    icon: 'Clock',
  },
  {
    value: 114,
    label: 'Reviewed',
    description: 'Processed submissions',
    icon: 'CircleCheck',
  },
  {
    value: 12,
    label: 'This Week',
    description: 'New submissions',
    icon: 'TrendingUp',
  },
];

// Submission Activity Data (Bar Chart)
export const submissionActivityData: SubmissionActivity[] = [
  { month: 'June', submissions: 18 },
  { month: 'July', submissions: 24 },
  { month: 'August', submissions: 31 },
  { month: 'September', submissions: 20 },
  { month: 'October', submissions: 27 },
  { month: 'November', submissions: 32 },
];

// Document Type Data (Donut Chart)
export const documentTypeData: DocumentType[] = [
  { name: 'OBAS', count: 42, color: '#2563EB' },
  { name: 'Travel Authority (TO)', count: 31, color: '#0F2A43' },
  { name: 'Form 6 — Leave', count: 55, color: '#64748B' },
];

// Recent Submissions
export const recentSubmissions: Submission[] = [
  {
    id: '1',
    teacher: 'Maria Santos',
    documentType: 'Form 6 — Leave',
    submitted: 'Today, 9:42 AM',
    status: 'Pending',
    filename: 'Form6-Maria.pdf',
  },
  {
    id: '2',
    teacher: 'Juan Cruz',
    documentType: 'OBAS',
    submitted: 'Today, 8:15 AM',
    status: 'Reviewed',
    filename: 'OBAS-Juan.pdf',
  },
  {
    id: '3',
    teacher: 'Ana Reyes',
    documentType: 'Travel Authority (TO)',
    submitted: 'Yesterday, 4:20 PM',
    status: 'Pending',
    filename: 'TO-Ana.pdf',
  },
  {
    id: '4',
    teacher: 'Carlo Mendoza',
    documentType: 'Form 6 — Leave',
    submitted: 'Yesterday, 2:10 PM',
    status: 'Reviewed',
    filename: 'Form6-Carlo.pdf',
  },
  {
    id: '5',
    teacher: 'Sofia Garcia',
    documentType: 'OBAS',
    submitted: 'Aug 8, 2026',
    status: 'Reviewed',
    filename: 'OBAS-Sofia.pdf',
  },
];

// All Submissions
export const allSubmissions: Submission[] = [
  {
    id: '1',
    teacher: 'Maria Santos',
    documentType: 'Form 6 — Leave',
    submitted: 'Aug 11, 2026 · 9:42 AM',
    status: 'Pending',
    filename: 'Form6-Maria.pdf',
  },
  {
    id: '2',
    teacher: 'Juan Cruz',
    documentType: 'OBAS',
    submitted: 'Aug 11, 2026 · 8:15 AM',
    status: 'Reviewed',
    filename: 'OBAS-Juan.pdf',
  },
  {
    id: '3',
    teacher: 'Ana Reyes',
    documentType: 'Travel Authority (TO)',
    submitted: 'Aug 10, 2026 · 4:20 PM',
    status: 'Pending',
    filename: 'TO-Ana.pdf',
  },
  {
    id: '4',
    teacher: 'Carlo Mendoza',
    documentType: 'Form 6 — Leave',
    submitted: 'Aug 9, 2026 · 2:10 PM',
    status: 'Reviewed',
    filename: 'Form6-Carlo.pdf',
  },
  {
    id: '5',
    teacher: 'Sofia Garcia',
    documentType: 'OBAS',
    submitted: 'Aug 8, 2026',
    status: 'Reviewed',
    filename: 'OBAS-Sofia.pdf',
  },
];

// Document Records
export const documentRecords: DocumentRecord[] = [
  {
    id: '1',
    filename: 'Form6-Maria.pdf',
    teacher: 'Maria Santos',
    type: 'Form 6 — Leave',
    submitted: 'Aug 11, 2026',
    status: 'Pending',
  },
  {
    id: '2',
    filename: 'OBAS-Juan.pdf',
    teacher: 'Juan Cruz',
    type: 'OBAS',
    submitted: 'Aug 11, 2026',
    status: 'Reviewed',
  },
  {
    id: '3',
    filename: 'TO-Ana.pdf',
    teacher: 'Ana Reyes',
    type: 'Travel Authority (TO)',
    submitted: 'Aug 10, 2026',
    status: 'Pending',
  },
];

// Document Category Summary
export const documentCategories = [
  {
    name: 'OBAS',
    count: 42,
    description: 'Official Business / related submissions',
    icon: 'FileText',
  },
  {
    name: 'Travel Authority (TO)',
    count: 31,
    description: 'Travel authority submissions',
    icon: 'Plane',
  },
  {
    name: 'Form 6 — Leave',
    count: 55,
    description: 'Leave-related submissions',
    icon: 'CalendarDays',
  },
];
