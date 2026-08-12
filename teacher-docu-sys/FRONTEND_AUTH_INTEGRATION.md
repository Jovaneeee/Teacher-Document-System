# Frontend Authentication Integration - STEP 2B

## Overview
This document describes the frontend authentication integration that connects the existing admin UI to the backend authentication API implemented in STEP 2A.

## Files Created

### 1. `src/lib/api.ts` (New)
- Reusable API client for backend communication
- Type-safe interfaces for all authentication requests/responses
- Centralized error handling with ApiError class
- Configurable API base URL via environment variable

### 2. `src/contexts/AuthContext.tsx` (New)
- AuthProvider component for global authentication state
- useAuth hook for accessing authentication methods
- localStorage persistence for tokens and user data
- Methods: login(), logout(), changePassword()

### 3. `src/components/ProtectedRoute.tsx` (New)
- Route guard component for protected admin pages
- Redirects unauthenticated users to /admin
- Shows loading state during authentication check

### 4. `.env.example` (New)
- Example environment variable configuration
- VITE_API_URL for backend API endpoint

## Files Modified

### 1. `src/pages/AdminLogin.tsx`
- Integrated with useAuth hook
- Connected handleSubmit to backend API via login()
- Added error handling for authentication failures
- Removed demo authentication code

### 2. `src/pages/ForgotPassword.tsx`
- Integrated with API client
- Connected handleSubmit to backend forgotPassword endpoint
- Added error handling for API failures
- Removed demo submission code

### 3. `src/pages/ResetPassword.tsx`
- Integrated with useAuth hook
- Connected handleSubmit to backend changePassword endpoint
- Added error handling for password update failures
- Removed demo submission code

### 4. `src/components/admin/AdminSidebar.tsx`
- Integrated with useAuth hook
- Connected Sign Out buttons to logout() method
- Added navigation to /admin after logout

### 5. `src/App.tsx`
- Wrapped entire app with AuthProvider
- Added ProtectedRoute wrapper to admin routes:
  - /admin/dashboard
  - /admin/submissions
  - /admin/documents
- Public routes remain unprotected:
  - /admin (login)
  - /admin/forgot-password
  - /admin/reset-password

## Backend Endpoints Used

### POST /api/auth/login
- Used by AdminLogin component
- Sends email and password
- Receives access_token, refresh_token, and user data
- Tokens stored in localStorage

### POST /api/auth/forgot-password
- Used by ForgotPassword component
- Sends email address
- Always returns success (account enumeration prevention)

### POST /api/auth/change-password
- Used by ResetPassword component
- Requires authentication token
- Sends new password
- Updates authenticated user's password

### POST /api/auth/logout
- Used by AdminSidebar logout
- Requires authentication token
- Clears session on backend
- Frontend clears localStorage regardless

## Authentication/Session Strategy

### Token Storage
- **access_token**: Stored in localStorage as 'auth_token'
- **refresh_token**: Stored in localStorage as 'auth_refresh_token'
- **user data**: Stored in localStorage as 'auth_user'

### Session Persistence
- Tokens persist across page refreshes
- AuthContext checks localStorage on mount
- User remains authenticated until logout or token expiration

### Token Usage
- Access token sent in Authorization header: `Bearer <token>`
- Backend validates token on protected endpoints
- Token refresh logic can be added in future if needed

## Environment Variables Required

Add to frontend `.env` file:

```
VITE_API_URL=http://localhost:5000
```

**Production:**
```
VITE_API_URL=https://your-backend-domain.com
```

## Protected Routes

The following routes require authentication:
- `/admin/dashboard`
- `/admin/submissions`
- `/admin/documents`

Behavior:
- If authenticated: Renders the protected component
- If not authenticated: Redirects to `/admin`
- If loading: Shows loading spinner

## Authentication Flow

### Login Flow
1. User enters email and password on `/admin`
2. Form validation checks required fields
3. `login()` method called via useAuth
4. API client POSTs to `/api/auth/login`
5. Backend validates credentials with Supabase
6. On success: Tokens stored, user redirected to `/admin/dashboard`
7. On failure: Error message displayed

### Logout Flow
1. User clicks "Sign out" in AdminSidebar
2. `logout()` method called via useAuth
3. API client POSTs to `/api/auth/logout` (with token)
4. localStorage cleared regardless of API result
5. User redirected to `/admin`

### Forgot Password Flow
1. User clicks "Forgot password?" on login page
2. Navigated to `/admin/forgot-password`
3. User enters email address
4. API client POSTs to `/api/auth/forgot-password`
5. Backend sends password reset email via Supabase
6. Generic success message shown (account enumeration prevention)

### Reset Password Flow
1. User receives email with reset link
2. Link redirects to `/admin/reset-password`
3. User enters new password (with requirements validation)
4. `changePassword()` method called via useAuth
5. API client POSTs to `/api/auth/change-password` (with token)
6. Backend updates password via Supabase
7. Success message shown, user redirected to login

## Security Considerations

### Token Storage
- Tokens stored in localStorage (for demo purposes)
- **Production recommendation**: Use httpOnly cookies
- Tokens are never logged to console
- Tokens are never exposed in URL parameters

### Password Security
- Passwords never stored in frontend
- Passwords never logged to console
- Passwords sent only over HTTPS in production
- Password fields cleared after successful operations

### Error Messages
- Generic error messages to prevent information leakage
- Backend errors not exposed to users
- Account enumeration prevented on forgot password

### CORS
- Backend configured to accept requests from frontend origin
- Credentials handled appropriately for token-based auth

## Testing Checklist

- [ ] Login with valid admin credentials
- [ ] Login redirects to /admin/dashboard
- [ ] Invalid credentials show error message
- [ ] Empty fields show validation errors
- [ ] Logout clears authentication state
- [ ] Logout redirects to /admin
- [ ] Protected routes redirect unauthenticated users to /admin
- [ ] Refreshing dashboard maintains authentication
- [ ] Forgot password sends request to backend
- [ ] Forgot password shows generic success message
- [ ] Reset password validates requirements
- [ ] Reset password updates password via backend
- [ ] Passwords never logged to console
- [ ] Tokens never exposed in URLs
- [ ] Run ESLint
- [ ] Run production build

## Remaining Manual Configuration

### Backend Environment Variables
Ensure backend `.env` has:
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
FRONTEND_URL=http://localhost:5173
PORT=5000
```

### Supabase Setup
1. Create admin user with `user_metadata: {"role": "admin"}`
2. Configure email templates for password reset
3. Enable email authentication in Supabase

### Frontend Environment Variables
Create `.env` file in frontend:
```
VITE_API_URL=http://localhost:5000
```

## Integration Complete

The frontend is now fully integrated with the backend authentication system. All authentication flows are connected to the actual backend API endpoints, and protected routes are secured with the AuthProvider and ProtectedRoute components.
