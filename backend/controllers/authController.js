const supabase = require("../config/supabase");
const { sendPasswordResetEmail } = require("../services/emailService");

// Helper function to validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper function to validate password strength
const isValidPassword = (password) => {
  return password && password.length >= 8;
};

// Admin Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required."
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address."
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required."
      });
    }

    // Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      // Return generic error for security
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    // Check if user is authorized as admin
    // This will be enhanced once admin_profiles table structure is confirmed
    // For now, we'll check if the user has an admin role in user metadata
    const isAdmin = data.user?.user_metadata?.role === 'admin';

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Administrator access required."
      });
    }

    // Return success with user info (excluding sensitive data)
    res.json({
      success: true,
      message: "Login successful.",
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
          role: data.user.user_metadata?.role
        },
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at
        }
      }
    });

  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({
      success: false,
      message: "An error occurred during login."
    });
  }
};

// Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required."
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address."
      });
    }

    // Generate password reset link using Supabase
    // This creates a recovery token without sending an email
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: `${process.env.FRONTEND_URL}/admin/reset-password`
      }
    });

    if (error) {
      console.error("Supabase generate link error:", error.message);
      // Still return success to prevent account enumeration
      res.json({
        success: true,
        message: "If an account exists for this email, password reset instructions have been sent."
      });
      return;
    }

    // Send custom email via Gmail SMTP with the recovery link
    if (data && data.properties?.action_link) {
      try {
        await sendPasswordResetEmail(email, data.properties.action_link);
      } catch (emailError) {
        console.error("Failed to send password reset email via Gmail SMTP:", emailError.message);
        // Still return success to prevent account enumeration
        res.json({
          success: true,
          message: "If an account exists for this email, password reset instructions have been sent."
        });
        return;
      }
    }

    // Always return success to prevent account enumeration
    res.json({
      success: true,
      message: "If an account exists for this email, password reset instructions have been sent."
    });

  } catch (error) {
    console.error("Forgot password error:", error.message);
    // Still return success to prevent account enumeration
    res.json({
      success: true,
      message: "If an account exists for this email, password reset instructions have been sent."
    });
  }
};

// Change Password (for authenticated admin)
const changePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const user = req.user; // Set by requireAdminAuth middleware

    // Validate input
    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password is required."
      });
    }

    if (!isValidPassword(newPassword)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters."
      });
    }

    // Update password using Supabase
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Failed to update password. Please try again."
      });
    }

    res.json({
      success: true,
      message: "Password updated successfully."
    });

  } catch (error) {
    console.error("Change password error:", error.message);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating password."
    });
  }
};

// Logout
const logout = async (req, res) => {
  try {
    const user = req.user; // Set by requireAdminAuth middleware

    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Failed to logout."
      });
    }

    res.json({
      success: true,
      message: "Logout successful."
    });

  } catch (error) {
    console.error("Logout error:", error.message);
    res.status(500).json({
      success: false,
      message: "An error occurred during logout."
    });
  }
};

module.exports = {
  login,
  forgotPassword,
  changePassword,
  logout
};
