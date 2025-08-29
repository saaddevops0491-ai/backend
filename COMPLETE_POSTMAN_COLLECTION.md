# Complete Postman Collection for Saher Flow Solutions API

## Postman Environment Setup

### Create Environment Variables:
1. **Environment Name:** `Saher Flow API`
2. **Variables:**
   ```
   base_url: http://localhost:5000
   auth_token: (leave empty - will be auto-filled)
   user_email: (for testing - e.g., test@example.com)
   ```

---

## 📋 COMPLETE API ENDPOINTS COLLECTION

### 1. 🏥 HEALTH CHECK

**Endpoint:** `GET {{base_url}}/api/health`

**Headers:** None

**Body:** None

**Expected Response:**
```json
{
  "message": "Saher Flow Solutions API is running!",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### 2. 👤 USER REGISTRATION

**Endpoint:** `POST {{base_url}}/api/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "firstName": "John",
  "lastName": "Doe", 
  "email": "john.doe@example.com",
  "company": "Tech Solutions Inc",
  "password": "Password123"
}
```

**Expected Success Response:**
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

**Expected Error Responses:**
```json
// User already exists
{
  "success": false,
  "message": "User already exists with this email"
}

// Validation error
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

### 3. ✉️ EMAIL VERIFICATION

**Endpoint:** `GET {{base_url}}/api/auth/verify-email/:token`

**Headers:** None

**Body:** None

**URL Params:**
- `token`: The verification token from email (e.g., `abc123def456...`)

**Example URL:**
```
GET http://localhost:5000/api/auth/verify-email/a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
```

**Expected Success Response:**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

**Expected Error Response:**
```json
{
  "success": false,
  "message": "Invalid or expired verification token"
}
```

---

### 4. 🔐 USER LOGIN

**Endpoint:** `POST {{base_url}}/api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "john.doe@example.com",
  "password": "Password123"
}
```

**Expected Success Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YTFiMmMzZDRlNWY2Nzg5MDEyMzQ1IiwiaWF0IjoxNzA1MzE0NjAwLCJleHAiOjE3MDU5MTk0MDB9.xyz123",
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

**Postman Tests Script (Add to Tests tab):**
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    if (response.success && response.data.token) {
        pm.environment.set("auth_token", response.data.token);
        console.log("Token saved to environment");
    }
}
```

**Expected Error Responses:**
```json
// Invalid credentials
{
  "success": false,
  "message": "Invalid email or password"
}

// Account deactivated
{
  "success": false,
  "message": "Account has been deactivated. Please contact support."
}
```

---

### 5. 🔑 FORGOT PASSWORD

**Endpoint:** `POST {{base_url}}/api/auth/forgot-password`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "john.doe@example.com"
}
```

**Expected Success Response:**
```json
{
  "success": true,
  "message": "Password reset email sent successfully"
}
```

**Expected Error Response:**
```json
{
  "success": false,
  "message": "No user found with this email address"
}
```

---

### 6. 🔄 RESET PASSWORD

**Endpoint:** `PUT {{base_url}}/api/auth/reset-password/:token`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "password": "NewPassword456"
}
```

**URL Params:**
- `token`: The reset token from email

**Example URL:**
```
PUT http://localhost:5000/api/auth/reset-password/def456abc789012345678901234567890abcdef1234567890abcdef123456789
```

**Expected Success Response:**
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

### 7. 👨‍💼 GET CURRENT USER

**Endpoint:** `GET {{base_url}}/api/auth/me`

**Headers:**
```
Authorization: Bearer {{auth_token}}
```

**Body:** None

**Expected Success Response:**
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

**Expected Error Response:**
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

---

### 8. 🚪 LOGOUT

**Endpoint:** `POST {{base_url}}/api/auth/logout`

**Headers:**
```
Authorization: Bearer {{auth_token}}
```

**Body:** None

**Expected Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 9. ✏️ UPDATE PROFILE

**Endpoint:** `PUT {{base_url}}/api/user/profile`

**Headers:**
```
Authorization: Bearer {{auth_token}}
Content-Type: application/json
```

**Body (JSON) - All fields optional:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "company": "New Company Name"
}
```

**Expected Success Response:**
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

**Expected Error Response (Email not verified):**
```json
{
  "success": false,
  "message": "Please verify your email address before accessing this resource. Check your inbox for the verification email."
}
```

---

### 10. 🔐 CHANGE PASSWORD

**Endpoint:** `PUT {{base_url}}/api/user/change-password`

**Headers:**
```
Authorization: Bearer {{auth_token}}
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "currentPassword": "Password123",
  "newPassword": "NewPassword456"
}
```

**Expected Success Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Expected Error Responses:**
```json
// Wrong current password
{
  "success": false,
  "message": "Current password is incorrect"
}

// Email not verified
{
  "success": false,
  "message": "Please verify your email address before accessing this resource. Check your inbox for the verification email."
}
```

---

### 11. 🗑️ DELETE ACCOUNT

**Endpoint:** `DELETE {{base_url}}/api/user/account`

**Headers:**
```
Authorization: Bearer {{auth_token}}
```

**Body:** None

**Expected Success Response:**
```json
{
  "success": true,
  "message": "Account deactivated successfully"
}
```

---

### 12. 👥 GET ALL USERS (Admin Only)

**Endpoint:** `GET {{base_url}}/api/user/all`

**Headers:**
```
Authorization: Bearer {{auth_token}}
```

**Body:** None

**Query Parameters (Optional):**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Example URLs:**
```
GET http://localhost:5000/api/user/all
GET http://localhost:5000/api/user/all?page=2&limit=5
```

**Expected Success Response:**
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

**Expected Error Response (Not Admin):**
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

---

## 🧪 COMPLETE TESTING WORKFLOW

### Phase 1: Basic Authentication Flow
1. **Health Check** → Verify API is running
2. **Register User** → Create account with valid email
3. **Check Email** → Look for verification email from saad.mahmood@saherflow.com
4. **Verify Email** → Use token from email
5. **Login** → Get JWT token (auto-saved in Postman)
6. **Get Current User** → Test protected route

### Phase 2: User Operations (Requires Email Verification)
7. **Update Profile** → Test profile modification
8. **Change Password** → Test password update
9. **Logout** → Test logout functionality

### Phase 3: Admin Operations
10. **Create Admin User** → Manually promote user in database
11. **Login as Admin** → Get admin token
12. **Get All Users** → Test admin-only endpoint

### Phase 4: Password Reset Flow
13. **Forgot Password** → Request reset email
14. **Check Email** → Look for reset email
15. **Reset Password** → Use token from email
16. **Login with New Password** → Verify reset worked

### Phase 5: Error Testing
17. **Register Duplicate Email** → Test duplicate prevention
18. **Login Wrong Credentials** → Test authentication
19. **Access Protected Routes Without Token** → Test security
20. **Access User Routes Without Email Verification** → Test verification requirement

---

## 🔧 POSTMAN COLLECTION IMPORT

### Collection JSON Structure:
```json
{
  "info": {
    "name": "Saher Flow Solutions API",
    "description": "Complete API testing collection"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:5000"
    }
  ]
}
```

### Auto-Token Management Script:
Add this to your Login request's **Tests** tab:
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    if (response.success && response.data && response.data.token) {
        pm.environment.set("auth_token", response.data.token);
        console.log("✅ Auth token saved to environment");
        
        // Also save user info for reference
        pm.environment.set("user_id", response.data.user.id);
        pm.environment.set("user_email", response.data.user.email);
    }
} else {
    console.log("❌ Login failed - token not saved");
}
```

---

## 📧 EMAIL TESTING CHECKLIST

### After Registration:
- [ ] Check saad.mahmood@saherflow.com inbox
- [ ] Verify sender shows "Saher Flow Solutions"
- [ ] Click verification link
- [ ] Confirm email verification works

### After Password Reset Request:
- [ ] Check saad.mahmood@saherflow.com inbox
- [ ] Verify reset email received
- [ ] Click reset link within 10 minutes
- [ ] Confirm password reset works

---

## 🚨 COMMON ERROR CODES & MEANINGS

| Status Code | Meaning | Common Causes |
|-------------|---------|---------------|
| 400 | Bad Request | Validation errors, missing fields |
| 401 | Unauthorized | No token, invalid token, wrong credentials |
| 403 | Forbidden | Email not verified, not admin |
| 404 | Not Found | User not found, invalid route |
| 500 | Server Error | Database issues, email sending failed |

---

## 🎯 TESTING PRIORITIES

### Must Test First:
1. Health check
2. User registration
3. Email verification
4. Login flow

### Test After Email Setup:
5. Profile operations
6. Password change
7. Password reset flow

### Test Last:
8. Admin operations
9. Error scenarios
10. Edge cases

---

## 📝 TESTING NOTES

### Important:
- **Email verification is required** for all user profile operations
- **JWT tokens expire in 7 days**
- **Password reset tokens expire in 10 minutes**
- **Email verification tokens expire in 24 hours**
- **All passwords must contain uppercase, lowercase, and number**

### Tips:
- Use the auto-token script to avoid manually copying tokens
- Test with multiple users to verify isolation
- Check email delivery for each registration
- Verify all error scenarios work as expected