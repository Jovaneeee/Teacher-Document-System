const express = require('express');
const router = express.Router();
const multer = require('multer');
const submissionController = require('../controllers/submissionController');

// Configure multer for memory storage (to avoid saving files locally)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB limit
  }
});

// GET /api/submissions - Simple test
router.get('/', (req, res) => {
  res.json({ message: 'Submissions route is working' });
});

// POST /api/submissions - Create a new document submission
router.post('/', upload.single('file'), submissionController.createSubmission);

// GET /api/submissions/test-storage - Test storage bucket access
router.get('/test-storage', submissionController.testStorageAccess);

module.exports = router;
