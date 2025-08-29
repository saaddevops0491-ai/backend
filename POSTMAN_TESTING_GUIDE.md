# Postman Testing Guide for Saher Flow Solutions API

## Setup Instructions

### 1. Email Configuration Setup

Before testing, you need to configure your email settings in the `.env` file:

1. **For Gmail:**
   - Enable 2-Factor Authentication on your Gmail account
   - Go to Google Account Settings > Security > 2-Step Verification
   - Generate an App Password:
     - Go to Google Account Settings > Security > App passwords
     - Select "Mail" and your device
     - Copy the 16-character password
   - Update `.env` file:
     ```
     EMAIL_USER=your-actual-gmail@gmail.com
     EMAIL_PASS=your-16-character-app-password
     ```

2. **For Other Email Providers:**
   - Update `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, and `EMAIL_PASS` accordingly

### 2. Start the Server

```bash
npm run dev
```

Server will run on: `http://localhost:5000`

---

## API Endpoints Testing

### Base URL: `http://localhost:5000`

---

## 1. Health Check

### GET `/api/health`
**Purpose:** Check if API is running

**Request:**
- Method: `GET`
- URL: `http://localhost:5000/api/health`
- Headers: None required
- Body: None

**Expected Response:**
```json
{
  "message": "Saher Flow Solutions API is running!",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 2. Authentication Endpoints

### POST `/api/auth/register`
**Purpose:** Register a new user

**Request:**
- Method: `POST`
- URL: `http://localhost:5000/api/auth/register`
- Headers: 
  ```
  Content-Type: application/json
  ```
- Body (JSON):
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "company": "Tech Solutions Inc",
    "password": "Password123"
  }
  ```

**Expected Response (Success):**
```json
{
  "success": true,
  "message": "User registered successfully. Please check your email to verify your account.",
  "data": {
    "user": {
      "id": "65a1b2c3d4e5f6789012345",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "company": "Tech Solutions Inc",
      "isEmailVerified": false
    }
  }
}
```

**Expected Response (Error - User exists):**
```json
{
  "success": false,
  "message": "User already exists with this email"
}
```

**Expected Response (Validation Error):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "msg": "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      "param": "password",
      "location": "body"
    }
  ]
}
```

---

### GET `/api/auth/verify-email/:token`
**Purpose:** Verify user email address

**Request:**
- Method: `GET`
- URL: `http://localhost:5000/api/auth/verify-email/your-verification-token-here`
- Headers: None required
- Body: None
- Params: `token` (from email link)

**Expected Response (Success):**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

**Expected Response (Error):**
```json
{
  "success": false,
  "message": "Invalid or expired verification token"
}
```

---

### POST `/api/auth/login`
**Purpose:** Login user

**Request:**
- Method: `POST`
- URL: `http://localhost:5000/api/auth/login`
- Headers:
  ```
  Content-Type: application/json
  ```
- Body (JSON):
  ```json
  {
    "email": "john.doe@example.com",
    "password": "Password123"
  }
  ```

**Expected Response (Success):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "65a1b2c3d4e5f6789012345",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "company": "Tech Solutions Inc",
      "role": "user",
      "isEmailVerified": true,
      "lastLogin": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Expected Response (Error):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### POST `/api/auth/forgot-password`
**Purpose:** Request password reset

**Request:**
- Method: `POST`
- URL: `http://localhost:5000/api/auth/forgot-password`
- Headers:
  ```
  Content-Type: application/json
  ```
- Body (JSON):
  ```json
  {
    "email": "john.doe@example.com"
  }
  ```

**Expected Response (Success):**
```json
{
  "success": true,
  "message": "Password reset email sent successfully"
}
```

**Expected Response (Error):**
```json
{
  "success": false,
  "message": "No user found with this email address"
}
```

---

### PUT `/api/auth/reset-password/:token`
**Purpose:** Reset password with token

**Request:**
- Method: `PUT`
- URL: `http://localhost:5000/api/auth/reset-password/your-reset-token-here`
- Headers:
  ```
  Content-Type: application/json
  ```
- Body (JSON):
  ```json
  {
    "password": "NewPassword123"
  }
  ```
- Params: `token` (from email link)

**Expected Response (Success):**
```json
{
  "success": true,
  "message": "Password reset successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "65a1b2c3d4e5f6789012345",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "company": "Tech Solutions Inc",
      "role": "user",
      "isEmailVerified": true
    }
  }
}
```

---

### GET `/api/auth/me`
**Purpose:** Get current user data

**Request:**
- Method: `GET`
- URL: `http://localhost:5000/api/auth/me`
- Headers:
  ```
  Authorization: Bearer your-jwt-token-here
  ```
- Body: None

**Expected Response (Success):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "65a1b2c3d4e5f6789012345",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "company": "Tech Solutions Inc",
      "role": "user",
      "isEmailVerified": true,
      "lastLogin": "2024-01-15T10:30:00.000Z",
      "isActive": true,
      "createdAt": "2024-01-15T09:00:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Expected Response (Error - No Token):**
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

---

### POST `/api/auth/logout`
**Purpose:** Logout user

**Request:**
- Method: `POST`
- URL: `http://localhost:5000/api/auth/logout`
- Headers:
  ```
  Authorization: Bearer your-jwt-token-here
  ```
- Body: None

**Expected Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 3. User Management Endpoints

### PUT `/api/user/profile`
**Purpose:** Update user profile (Requires email verification)

**Request:**
- Method: `PUT`
- URL: `http://localhost:5000/api/user/profile`
- Headers:
  ```
  Authorization: Bearer your-jwt-token-here
  Content-Type: application/json
  ```
- Body (JSON) - All fields optional:
  ```json
  {
    "firstName": "Jane",
    "lastName": "Smith",
    "company": "New Company Name"
  }
  ```

**Expected Response (Success):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "65a1b2c3d4e5f6789012345",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "john.doe@example.com",
      "company": "New Company Name",
      "role": "user",
      "isEmailVerified": true,
      "lastLogin": "2024-01-15T10:30:00.000Z",
      "isActive": true,
      "createdAt": "2024-01-15T09:00:00.000Z",
      "updatedAt": "2024-01-15T11:00:00.000Z"
    }
  }
}
```

**Expected Response (Error - Email not verified):**
```json
{
  "success": false,
  "message": "Please verify your email address before accessing this resource. Check your inbox for the verification email."
}
```

---

### PUT `/api/user/change-password`
**Purpose:** Change user password (Requires email verification)

**Request:**
- Method: `PUT`
- URL: `http://localhost:5000/api/user/change-password`
- Headers:
  ```
  Authorization: Bearer your-jwt-token-here
  Content-Type: application/json
  ```
- Body (JSON):
  ```json
  {
    "currentPassword": "Password123",
    "newPassword": "NewPassword456"
  }
  ```

**Expected Response (Success):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Expected Response (Error - Wrong current password):**
```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

---

### DELETE `/api/user/account`
**Purpose:** Deactivate user account (Requires email verification)

**Request:**
- Method: `DELETE`
- URL: `http://localhost:5000/api/user/account`
- Headers:
  ```
  Authorization: Bearer your-jwt-token-here
  ```
- Body: None

**Expected Response:**
```json
{
  "success": true,
  "message": "Account deactivated successfully"
}
```

---

### GET `/api/user/all`
**Purpose:** Get all users (Admin only)

**Request:**
- Method: `GET`
- URL: `http://localhost:5000/api/user/all?page=1&limit=10`
- Headers:
  ```
  Authorization: Bearer your-admin-jwt-token-here
  ```
- Body: None
- Query Params:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)

**Expected Response (Success):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "65a1b2c3d4e5f6789012345",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "company": "Tech Solutions Inc",
        "role": "user",
        "isEmailVerified": true,
        "lastLogin": "2024-01-15T10:30:00.000Z",
        "isActive": true,
        "createdAt": "2024-01-15T09:00:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "pages": 1
    }
  }
}
```

**Expected Response (Error - Not Admin):**
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

---

## Testing Workflow

### 1. Basic Flow Test
1. **Health Check** - Verify API is running
2. **Register User** - Create new account
3. **Check Email** - Look for verification email
4. **Verify Email** - Click link or use token from email
5. **Login** - Get JWT token
6. **Get Profile** - Test protected route
7. **Update Profile** - Test profile update
8. **Change Password** - Test password change
9. **Logout** - Test logout

### 2. Error Testing
1. **Register with existing email**
2. **Login with wrong credentials**
3. **Access protected routes without token**
4. **Access protected routes with invalid token**
5. **Try to update profile without email verification**
6. **Reset password with invalid token**

### 3. Admin Testing
1. **Create admin user** (manually set role in database)
2. **Login as admin**
3. **Access `/api/user/all` endpoint**
4. **Test pagination with query params**

---

## Common Error Responses

### 400 - Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "msg": "Error description",
      "param": "field_name",
      "location": "body"
    }
  ]
}
```

### 401 - Unauthorized
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### 403 - Forbidden
```json
{
  "success": false,
  "message": "Please verify your email address before accessing this resource."
}
```

### 404 - Not Found
```json
{
  "success": false,
  "message": "Route not found"
}
```

### 500 - Server Error
```json
{
  "success": false,
  "message": "Server error description"
}
```

---

## Postman Collection Setup

### Environment Variables
Create a Postman environment with these variables:
- `base_url`: `http://localhost:5000`
- `auth_token`: (will be set automatically after login)

### Pre-request Scripts for Login
Add this to your login request's "Tests" tab to automatically save the token:
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    if (response.success && response.data.token) {
        pm.environment.set("auth_token", response.data.token);
    }
}
```

### Authorization Setup
For protected routes, use:
- Type: `Bearer Token`
- Token: `{{auth_token}}`

---

## Email Templates Preview

### Welcome Email
- Subject: "Welcome to Saher Flow Solutions - Verify Your Email"
- Contains verification link with token
- Professional styling with company branding

### Password Reset Email
- Subject: "Password Reset Request - Saher Flow Solutions"
- Contains reset link with token (expires in 10 minutes)
- Security notice about ignoring if not requested

---

## Security Notes

1. **JWT Tokens:** Expire in 7 days by default
2. **Email Verification:** Required for accessing protected user routes
3. **Password Requirements:** Minimum 6 characters, must contain uppercase, lowercase, and number
4. **Rate Limiting:** Ready to be implemented if needed
5. **Password Reset:** Tokens expire in 10 minutes
6. **Email Verification:** Tokens expire in 24 hours

---

## Troubleshooting

### Email Not Sending
1. Check Gmail app password is correct (16 characters, no spaces)
2. Verify 2FA is enabled on Gmail account
3. Check console logs for detailed error messages
4. Test with a different email provider if needed

### Database Connection Issues
1. Verify MongoDB URI is correct
2. Check network connectivity
3. Ensure database user has proper permissions
4. Check MongoDB Atlas IP whitelist

### JWT Token Issues
1. Verify JWT_SECRET is set in .env
2. Check token format in Authorization header
3. Ensure token hasn't expired
4. Verify user account is still active