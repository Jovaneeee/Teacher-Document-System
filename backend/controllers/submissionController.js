const { supabase } = require('../config/supabase');
const { v4: uuidv4 } = require('uuid');

// Valid document types
const VALID_DOCUMENT_TYPES = ['OBAS', 'TRAVEL_AUTHORITY', 'FORM_6'];

// Valid MIME types
const VALID_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

// Maximum file size (10 MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Valid statuses
const VALID_STATUSES = ['pending', 'reviewed', 'rejected'];

/**
 * Create a safe filename by removing special characters
 */
const createSafeFileName = (originalName) => {
  return originalName
    .replace(/[^a-zA-Z0-9.\-_]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_+|_+$/g, '');
};

/**
 * Handle document submission
 */
const createSubmission = async (req, res) => {
  console.log('=== SUBMISSION REQUEST START ===');
  console.log('Request body keys:', Object.keys(req.body));
  console.log('Request file:', req.file ? 'File present' : 'No file');

  try {
    const { teacher_name, document_type } = req.body;
    const file = req.file;

    console.log('teacher_name:', teacher_name);
    console.log('document_type:', document_type);

    // Server-side validation
    const errors = {};

    // Validate teacher_name
    if (!teacher_name || !teacher_name.trim()) {
      errors.teacher_name = 'Teacher name is required';
    }

    // Validate document_type
    if (!document_type) {
      errors.document_type = 'Document type is required';
    } else if (!VALID_DOCUMENT_TYPES.includes(document_type)) {
      errors.document_type = 'Invalid document type. Must be one of: OBAS, TRAVEL_AUTHORITY, FORM_6';
    }

    // Validate file
    if (!file) {
      errors.file = 'File is required';
    } else {
      console.log('File details:');
      console.log('- originalname:', file.originalname);
      console.log('- mimetype:', file.mimetype);
      console.log('- size:', file.size);
      console.log('- buffer length:', file.buffer ? file.buffer.length : 'No buffer');

      // Validate MIME type
      if (!VALID_MIME_TYPES.includes(file.mimetype)) {
        errors.file = 'Invalid file type. Only PDF, JPEG, and PNG are allowed';
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        errors.file = 'File size exceeds 10 MB limit';
      }
    }

    // Return errors if validation fails
    if (Object.keys(errors).length > 0) {
      console.log('Validation errors:', errors);
      return res.status(400).json({
        success: false,
        errors
      });
    }

    console.log('Validation passed');

    // Generate unique storage path
    const submissionId = uuidv4();
    const safeFileName = createSafeFileName(file.originalname);
    const storagePath = `submissions/${submissionId}/${safeFileName}`;

    console.log('Attempting upload to bucket: teacher-document');
    console.log('Storage path:', storagePath);
    console.log('File size:', file.size);
    console.log('File MIME type:', file.mimetype);

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('teacher-document')
      .upload(storagePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (uploadError) {
      console.error('=== STORAGE UPLOAD ERROR ===');
      console.error('Error message:', uploadError.message);
      console.error('Error name:', uploadError.name);
      console.error('Error status:', uploadError.statusCode || uploadError.status);
      console.error('Bucket name: teacher-document');
      console.error('Storage path:', storagePath);
      console.error('File MIME type:', file.mimetype);
      console.error('File size:', file.size);
      console.error('Error details:', JSON.stringify(uploadError, null, 2));
      return res.status(500).json({
        success: false,
        error: 'Failed to upload file to storage',
        details: uploadError.message
      });
    }

    // Insert metadata into submissions table
    console.log('Inserting metadata into submissions table...');
    const { data: insertData, error: insertError } = await supabase
      .from('submissions')
      .insert({
        teacher_name: teacher_name.trim(),
        document_type,
        original_file_name: file.originalname,
        storage_path: storagePath,
        file_type: file.mimetype,
        file_size: file.size,
        status: 'pending'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insertion error:', insertError);
      console.error('Database insertion error details:', JSON.stringify(insertError, null, 2));

      // Clean up the uploaded file to prevent orphan files
      console.log('Cleaning up orphan file from storage...');
      const { error: deleteError } = await supabase.storage
        .from('teacher-document')
        .remove([storagePath]);

      if (deleteError) {
        console.error('Failed to clean up orphan file:', deleteError);
      }

      return res.status(500).json({
        success: false,
        error: 'Failed to save submission metadata',
        details: insertError.message
      });
    }

    // Return success response
    res.status(201).json({
      success: true,
      data: {
        id: insertData.id,
        teacher_name: insertData.teacher_name,
        document_type: insertData.document_type,
        status: insertData.status,
        created_at: insertData.created_at
      }
    });

  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({
      success: false,
      error: 'An unexpected error occurred during submission'
    });
  }
};

/**
 * Test storage bucket access
 */
const testStorageAccess = async (req, res) => {
  try {
    console.log('Testing storage access...');

    // List buckets to check if teacher-documents exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
      return res.status(500).json({
        success: false,
        error: 'Failed to list storage buckets',
        details: bucketsError.message
      });
    }

    console.log('Available buckets:', buckets.map(b => b.name));

    const teacherDocsBucket = buckets.find(b => b.name === 'teacher-document');

    if (!teacherDocsBucket) {
      return res.status(404).json({
        success: false,
        error: 'Bucket "teacher-document" does not exist',
        availableBuckets: buckets.map(b => b.name)
      });
    }

    // Try to list files in the bucket
    const { data: files, error: filesError } = await supabase.storage
      .from('teacher-document')
      .list('', { limit: 1 });

    if (filesError) {
      console.error('Error listing files in bucket:', filesError);
      return res.status(500).json({
        success: false,
        error: 'Bucket exists but cannot access files',
        details: filesError.message
      });
    }

    res.json({
      success: true,
      message: 'Storage bucket "teacher-documents" is accessible',
      bucketInfo: {
        name: teacherDocsBucket.name,
        id: teacherDocsBucket.id,
        public: teacherDocsBucket.public
      },
      fileCount: files.length
    });

  } catch (error) {
    console.error('Storage test error:', error);
    res.status(500).json({
      success: false,
      error: 'Unexpected error during storage test',
      details: error.message
    });
  }
};

/**
 * Get dashboard statistics
 */
const getDashboardStats = async (req, res) => {
  try {
    console.log('=== DASHBOARD STATS REQUEST ===');
    console.log('User:', req.user);

    // Clear any auth context to ensure service role is used
    await supabase.auth.signOut();

    // Get document type counts
    const { data: typeData, error: typeError } = await supabase
      .from('submissions')
      .select('document_type');

    if (typeError) {
      console.error('Error fetching type data:', typeError);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch document type statistics'
      });
    }

    const typeCounts = {
      OBAS: typeData.filter(t => t.document_type === 'OBAS').length,
      TRAVEL_AUTHORITY: typeData.filter(t => t.document_type === 'TRAVEL_AUTHORITY').length,
      FORM_6: typeData.filter(t => t.document_type === 'FORM_6').length
    };

    // Get total submissions by status
    const { data: statusData, error: statusError } = await supabase
      .from('submissions')
      .select('status');

    if (statusError) {
      console.error('Error fetching status data:', statusError);
      console.error('Error code:', statusError.code);
      console.error('Error message:', statusError.message);
      console.error('Error hint:', statusError.hint);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch dashboard statistics',
        details: statusError.message
      });
    }

    const stats = {
      total: statusData.length,
      pending: statusData.filter(s => s.status === 'pending').length,
      reviewed: statusData.filter(s => s.status === 'reviewed').length,
      rejected: statusData.filter(s => s.status === 'rejected').length
    };

    // Get recent submissions (last 5)
    const { data: recentData, error: recentError } = await supabase
      .from('submissions')
      .select('id, teacher_name, document_type, status, original_file_name, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    if (recentError) {
      console.error('Error fetching recent submissions:', recentError);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch recent submissions'
      });
    }

    res.json({
      success: true,
      data: {
        stats,
        typeCounts,
        recentSubmissions: recentData.map(s => ({
          id: s.id,
          teacher: s.teacher_name,
          documentType: s.document_type,
          status: s.status,
          filename: s.original_file_name,
          submitted: s.created_at ? new Date(s.created_at).toLocaleString() : 'Unknown time',
          createdAt: s.created_at
        }))
      }
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while fetching dashboard statistics'
    });
  }
};

/**
 * Get all submissions with optional filters
 */
const getSubmissions = async (req, res) => {
  try {
    const { status, document_type, date_range, search } = req.query;

    console.log('=== GET SUBMISSIONS REQUEST ===');
    console.log('Filters:', { status, document_type, date_range, search });

    // Clear any auth context to ensure service role is used
    await supabase.auth.signOut();

    let query = supabase
      .from('submissions')
      .select('id, teacher_name, document_type, original_file_name, file_type, file_size, status, created_at');

    // Apply status filter
    if (status && status !== 'all') {
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid status value'
        });
      }
      query = query.eq('status', status);
    }

    // Apply document type filter
    if (document_type && document_type !== 'all') {
      if (!VALID_DOCUMENT_TYPES.includes(document_type)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid document type value'
        });
      }
      query = query.eq('document_type', document_type);
    }

    // Apply date range filter
    if (date_range && date_range !== 'all') {
      const now = new Date();
      let startDate = null;
      let endDate = null;

      if (date_range === 'today') {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      } else if (date_range === 'this_week') {
        const dayOfWeek = now.getDay();
        const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        startDate = new Date(now.getFullYear(), now.getMonth(), diff);
      } else if (date_range === 'this_month') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      } else if (date_range === 'last_month') {
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 1);
      } else if (date_range === 'this_year') {
        startDate = new Date(now.getFullYear(), 0, 1);
      } else {
        return res.status(400).json({
          success: false,
          error: 'Invalid date range value'
        });
      }

      if (startDate) {
        query = query.gte('created_at', startDate.toISOString());
      }

      if (endDate) {
        query = query.lt('created_at', endDate.toISOString());
      }
    }

    // Apply search filter (teacher name or filename)
    if (search && search.trim()) {
      const searchTerm = search.trim();
      query = query.or(`teacher_name.ilike.%${searchTerm}%,original_file_name.ilike.%${searchTerm}%`);
    }

    // Order by created_at descending
    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching submissions:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch submissions'
      });
    }

    res.json({
      success: true,
      data: data.map(s => ({
        id: s.id,
        filename: s.original_file_name,
        teacher: s.teacher_name,
        type: s.document_type,
        submitted: new Date(s.created_at).toLocaleDateString(),
        status: s.status,
        fileType: s.file_type,
        fileSize: s.file_size
      }))
    });

  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while fetching submissions'
    });
  }
};

/**
 * View a submission (generate signed URL and mark as reviewed)
 */
const viewSubmission = async (req, res) => {
  try {
    const { id } = req.params;

    // Clear any auth context to ensure service role is used
    await supabase.auth.signOut();

    // Get submission
    const { data: submission, error: fetchError } = await supabase
      .from('submissions')
      .select('storage_path, original_file_name, status')
      .eq('id', id)
      .single();

    if (fetchError || !submission) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found'
      });
    }

    // Generate signed URL (expires in 5 minutes)
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('teacher-document')
      .createSignedUrl(submission.storage_path, 300);

    if (signedUrlError) {
      console.error('Error generating signed URL:', signedUrlError);
      return res.status(500).json({
        success: false,
        error: 'Failed to generate document URL'
      });
    }

    // Mark as reviewed if currently pending
    if (submission.status === 'pending') {
      const { error: updateError } = await supabase
        .from('submissions')
        .update({ status: 'reviewed' })
        .eq('id', id);

      if (updateError) {
        console.error('Error updating status:', updateError);
        return res.status(500).json({
          success: false,
          error: 'Failed to update submission status'
        });
      }
    }

    res.json({
      success: true,
      url: signedUrlData.signedUrl,
      filename: submission.original_file_name
    });

  } catch (error) {
    console.error('View submission error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while viewing the submission'
    });
  }
};

/**
 * Download a submission
 */
const downloadSubmission = async (req, res) => {
  try {
    const { id } = req.params;

    // Clear any auth context to ensure service role is used
    await supabase.auth.signOut();

    // Get submission
    const { data: submission, error: fetchError } = await supabase
      .from('submissions')
      .select('storage_path, original_file_name')
      .eq('id', id)
      .single();

    if (fetchError || !submission) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found'
      });
    }

    // Generate signed URL (expires in 5 minutes)
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('teacher-document')
      .createSignedUrl(submission.storage_path, 300);

    if (signedUrlError) {
      console.error('Error generating signed URL:', signedUrlError);
      return res.status(500).json({
        success: false,
        error: 'Failed to generate download URL'
      });
    }

    res.json({
      success: true,
      url: signedUrlData.signedUrl,
      filename: submission.original_file_name
    });

  } catch (error) {
    console.error('Download submission error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while preparing the download'
    });
  }
};

/**
 * Update submission status
 */
const updateSubmissionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be one of: pending, reviewed, rejected'
      });
    }

    // Clear any auth context to ensure service role is used
    await supabase.auth.signOut();

    // Update status
    const { data, error } = await supabase
      .from('submissions')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      console.error('Error updating status:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to update submission status'
      });
    }

    res.json({
      success: true,
      data: {
        id: data.id,
        status: data.status
      }
    });

  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while updating the status'
    });
  }
};

/**
 * Delete a submission
 */
const deleteSubmission = async (req, res) => {
  try {
    const { id } = req.params;

    // Clear any auth context to ensure service role is used
    await supabase.auth.signOut();

    // Get submission to retrieve storage path
    const { data: submission, error: fetchError } = await supabase
      .from('submissions')
      .select('storage_path')
      .eq('id', id)
      .single();

    if (fetchError || !submission) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found'
      });
    }

    // Delete file from storage
    const { error: storageError } = await supabase.storage
      .from('teacher-document')
      .remove([submission.storage_path]);

    if (storageError) {
      console.error('Error deleting file from storage:', storageError);
      return res.status(500).json({
        success: false,
        error: 'Failed to delete file from storage'
      });
    }

    // Delete submission record from database
    const { error: deleteError } = await supabase
      .from('submissions')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting submission:', deleteError);
      return res.status(500).json({
        success: false,
        error: 'Failed to delete submission'
      });
    }

    res.json({
      success: true,
      message: 'Submission deleted successfully'
    });

  } catch (error) {
    console.error('Delete submission error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while deleting the submission'
    });
  }
};

module.exports = {
  createSubmission,
  testStorageAccess,
  getDashboardStats,
  getSubmissions,
  viewSubmission,
  downloadSubmission,
  updateSubmissionStatus,
  deleteSubmission
};