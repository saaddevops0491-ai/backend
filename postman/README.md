# Postman Collections for Saher Flow Solutions API

Complete API testing collections organized by functionality for easy testing and development.

## Collections Overview

### 01 - Authentication API
Complete authentication flow testing including:
- User registration with domain validation
- Login/logout functionality
- Password reset and change
- Email verification
- Input validation tests

### 02 - Company Management API
Company CRUD operations for admin users:
- Create, read, update, delete companies
- Domain management and validation
- Access control testing
- Bulk operations

### 03 - User Management API
User management and profile operations:
- Admin user management endpoints
- User profile updates
- Role-based access control
- Account management

### 04 - Integration Tests
End-to-end workflow testing:
- Complete company registration flow
- User registration and login flow
- Password reset workflow
- Cross-feature integration

### 05 - Health Check & Utilities
System health and utility endpoints:
- API health monitoring
- Domain validation utilities
- Error handling tests
- Data validation

## Quick Setup

1. **Import All Collections**
   ```bash
   # Import all JSON files in Postman:
   - 01_Authentication.postman_collection.json
   - 02_Company_Management.postman_collection.json
   - 03_User_Management.postman_collection.json
   - 04_Integration_Tests.postman_collection.json
   - 05_Health_and_Utilities.postman_collection.json
   ```

2. **Create Environment**
   Create a new environment in Postman with these variables:
   ```
   base_url: http://localhost:5000
   admin_token: (auto-populated)
   user_token: (auto-populated)
   company_id: (auto-populated)
   test_email: testuser@newcompany.com
   ```

3. **Start Testing**
   - Begin with "05 - Health Check" to verify API is running
   - Run "01 - Authentication" to test login and get tokens
   - Proceed with other collections as needed

## Testing Workflows

### Basic API Testing
1. Health Check → Authentication → Company Management
2. Test all CRUD operations
3. Verify access controls

### Complete Integration Testing
1. Run "04 - Integration Tests" collection
2. Tests complete user journey from company creation to user registration
3. Includes cleanup and validation

### Security Testing
1. Test unauthorized access attempts
2. Verify role-based permissions
3. Test token validation
4. Check input sanitization

## Auto-Generated Variables

The collections automatically save important values:
- **admin_token**: Saved after admin login
- **user_token**: Saved after user login  
- **company_id**: Saved after creating a company
- **test_email**: Used for integration testing

## Default Credentials

### Admin Account
- **Email**: admin@saherflow.com
- **Password**: Admin123

### Test User (after registration)
- **Email**: john@aramco.com
- **Password**: Password123

## Response Formats

All API responses follow consistent formats:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ /* validation errors */ ]
}
```

## Testing Best Practices

1. **Sequential Testing**: Run collections in numerical order (01 → 05)
2. **Environment Setup**: Always set up environment variables first
3. **Token Management**: Tokens are auto-saved, but verify they're set
4. **Data Cleanup**: Use integration tests for proper cleanup
5. **Error Validation**: Test both success and failure scenarios

## Troubleshooting

### Common Issues
- **401 Unauthorized**: Check if token is set in environment
- **403 Forbidden**: Verify user has admin role for admin endpoints
- **500 Server Error**: Check if backend server is running
- **Domain Validation Fails**: Ensure company exists with that domain

### Debug Tips
- Check Postman console for auto-saved variables
- Verify environment is selected
- Ensure backend server is running on port 5000
- Check MongoDB connection in backend logs