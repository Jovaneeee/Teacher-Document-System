import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import SubmissionFilters from '../components/admin/SubmissionFilters';
import SubmissionTable from '../components/admin/SubmissionTable';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';

const Submissions = () => {
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    documentType: 'all',
    dateRange: 'all'
  });

  useEffect(() => {
    fetchSubmissions();
  }, [filters]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const params = new URLSearchParams();
      if (filters.status !== 'all') params.append('status', filters.status);
      if (filters.documentType !== 'all') params.append('document_type', filters.documentType);
      if (filters.dateRange !== 'all') params.append('date_range', filters.dateRange);
      if (filters.search.trim()) params.append('search', filters.search.trim());

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/submissions?${params.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (data.success) {
        setSubmissions(data.data);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: {
    search: string;
    status: string;
    documentType: string;
    dateRange: string;
  }) => {
    setFilters(newFilters);
  };

  // Format date to Philippine Time (date only, no time)
  const formatDateToPH = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-PH', {
      timeZone: 'Asia/Manila',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  // Format document type for display
  const formatDocumentType = (type: string) => {
    if (type === 'OBAS') return 'OBAS';
    if (type === 'TRAVEL_AUTHORITY') return 'Travel Authority (TO)';
    if (type === 'FORM_6') return 'Form 6 — Leave';
    return type;
  };

  // Get filter period label
  const getFilterPeriodLabel = () => {
    if (filters.dateRange === 'all') return 'All Time';
    if (filters.dateRange === 'today') return 'Today';
    if (filters.dateRange === 'this_week') return 'This Week';
    if (filters.dateRange === 'this_month') return 'This Month';
    if (filters.dateRange === 'last_month') return 'Last Month';
    if (filters.dateRange === 'this_year') return 'This Year';
    return filters.dateRange;
  };

  // PDF Styles
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#FFFFFF',
      padding: 50,
      paddingBottom: 70,
    },
    headerContainer: {
      marginBottom: 30,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginTop: 10,
    },
    headerLeft: {
      flex: 1,
    },
    headerRight: {
      flex: 1,
      alignItems: 'flex-end',
    },
    systemName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#0F172A',
      marginBottom: 5,
      textAlign: 'center',
    },
    periodLabel: {
      fontSize: 12,
      color: '#64748B',
    },
    generatedLabel: {
      fontSize: 12,
      color: '#64748B',
      textAlign: 'right',
    },
    tableHeader: {
      flexDirection: 'row',
      backgroundColor: '#1E293B',
      paddingVertical: 12,
      paddingHorizontal: 15,
    },
    tableRow: {
      flexDirection: 'row',
      paddingVertical: 12,
      paddingHorizontal: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#E2E8F0',
    },
    tableRowEven: {
      backgroundColor: '#F8FAFC',
    },
    colName: {
      flex: 3,
      fontSize: 11,
      color: '#0F172A',
      fontWeight: '500',
    },
    colDocType: {
      flex: 2,
      fontSize: 11,
      color: '#475569',
    },
    headerText: {
      fontSize: 11,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    emptyText: {
      fontSize: 12,
      color: '#64748B',
      textAlign: 'center',
      marginTop: 60,
    },
    footer: {
      position: 'absolute',
      bottom: 40,
      left: 50,
      right: 50,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: '#E2E8F0',
      paddingTop: 15,
    },
    footerText: {
      fontSize: 9,
      color: '#64748B',
    },
    pageNumber: {
      fontSize: 9,
      color: '#64748B',
    },
  });

  // PDF Document Component
  const SubmissionPDF = () => {
    const generatedDate = formatDateToPH(new Date().toISOString());
    const submissionsPerPage = 25;

    // Group submissions into pages
    const pages = [];
    for (let i = 0; i < submissions.length; i += submissionsPerPage) {
      pages.push(submissions.slice(i, i + submissionsPerPage));
    }

    if (submissions.length === 0) {
      return (
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={styles.headerContainer}>
              <Text style={styles.systemName}>HRIS Document Approval System</Text>
              <View style={styles.headerRow}>
                <View style={styles.headerLeft}>
                  <Text style={styles.periodLabel}>Period: {getFilterPeriodLabel()}</Text>
                </View>
                <View style={styles.headerRight}>
                  <Text style={styles.generatedLabel}>Generated: {generatedDate}</Text>
                </View>
              </View>
            </View>
            <Text style={styles.emptyText}>No submissions to export.</Text>
            <View style={styles.footer} fixed>
              <Text style={styles.footerText}>HRIS Document Approval System</Text>
              <Text style={styles.pageNumber} render={({ pageNumber }) => `Page ${pageNumber}`} />
            </View>
          </Page>
        </Document>
      );
    }

    return (
      <Document>
        {pages.map((pageSubmissions, pageIndex) => (
          <Page key={`page-${pageIndex}`} size="A4" style={styles.page}>
            <View style={styles.headerContainer}>
              <Text style={styles.systemName}>HRIS Document Approval System</Text>
              <View style={styles.headerRow}>
                <View style={styles.headerLeft}>
                  <Text style={styles.periodLabel}>Period: {getFilterPeriodLabel()}</Text>
                </View>
                <View style={styles.headerRight}>
                  <Text style={styles.generatedLabel}>Generated: {generatedDate}</Text>
                </View>
              </View>
            </View>

            <View style={styles.tableHeader}>
              <Text style={[styles.colName, styles.headerText]}>Employee</Text>
              <Text style={[styles.colDocType, styles.headerText]}>Document Type</Text>
            </View>

            {pageSubmissions.map((submission, rowIndex) => (
              <View key={submission.id} style={rowIndex % 2 === 0 ? [styles.tableRow, styles.tableRowEven] : styles.tableRow}>
                <Text style={styles.colName}>{submission.teacher}</Text>
                <Text style={styles.colDocType}>{formatDocumentType(submission.type)}</Text>
              </View>
            ))}

            <View style={styles.footer} fixed>
              <Text style={styles.footerText}>HRIS Document Approval System</Text>
              <Text style={styles.pageNumber} render={({ pageNumber }) => `Page ${pageNumber}`} />
            </View>
          </Page>
        ))}
      </Document>
    );
  };

  const handleExport = async () => {
    console.log('Export button clicked');
    console.log('Submissions:', submissions);
    console.log('Submissions length:', submissions.length);

    if (submissions.length === 0) {
      alert('No submissions to export.');
      return;
    }

    try {
      console.log('Starting PDF generation...');
      const doc = <SubmissionPDF />;
      console.log('PDF document created:', doc);

      const pdfInstance = pdf(doc);
      console.log('PDF instance created:', pdfInstance);

      const blob = await pdfInstance.toBlob();
      console.log('PDF blob created:', blob);
      console.log('Blob size:', blob.size);

      const url = URL.createObjectURL(blob);
      console.log('Download URL created:', url);

      const link = document.createElement('a');
      link.href = url;
      link.download = `submissions_report_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log('PDF download triggered');
    } catch (error) {
      console.error('Error generating PDF:', error);
      console.error('Error details:', error instanceof Error ? error.message : error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
      alert('Failed to generate PDF. Check console for details.');
    }
  };

  return (
    <AdminLayout title="Submissions" subtitle="HRIS Document Approval System">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-semibold text-[#0F172A] mb-2">
              Submissions
            </h1>
            <p className="text-[#475569]">
              Review and manage documents submitted by teachers.
            </p>
          </div>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-[#0F172A] hover:bg-slate-50 transition-colors duration-200"
          >
            Export
          </button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <SubmissionFilters onFiltersChange={handleFiltersChange} />
      </motion.div>

      {/* Submission Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {loading ? (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <p className="text-sm text-[#64748B] text-center">Loading submissions...</p>
          </div>
        ) : (
          <SubmissionTable submissions={submissions} onRefresh={fetchSubmissions} />
        )}
      </motion.div>
    </AdminLayout>
  );
};

export default Submissions;
