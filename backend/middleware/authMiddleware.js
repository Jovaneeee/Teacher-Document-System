const { supabaseAuth } = require("../config/supabase");

// Middleware to require admin authentication
const requireAdminAuth = async (req, res, next) => {
  try {
    // Get authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: "Authentication required."
      });
    }

    // Extract token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required."
      });
    }

    // Verify token with Supabase
    const { data: { user }, error } = await supabaseAuth.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired authentication token."
      });
    }

    // Check if user is authorized as admin
    // This will be enhanced once admin_profiles table structure is confirmed
    // For now, we check user metadata for admin role
    const isAdmin = user?.user_metadata?.role === 'admin';

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Administrator access required."
      });
    }

    // Attach user to request object (excluding sensitive data)
    req.user = {
      id: user.id,
      email: user.email,
      role: user.user_metadata?.role
    };

    next();

  } catch (error) {
    console.error("Auth middleware error:", error.message);
    res.status(500).json({
      success: false,
      message: "An error occurred during authentication."
    });
  }
};

// Optional middleware to verify authentication without requiring admin role
const requireAuth = async (req, res, next) => {
  try {
    // Get authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: "Authentication required."
      });
    }

    // Extract token
    const token = authHeader.substring(7);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required."
      });
    }

    // Verify token with Supabase
    const { data: { user }, error } = await supabaseAuth.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired authentication token."
      });
    }

    // Attach user to request object (excluding sensitive data)
    req.user = {
      id: user.id,
      email: user.email,
      role: user.user_metadata?.role
    };

    next();

  } catch (error) {
    console.error("Auth middleware error:", error.message);
    res.status(500).json({
      success: false,
      message: "An error occurred during authentication."
    });
  }
};

module.exports = {
  requireAdminAuth,
  requireAuth
};
