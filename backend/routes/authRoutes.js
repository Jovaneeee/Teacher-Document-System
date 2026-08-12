const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAdminAuth } = require('../middleware/authMiddleware');
const { loginLimiter, forgotPasswordLimiter, authLimiter } = require('../middleware/rateLimiter');

// POST /api/auth/login - Admin login
router.post('/login', loginLimiter, authController.login);

// POST /api/auth/forgot-password - Request password reset
router.post('/forgot-password', forgotPasswordLimiter, authController.forgotPassword);

// POST /api/auth/change-password - Change password (requires authentication)
router.post('/change-password', authLimiter, requireAdminAuth, authController.changePassword);

// POST /api/auth/logout - Logout (requires authentication)
router.post('/logout', authLimiter, requireAdminAuth, authController.logout);

module.exports = router;
