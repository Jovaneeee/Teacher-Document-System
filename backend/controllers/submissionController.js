const supabase = require('../config/supabase');
const { v4: uuidv4 } = require('uuid');

// Valid document types
const VALID_DOCUMENT_TYPES = ['OBAS', 'TRAVEL_AUTHORITY', 'FORM_6'];

// Valid MIME types
const VALID_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

// Maximum file size (10 MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

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

module.exports = {
  createSubmission,
  testStorageAccess
};
