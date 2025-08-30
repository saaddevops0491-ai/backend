# 🚀 COMPLETE POSTMAN TESTING GUIDE
## Saher Flow Solutions API - All Endpoints

### 📋 **SETUP CHECKLIST**
- [ ] Update `.env` with your actual Outlook password
- [ ] Server running on `http://localhost:5000`
- [ ] Postman installed and ready
- [ ] Test emails from approved domains only

---

## 🏥 **1. HEALTH CHECK**

**Method:** `GET`  
**URL:** `http://localhost:5000/api/health`  
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

## 👤 **2. USER REGISTRATION** (Domain Restricted)

**Method:** `POST`  
**URL:** `http://localhost:5000/api/auth/register`  
**Headers:**
```
Content-Type: application/json
```

**Body (JSON) - Valid Domain Example:**
```json
{
  "firstName": "Ahmed",
  "lastName": "Al-Rashid",
  "email": "ahmed.rashid@aramco.com",
  "company": "Saudi Aramco",
  "password": "Password123"
}
```

**Other Valid Test Emails:**
```json
// ADNOC User
{
  "firstName": "Fatima",
  "lastName": "Al-Zahra",
  "email": "fatima.zahra@adnoc.ae",
  "company": "ADNOC",
  "password": "Password123"
}

// QTM User  
{
  "firstName": "Omar",
  "lastName": "Al-Thani",
  "email": "omar.thani@qtm.com.qa",
  "company": "QTM",
  "password": "Password123"
}

// PDO User
{
  "firstName": "Khalid",
  "lastName": "Al-Balushi",
  "email": "khalid.balushi@pdo.co.om",
  "company": "PDO",
  "password": "Password123"
}

// DNV User
{
  "firstName": "Lars",
  "lastName": "Hansen",
  "email": "lars.hansen@dnv.com",
  "company": "DNV",
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
      "firstName": "Ahmed",
      "lastName": "Al-Rashid",
      "email": "ahmed.rashid@aramco.com",
      "company": "Saudi Aramco",
      "isEmailVerified": false
    }
  }
}
```

**Expected Error Response (Invalid Domain):**
```json
{
  "success": false,
  "message": "Registration is restricted to employees of approved companies only. Allowed domains: aramco.com, adnoc.ae, qtm.com.qa, pdo.co.om, dnv.com",
  "allowedDomains": [
    "aramco.com",
    "adnoc.ae", 
    "qtm.com.qa",
    "pdo.co.om",
    "dnv.com"
  ]
}
```

**Expected Error Response (Gmail/Random Email):**
```json
{
  "success": false,
  "message": "Registration is restricted to employees of approved companies only. Allowed domains: aramco.com, adnoc.ae, qtm.com.qa, pdo.co.om, dnv.com",
  "allowedDomains": [
    "aramco.com",
    "adnoc.ae", 
    "qtm.com.qa",
    "pdo.co.om",
    "dnv.com"
  ]
}
```

---

## ✉️ **3. EMAIL VERIFICATION**

**Method:** `GET`  
**URL:** `http://localhost:5000/api/auth/verify-email/:token`  
**Headers:** None  
**Body:** None  
**Params:** `token` (from email link)

**Example URL:**
```
GET http://localhost:5000/api/auth/verify-email/a1b2c3d4e5f6789012345678901234567890abcdef
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

## 🔐 **4. USER LOGIN**

**Method:** `POST`  
**URL:** `http://localhost:5000/api/auth/login`  
**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "ahmed.rashid@aramco.com",
  "password": "Password123"
}
```

**Expected Success Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "65a1b2c3d4e5f6789012345",
      "firstName": "Ahmed",
      "lastName": "Al-Rashid",
      "email": "ahmed.rashid@aramco.com",
      "company": "Saudi Aramco",
      "role": "user",
      "isEmailVerified": true,
      "lastLogin": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Postman Auto-Token Script (Add to Tests tab):**
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    if (response.success && response.data.token) {
        pm.environment.set("auth_token", response.data.token);
        console.log("✅ Token saved automatically");
    }
}
```

---

## 🔑 **5. FORGOT PASSWORD**

**Method:** `POST`  
**URL:** `http://localhost:5000/api/auth/forgot-password`  
**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "ahmed.rashid@aramco.com"
}
```

**Expected Success Response:**
```json
{
  "success": true,
  "message": "Password reset email sent successfully"
}
```

---

## 🔄 **6. RESET PASSWORD**

**Method:** `PUT`  
**URL:** `http://localhost:5000/api/auth/reset-password/:token`  
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

**Params:** `token` (from reset email)

**Expected Success Response:**
```json
{
  "success": true,
  "message": "Password reset successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "65a1b2c3d4e5f6789012345",
      "firstName": "Ahmed",
      "lastName": "Al-Rashid",
      "email": "ahmed.rashid@aramco.com",
      "company": "Saudi Aramco",
      "role": "user",
      "isEmailVerified": true
    }
  }
}
```

---

## 👨‍💼 **7. GET CURRENT USER** (Protected)

**Method:** `GET`  
**URL:** `http://localhost:5000/api/auth/me`  
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
      "firstName": "Ahmed",
      "lastName": "Al-Rashid",
      "email": "ahmed.rashid@aramco.com",
      "company": "Saudi Aramco",
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

---

## ✏️ **8. UPDATE PROFILE** (Protected + Email Verified)

**Method:** `PUT`  
**URL:** `http://localhost:5000/api/user/profile`  
**Headers:**
```
Authorization: Bearer {{auth_token}}
Content-Type: application/json
```

**Body (JSON) - All fields optional:**
```json
{
  "firstName": "Ahmed Ali",
  "lastName": "Al-Rashid",
  "company": "Saudi Aramco - Engineering Division"
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
      "firstName": "Ahmed Ali",
      "lastName": "Al-Rashid",
      "email": "ahmed.rashid@aramco.com",
      "company": "Saudi Aramco - Engineering Division",
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

**Expected Error Response (Email Not Verified):**
```json
{
  "success": false,
  "message": "Please verify your email address before accessing this resource. Check your inbox for the verification email."
}
```

---

## 🔐 **9. CHANGE PASSWORD** (Protected + Email Verified)

**Method:** `PUT`  
**URL:** `http://localhost:5000/api/user/change-password`  
**Headers:**
```
Authorization: Bearer {{auth_token}}
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "currentPassword": "Password123",
  "newPassword": "NewPassword789"
}
```

**Expected Success Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Expected Error Response:**
```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

---

## 🚪 **10. LOGOUT** (Protected)

**Method:** `POST`  
**URL:** `http://localhost:5000/api/auth/logout`  
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

## 🗑️ **11. DELETE ACCOUNT** (Protected + Email Verified)

**Method:** `DELETE`  
**URL:** `http://localhost:5000/api/user/account`  
**Headers:**
```
Authorization: Bearer {{auth_token}}
```

**Body:** None

**Expected Response:**
```json
{
  "success": true,
  "message": "Account deactivated successfully"
}
```

---

## 👥 **12. GET ALL USERS** (Admin Only)

**Method:** `GET`  
**URL:** `http://localhost:5000/api/user/all`  
**Headers:**
```
Authorization: Bearer {{auth_token}}
```

**Body:** None  
**Query Params (Optional):**
- `page=1`
- `limit=10`

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
        "firstName": "Ahmed",
        "lastName": "Al-Rashid",
        "email": "ahmed.rashid@aramco.com",
        "company": "Saudi Aramco",
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

## 🎯 **TESTING WORKFLOW**

### **Phase 1: Basic Setup**
1. **Health Check** → Verify API is running
2. **Test Invalid Domain Registration** → Try with gmail.com (should fail)
3. **Test Valid Domain Registration** → Use aramco.com email
4. **Check Email** → Look for verification email from saad.mahmood@saherflow.com

### **Phase 2: Email Verification**
5. **Verify Email** → Use token from email
6. **Login** → Get JWT token (auto-saved in Postman)
7. **Get Current User** → Test protected route

### **Phase 3: User Operations**
8. **Update Profile** → Test profile modification
9. **Change Password** → Test password update
10. **Logout** → Test logout functionality

### **Phase 4: Password Reset**
11. **Forgot Password** → Request reset email
12. **Reset Password** → Use token from email
13. **Login with New Password** → Verify reset worked

### **Phase 5: Admin Testing**
14. **Create Admin User** → Manually promote user in database
15. **Get All Users** → Test admin endpoint

---

## 🚨 **ALLOWED COMPANY DOMAINS**

Only these email domains can register:
- **aramco.com** (Saudi Aramco)
- **adnoc.ae** (ADNOC)
- **qtm.com.qa** (QTM)
- **pdo.co.om** (PDO)
- **dnv.com** (DNV)

**Invalid Registration Examples:**
```json
// These will be REJECTED:
{
  "email": "user@gmail.com"        // ❌ Not allowed
}
{
  "email": "user@outlook.com"      // ❌ Not allowed  
}
{
  "email": "user@company.com"      // ❌ Not allowed
}
```

---

## 📧 **EMAIL SETUP REQUIREMENTS**

**Before Testing:**
1. Update `.env` file:
   ```
   EMAIL_PASS=your-actual-outlook-password
   ```
2. Restart server: `npm run dev`
3. Test registration with valid domain email
4. Check saad.mahmood@saherflow.com inbox

---

## 🔧 **POSTMAN ENVIRONMENT SETUP**

**Environment Variables:**
```
base_url: http://localhost:5000
auth_token: (auto-filled after login)
```

**Auto-Token Script for Login (Tests tab):**
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    if (response.success && response.data.token) {
        pm.environment.set("auth_token", response.data.token);
        console.log("✅ Token saved to environment");
    }
}
```

---

## ⚠️ **COMMON ERROR CODES**

| Code | Error | Meaning |
|------|-------|---------|
| 400 | Bad Request | Validation failed, missing fields |
| 401 | Unauthorized | No token, invalid token, wrong password |
| 403 | Forbidden | Domain not allowed, email not verified, not admin |
| 404 | Not Found | User not found, invalid route |
| 500 | Server Error | Database issues, email sending failed |

---

## 🎯 **QUICK TEST SEQUENCE**

1. **Health Check** → `GET /api/health`
2. **Register Aramco User** → `POST /api/auth/register` (with aramco.com email)
3. **Check Email** → Look for verification email
4. **Verify Email** → `GET /api/auth/verify-email/:token`
5. **Login** → `POST /api/auth/login` (token auto-saved)
6. **Get Profile** → `GET /api/auth/me`
7. **Update Profile** → `PUT /api/user/profile`
8. **Test Invalid Domain** → Try registering gmail.com (should fail)

**Ready to start testing!** 🚀