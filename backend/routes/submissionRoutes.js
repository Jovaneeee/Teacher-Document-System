const express = require('express');
const router = express.Router();
const multer = require('multer');
const submissionController = require('../controllers/submissionController');
const { requireAdminAuth } = require('../middleware/authMiddleware');

// Configure multer for memory storage (to avoid saving files locally)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB limit
  }
});

// POST /api/submissions - Create a new document submission (public)
router.post('/', upload.single('file'), submissionController.createSubmission);

// GET /api/submissions/test-storage - Test storage bucket access (public for debugging)
router.get('/test-storage', submissionController.testStorageAccess);

// GET /api/submissions - Get all submissions (admin only)
router.get('/', requireAdminAuth, submissionController.getSubmissions);

// GET /api/submissions/:id/view - View submission with signed URL (admin only)
router.get('/:id/view', requireAdminAuth, submissionController.viewSubmission);

// GET /api/submissions/:id/download - Download submission (admin only)
router.get('/:id/download', requireAdminAuth, submissionController.downloadSubmission);

// PATCH /api/submissions/:id/status - Update submission status (admin only)
router.patch('/:id/status', requireAdminAuth, submissionController.updateSubmissionStatus);

// DELETE /api/submissions/:id - Delete submission (admin only)
router.delete('/:id', requireAdminAuth, submissionController.deleteSubmission);

module.exports = router;
