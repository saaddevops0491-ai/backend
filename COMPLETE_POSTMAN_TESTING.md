# 🚀 POSTMAN TESTING GUIDE
## Saher Flow Solutions API

### 📋 **QUICK SETUP**
1. Server running on `http://localhost:5000`
2. Use emails from approved domains only
3. Check `saad.mhmoood@gmail.com` for verification emails

---

## 🏥 **1. HEALTH CHECK**

**GET** `http://localhost:5000/api/health`

**Expected Response:**
```json
{
  "message": "Saher Flow Solutions API is running!",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 👤 **2. REGISTER USER**

**POST** `http://localhost:5000/api/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "firstName": "Ahmed",
  "lastName": "Al-Rashid",
  "email": "ahmed.rashid@aramco.com",
  "company": "Saudi Aramco",
  "password": "Password123"
}
```

**✅ Valid Test Emails:**
- `user@aramco.com` (Saudi Aramco)
- `user@adnoc.ae` (ADNOC)
- `user@qtm.com.qa` (QTM)
- `user@pdo.co.om` (PDO)
- `user@dnv.com` (DNV)

**❌ Invalid Emails:** Gmail, Outlook, Yahoo, etc.

**Success Response:**
```json
{
  "success": true,
  "message": "User registered successfully. Please check your email to verify your account."
}
```

---

## ✉️ **3. VERIFY EMAIL**

**GET** `http://localhost:5000/api/auth/verify-email/{token}`

- Get token from email link
- Opens in browser, shows success page
- Auto-redirects to login after 3 seconds

---

## 🔐 **4. LOGIN**

**POST** `http://localhost:5000/api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "ahmed.rashid@aramco.com",
  "password": "Password123"
}
```

**Success Response:**
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
      "isEmailVerified": true
    }
  }
}
```

**💡 Auto-Save Token in Postman:**
Add this to the **Tests** tab:
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    if (response.success && response.data.token) {
        pm.environment.set("auth_token", response.data.token);
    }
}
```

---

## 👨‍💼 **5. GET CURRENT USER** (Protected)

**GET** `http://localhost:5000/api/auth/me`

**Headers:**
```
Authorization: Bearer {{auth_token}}
```

---

## ✏️ **6. UPDATE PROFILE** (Protected + Email Verified)

**PUT** `http://localhost:5000/api/user/profile`

**Headers:**
```
Authorization: Bearer {{auth_token}}
Content-Type: application/json
```

**Body (all optional):**
```json
{
  "firstName": "Ahmed Ali",
  "lastName": "Al-Rashid",
  "company": "Saudi Aramco - Engineering"
}
```

---

## 🔑 **7. FORGOT PASSWORD**

**POST** `http://localhost:5000/api/auth/forgot-password`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "ahmed.rashid@aramco.com"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Password reset email sent successfully"
}
```

---

## 🔄 **8. RESET PASSWORD**

**GET** `http://localhost:5000/api/auth/reset-password/{token}`

- Get token from reset email link
- Opens password reset form in browser
- Enter new password and confirm
- Auto-redirects to login after success

---

## 🔐 **9. CHANGE PASSWORD** (Protected + Email Verified)

**PUT** `http://localhost:5000/api/user/change-password`

**Headers:**
```
Authorization: Bearer {{auth_token}}
Content-Type: application/json
```

**Body:**
```json
{
  "currentPassword": "Password123",
  "newPassword": "NewPassword789"
}
```

---

## 🚪 **10. LOGOUT** (Protected)

**POST** `http://localhost:5000/api/auth/logout`

**Headers:**
```
Authorization: Bearer {{auth_token}}
```

---

## 👥 **11. GET ALL USERS** (Admin Only)

**GET** `http://localhost:5000/api/user/all`

**Headers:**
```
Authorization: Bearer {{auth_token}}
```

**Query Params (Optional):**
- `?page=1&limit=10`

---

## 🎯 **TESTING WORKFLOW**

### **Quick Test Sequence:**
1. **Health Check** → Verify API is running
2. **Register** → Use valid domain email (aramco.com, adnoc.ae, etc.)
3. **Check Email** → Look for verification email
4. **Verify Email** → Click link in email (opens in browser)
5. **Login** → Get JWT token (auto-saved in Postman)
6. **Get Profile** → Test protected route
7. **Update Profile** → Test profile modification
8. **Test Password Reset** → Request reset email and complete flow

### **Admin Testing:**
1. Manually promote user to admin in MongoDB:
   ```javascript
   db.users.updateOne(
     { email: "your-email@aramco.com" },
     { $set: { role: "admin" } }
   )
   ```
2. Test admin endpoints

---

## 🔧 **POSTMAN ENVIRONMENT**

**Create Environment with:**
```
base_url: http://localhost:5000
auth_token: (auto-filled after login)
```

---

## ⚠️ **COMMON ERRORS**

| Code | Error | Solution |
|------|-------|----------|
| 403 | Domain not allowed | Use aramco.com, adnoc.ae, qtm.com.qa, pdo.co.om, or dnv.com |
| 403 | Email not verified | Click verification link in email first |
| 401 | Invalid token | Login again to get new token |
| 403 | Admin required | Promote user to admin in database |

---

## 📧 **EMAIL VERIFICATION FLOW**

1. **Register** → API sends email to `saad.mhmoood@gmail.com`
2. **Check Email** → Click "Verify Email Address" button
3. **Browser Opens** → Shows success page at `localhost:5000`
4. **Auto-Redirect** → Redirects to login page after 3 seconds
5. **Login** → Now you can access all protected features

**Ready to test!** 🚀