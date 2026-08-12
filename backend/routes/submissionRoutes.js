const express = require('express');
const multer = require('multer');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const { requireAdminAuth } = require('../middleware/authMiddleware');
const { authLimiter, submissionLimiter } = require('../middleware/rateLimiter');

// Files are kept in memory only; they are streamed to private Supabase Storage and never written to disk
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: submissionController.MAX_UPLOAD_BYTES,
    files: 1
  }
});

// Translate multer errors into the same response shape used across the API
const handleUpload = (req, res, next) => {
  upload.single('file')(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
          success: false,
          message: `File size exceeds the ${Math.floor(submissionController.MAX_UPLOAD_BYTES / (1024 * 1024))} MB limit.`
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Invalid file upload.'
      });
    }

    if (error) {
      console.error('Upload error:', error.message);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while receiving your document.'
      });
    }

    next();
  });
};

// POST /api/submissions - Teacher document submission (no authentication required)
router.post('/', submissionLimiter, handleUpload, submissionController.createSubmission);

// GET /api/submissions - List submissions (administrators only)
router.get('/', authLimiter, requireAdminAuth, submissionController.listSubmissions);

// GET /api/submissions/:id/file - Short-lived signed URL for a document (administrators only)
router.get('/:id/file', authLimiter, requireAdminAuth, submissionController.getSubmissionFileUrl);

module.exports = router;
