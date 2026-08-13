const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const { requireAdminAuth } = require('../middleware/authMiddleware');

// GET /api/admin/dashboard - Get dashboard statistics (admin only)
router.get('/dashboard', requireAdminAuth, submissionController.getDashboardStats);

module.exports = router;
