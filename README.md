# Adaq

## Overview
Adaq Plate Number verification system built with Node.js and Express.js, powering a secure vehicle plate number verification search. It leverages MongoDB with Mongoose for data modeling and persistence, and uses JSON Web Tokens (JWT) for stateless authentication.

## Features
- **Express**: Robust and minimalist web framework for building the API server and routing.
- **Mongoose**: Elegant object data modeling (ODM) for interacting with the MongoDB database.
- **JSON Web Token (JWT)**: Securely transmits information between parties for user authentication and authorization.
- **bcryptjs**: Hashes user passwords for secure storage.
- **Multer**: Handles `multipart/form-data` for file uploads, specifically for user passport images.
- **express-rate-limit**: Provides basic rate-limiting to protect API endpoints against brute-force attacks.
- **Nodemailer**: Facilitates sending emails for functionalities like password resets.

## Getting Started
### Installation

**1. Clone the repository:**
```bash
git clone https://github.com/Webziro/Adaq.git
cd Adaq
```

**2. Backend Setup:**
```bash
cd backend
npm install
# Create a .env file in this directory (see Environment Variables below)
# Start the server
node server.js
```

**3. Frontend Setup (in a new terminal):**
```bash
# From the root Adaq directory
npm install
npm run dev
```

### Environment Variables
Create a `.env` file in the `backend` directory and add the following variables.

```ini
# Server Configuration
PORT=5000

## API Documentation
### Base URL
`http://localhost:5000/api`

### Endpoints
#### **Authentication**
---
#### POST /auth/register
Registers a new user account.

**Request**:
```json
{
  "name": "Stanley Amaziro",
  "email": "stanley.stan@example.com",
  "password": "StrongPassword123!"
}
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors**:
- `400 Bad Request`: User already exists.
- `500 Internal Server Error`: Server processing error.

---
#### POST /auth/login
Authenticates a user and returns a JWT.

**Request**:
```json
{
  "email": "john.doe@example.com",
  "password": "StrongPassword123!"
}
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors**:
- `400 Bad Request`: Invalid credentials.
- `500 Internal Server Error`: Server processing error.

---
#### POST /auth/admin-login
Authenticates an admin user and returns a JWT.

**Request**:
```json
{
  "email": "admin@example.com",
  "password": "AdminPassword123!"
}
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors**:
- `400 Bad Request`: Invalid credentials.
- `403 Forbidden`: Not authorized as admin.
- `500 Internal Server Error`: Server processing error.

---
#### POST /auth/forgot-password
Initiates the password reset process by sending a code to the user's email.

**Request**:
```json
{
  "email": "john.doe@example.com"
}
```

**Response**:
```json
{
  "msg": "If the email exists, a reset code has been sent.",
  "success": true
}
```

**Errors**:
- `400 Bad Request`: Email is required.
- `500 Internal Server Error`: Server processing error.

---
#### POST /auth/verify-reset-code
Verifies the password reset code sent to the user's email.

**Request**:
```json
{
  "email": "john.doe@example.com",
  "code": "123456"
}
```

**Response**:
```json
{
  "msg": "Code verified successfully.",
  "success": true
}
```

**Errors**:
- `400 Bad Request`: Invalid or expired reset code. / Too many failed attempts.
- `500 Internal Server Error`: Server processing error.

---
#### POST /auth/reset-password
Sets a new password for the user after successful code verification.

**Request**:
```json
{
  "email": "john.doe@example.com",
  "code": "123456",
  "newPassword": "NewStrongPassword456!"
}
```

**Response**:
```json
{
  "msg": "Password reset successful. You can now login with your new password.",
  "success": true
}
```

**Errors**:
- `400 Bad Request`: Invalid/expired session, invalid code, or password does not meet requirements.
- `500 Internal Server Error`: Server processing error.

#### **Plate Requests**
*(Requires authentication)*
---
#### POST /requests
Creates a new vehicle plate number request for the authenticated user.

**Request**:
```json
{
  "vehicleColor": "Blue",
  "vehicleChassisNumber": "1HGBH41JXMN109183"
}
```

**Response**:
```json
{
    "_id": "60c72b2f9b1d8c001f8e4c6a",
    "user": "60c72b1f9b1d8c001f8e4c69",
    "vehicleColor": "Blue",
    "vehicleChassisNumber": "1HGBH41JXMN109183",
    "plateRequestStatus": "pending",
    "requestDate": "2023-05-15T10:00:00.000Z"
}
```

**Errors**:
- `400 Bad Request`: Plate request with this chassis number already exists.
- `401 Unauthorized`: No token or invalid token provided.
- `500 Internal Server Error`: Server processing error.

---
#### GET /requests
Retrieves plate requests. Admins get all requests; regular users get only their own.

**Request**:
*No payload required.*

**Response**:
```json
[
  {
    "_id": "60c72b2f9b1d8c001f8e4c6a",
    "user": {
      "_id": "60c72b1f9b1d8c001f8e4c69",
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "vehicleColor": "Blue",
    "vehicleChassisNumber": "1HGBH41JXMN109183",
    "plateRequestStatus": "pending",
    "requestDate": "2023-05-15T10:00:00.000Z"
  }
]
```

**Errors**:
- `401 Unauthorized`: No token or invalid token provided.
- `500 Internal Server Error`: Server processing error.

---
#### PUT /requests/:id/status
Updates the status of a specific plate request. (Admin only)

**Request**:
```json
{
  "status": "in-progress"
}
```

**Response**:
```json
{
    "_id": "60c72b2f9b1d8c001f8e4c6a",
    "user": "60c72b1f9b1d8c001f8e4c69",
    "vehicleColor": "Blue",
    "vehicleChassisNumber": "1HGBH41JXMN109183",
    "plateRequestStatus": "in-progress",
    "requestDate": "2023-05-15T10:00:00.000Z"
}
```

**Errors**:
- `401 Unauthorized`: Not authorized to update status.
- `403 Forbidden`: User is not an admin.
- `404 Not Found`: Plate request not found.
- `500 Internal Server Error`: Server processing error.

---
#### DELETE /requests/:id
Deletes a specific plate request. (Admin only)

**Request**:
*No payload required.*

**Response**:
```json
{
  "msg": "Plate request removed"
}
```

**Errors**:
- `401 Unauthorized`: Not authorized to delete request.
- `403 Forbidden`: User is not an admin.
- `404 Not Found`: Plate request not found.
- `500 Internal Server Error`: Server processing error.

#### **User Profile**
*(Requires authentication)*
---
#### PUT /profile
Updates the profile information for the authenticated user.

**Request**:
```json
{
  "nin": "1234567890",
  "vehicleColor": "Red",
  "vehicleChassisNumber": "9HGBH41JXMN109184"
}
```

**Response**:
```json
{
    "_id": "60c72b1f9b1d8c001f8e4c69",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "nin": "1234567890",
    "vehicleColor": "Red",
    "vehicleChassisNumber": "9HGBH41JXMN109184",
    "position": "user",
    "plateRequestStatus": "pending",
    "date": "2023-05-15T09:30:00.000Z"
}
```

**Errors**:
- `401 Unauthorized`: No token or invalid token provided.
- `404 Not Found`: User not found.
- `500 Internal Server Error`: Server processing error.

---
#### POST /profile/passport
Uploads a passport image for the authenticated user.

**Request**:
`multipart/form-data` with a single file field named `passportImage`.

**Response**:
```json
{
  "msg": "Passport image uploaded successfully",
  "filePath": "/uploads/passportImage-1623686896738.png"
}
```

**Errors**:
- `400 Bad Request`: No file uploaded or invalid file type (Images only).
- `401 Unauthorized`: No token or invalid token provided.
- `404 Not Found`: User not found.
- `500 Internal Server Error`: Server processing error.