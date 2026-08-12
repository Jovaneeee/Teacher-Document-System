# Backend Admin Authentication Implementation

## Overview
This document describes the backend admin authentication system implemented for the Teacher Document Management System.

## Files Created

### 1. `config/supabase.js` (Modified)
- Added environment variable validation
- Changed from `SUPABASE_SECRET_KEY` to `SUPABASE_SERVICE_ROLE_KEY`
- Validates required environment variables on startup

### 2. `controllers/authController.js` (New)
- `login()` - Admin login endpoint
- `forgotPassword()` - Password reset request endpoint
- `changePassword()` - Password update for authenticated admin
- `logout()` - Logout endpoint
- Includes input validation and error handling

### 3. `middleware/authMiddleware.js` (New)
- `requireAdminAuth()` - Middleware to verify admin authentication
- `requireAuth()` - Middleware to verify authentication (without admin role check)
- Validates Bearer tokens using Supabase
- Attaches user info to request object

### 4. `middleware/rateLimiter.js` (New)
- `loginLimiter` - 5 login attempts per 15 minutes
- `forgotPasswordLimiter` - 3 password reset requests per hour
- `authLimiter` - 100 requests per 15 minutes for authenticated endpoints

### 5. `routes/authRoutes.js` (New)
- POST `/api/auth/login` - Admin login
- POST `/api/auth/forgot-password` - Request password reset
- POST `/api/auth/change-password` - Change password (authenticated)
- POST `/api/auth/logout` - Logout (authenticated)

### 6. `server.js` (Modified)
- Added CORS configuration with allowed origins
- Mounted authentication routes at `/api/auth`
- Added rate limiting to authentication endpoints

## Files Modified

1. `config/supabase.js` - Updated to use service role key with validation
2. `server.js` - Added CORS, auth routes, and rate limiting
3. `package.json` - Added `express-rate-limit` dependency

## Environment Variables Required

Add these to your `.env` file in the backend folder:

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
FRONTEND_URL=http://localhost:5173
PORT=5000
```

**IMPORTANT:**
- `SUPABASE_SERVICE_ROLE_KEY` is the service role key from Supabase Dashboard
- This key must NEVER be exposed to the frontend
- This key must NEVER be committed to version control
- The service role key bypasses RLS policies for server-side operations

## API Endpoints

### POST `/api/auth/login`
Authenticates an administrator.

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "user-password"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "user": {
      "id": "user-id",
      "email": "admin@example.com",
      "role": "admin"
    },
    "session": {
      "access_token": "jwt-access-token",
      "refresh_token": "jwt-refresh-token",
      "expires_at": 1234567890
    }
  }
}
```

**Error Responses:**
- 400 - Invalid email format or missing fields
- 401 - Invalid credentials
- 403 - User not authorized as admin
- 500 - Server error

### POST `/api/auth/forgot-password`
Requests a password reset email.

**Request Body:**
```json
{
  "email": "admin@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "If an account exists for this email, password reset instructions have been sent."
}
```

**Security Note:** Always returns success to prevent account enumeration.

### POST `/api/auth/change-password`
Changes password for authenticated admin.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "newPassword": "new-password"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password updated successfully."
}
```

**Error Responses:**
- 400 - Invalid password or missing field
- 401 - Authentication required
- 403 - Not authorized as admin
- 500 - Server error

### POST `/api/auth/logout`
Logs out the authenticated admin.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logout successful."
}
```

## Admin Authorization

Currently, admin authorization is determined by checking the user's `user_metadata.role` field in Supabase Auth. The user must have `role: 'admin'` in their user metadata.

**Future Enhancement:** Once an `admin_profiles` table is created in Supabase, the authorization check should be enhanced to verify against this table for more robust admin management.

## Security Features

1. **Environment Variable Validation** - Server fails to start if required variables are missing
2. **CORS Protection** - Only allows requests from configured frontend origins
3. **Rate Limiting** - Prevents brute force attacks on login and password reset
4. **Token Verification** - All protected routes require valid Bearer tokens
5. **Admin Role Check** - Verifies user has admin role before allowing access
6. **Account Enumeration Prevention** - Forgot password always returns success
7. **Input Validation** - All inputs are validated before processing
8. **No Password Logging** - Passwords are never logged or exposed
9. **No Token Logging** - Access tokens are never logged or exposed
10. **Generic Error Messages** - Internal errors are not exposed to clients

## How Frontend Should Authenticate (STEP 2B)

1. **Login Flow:**
   - Frontend collects email and password
   - POST to `/api/auth/login`
   - Store returned `access_token` and `refresh_token` securely
   - Use `access_token` in Authorization header for protected requests

2. **Forgot Password Flow:**
   - Frontend collects email
   - POST to `/api/auth/forgot-password`
   - Show success message (don't reveal if email exists)
   - User receives email from Supabase with reset link

3. **Password Reset Flow:**
   - User clicks link from email (redirects to `/admin/reset-password`)
   - Frontend extracts recovery token from URL
   - User enters new password
   - Frontend calls Supabase directly to update password with recovery token
   - OR: Frontend sends new password to backend with recovery context

4. **Protected Requests:**
   - Include `Authorization: Bearer <access_token>` header
   - Backend verifies token and admin role
   - Request proceeds if authorized

## Manual Supabase Dashboard Setup Required

1. **Create Admin User:**
   - Go to Supabase Dashboard → Authentication
   - Create a new user with admin email
   - Set user metadata: `{"role": "admin"}`
   - Set a temporary password

2. **Configure Email:**
   - Enable email templates in Supabase Dashboard
   - Configure SMTP settings or use Supabase email
   - Customize password reset email template if needed

3. **Get Service Role Key:**
   - Go to Supabase Dashboard → Settings → API
   - Copy the `service_role` key (NOT the `anon` key)
   - Add to backend `.env` as `SUPABASE_SERVICE_ROLE_KEY`

## Security Considerations

1. **Service Role Key Protection:**
   - Never commit service role key to version control
   - Never expose service role key to frontend
   - Rotate service role key if compromised

2. **Token Storage:**
   - Frontend should store tokens securely (httpOnly cookies recommended)
   - Never store tokens in localStorage for production

3. **HTTPS Required:**
   - Always use HTTPS in production
   - Tokens sent over HTTP can be intercepted

4. **Password Requirements:**
   - Currently: minimum 8 characters
   - Can be enhanced based on security policy

5. **Session Management:**
   - Supabase handles session expiration
   - Frontend should handle token refresh using refresh_token

## Testing Checklist

- [ ] Backend starts successfully with correct environment variables
- [ ] Valid admin credentials can authenticate
- [ ] Invalid credentials are rejected with 401
- [ ] Missing email returns 400
- [ ] Invalid email format returns 400
- [ ] Missing password returns 400
- [ ] Protected endpoint without token returns 401
- [ ] Invalid token returns 401
- [ ] Non-admin user returns 403
- [ ] Valid admin token allows protected endpoint access
- [ ] Forgot password request works
- [ ] Forgot password does not reveal email existence
- [ ] Password update requires authenticated context
- [ ] Rate limiting works on login endpoint
- [ ] Rate limiting works on forgot password endpoint
- [ ] CORS blocks unauthorized origins
- [ ] Password is never logged
- [ ] Service role key is never returned
- [ ] Authorization headers are never logged

## Next Steps (STEP 2B)

The frontend integration will need to:
1. Connect login form to `/api/auth/login`
2. Store and manage authentication tokens
3. Add Authorization headers to API requests
4. Integrate forgot password form with `/api/auth/forgot-password`
5. Handle password reset flow with Supabase recovery tokens
6. Implement protected route guards in React Router
