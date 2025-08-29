# Complete Setup Instructions

## 1. Email Configuration (CRITICAL)

### Saher Flow Email Setup
Your email is configured as: `saad.mahmood@saherflow.com`

**You need to get the following information from your email provider:**

1. **SMTP Server Settings:**
   - Host (currently set to Gmail's SMTP)
   - Port (currently 587)
   - Security type (TLS/SSL)

2. **Authentication:**
   - Your email password or app-specific password
   - Update `EMAIL_PASS` in `.env` file

3. **Common SMTP Settings by Provider:**
   - **Gmail:** `smtp.gmail.com:587` (TLS)
   - **Outlook:** `smtp-mail.outlook.com:587` (TLS)
   - **Custom Domain:** Contact your hosting provider for SMTP settings

4. **Update .env file:**
   ```
   EMAIL_HOST=your-smtp-server
   EMAIL_PORT=587
   EMAIL_USER=saad.mahmood@saherflow.com
   EMAIL_PASS=your-email-password
   ```

## 2. Database Setup Verification

Your MongoDB connection string looks correct. To verify:

1. **Test Connection:**
   ```bash
   npm run dev
   ```
   Look for "Connected to MongoDB" in console

2. **If Connection Fails:**
   - Check MongoDB Atlas dashboard
   - Verify IP whitelist (add 0.0.0.0/0 for development)
   - Ensure database user has read/write permissions

## 3. Testing Checklist

### Before Testing:
- [ ] Email credentials configured
- [ ] MongoDB connected successfully
- [ ] Server running on port 5000
- [ ] Postman installed

### Test Sequence:
1. [ ] Health check endpoint
2. [ ] Register new user
3. [ ] Check email inbox for verification
4. [ ] Verify email using token
5. [ ] Login with verified account
6. [ ] Test protected routes
7. [ ] Test password reset flow

## 4. Email Verification Requirement

The system now requires email verification for:
- Updating profile
- Changing password
- Deleting account

Users will get this error if not verified:
```json
{
  "success": false,
  "message": "Please verify your email address before accessing this resource. Check your inbox for the verification email."
}
```

## 5. Next Steps

1. **Configure your actual email credentials**
2. **Test the registration flow**
3. **Verify emails are being sent**
4. **Test all endpoints using the Postman guide**
5. **Create an admin user for testing admin endpoints**

## 6. Creating Admin User

After registering a normal user, you can manually promote them to admin:

1. **Connect to MongoDB:**
   - Use MongoDB Compass or Atlas web interface
   - Navigate to your database > users collection

2. **Update user role:**
   ```javascript
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { role: "admin" } }
   )
   ```

## 7. Security Recommendations

- Change JWT_SECRET to a strong, unique value
- Use environment-specific CLIENT_URL
- Enable rate limiting in production
- Use HTTPS in production
- Regularly rotate JWT secrets
- Monitor failed login attempts