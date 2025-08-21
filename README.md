# 🚀 User Management API

A secure RESTful API for user management, built with **Node.js + Express**, featuring JWT authentication, Swagger documentation, and daily request logging.

---

## ✨ Features
- 🔐 **JWT Authentication** with role-based access  
- 📖 **Swagger UI** for interactive API docs  
- 📝 **Daily rotated logs** in `/log`  
- 🛡️ **Security hardened** with Helmet, rate limiting, validation, and CORS  
- 🔑 **Password hashing** with bcrypt  
- 🚦 Centralized error handling with safe messages  
- 📦 Modern ES6 (`type: module`)  

---

## 📦 Installation
```bash
git clone repo
cd your-api
npm install
```

---

## ⚙️ Configuration
Create a `.env` file with your configuration:
```env
PORT=3000
JWT_SECRET=supersecretkey
```

---

## ▶️ Run the API
```bash
npm run start   # development (nodemon)
```

---

## 📖 API Documentation
Swagger UI is available at:
```
http://localhost:3000/api-docs
```

The OpenAPI spec is auto-generated from JSDoc-style comments.

---

## 📂 Logging
Logs are stored in `/log` with **daily rotation**:
```
log/
 ├─ access-2025-08-21.log
 ├─ access-2025-08-22.log
 └─ ...
```

Example log entry:
```
2025-08-21T14:33:42.123Z POST /user 201 25.3 ms - 145 {"id":42,"username":"johndoe","email":"john@example.com"}
```

---

## 📡 Endpoints Overview

| Method | Endpoint          | Description         | Auth |
|--------|-------------------|---------------------|------|
| POST   | `/user`           | Create user         | ✅   |
| GET    | `/user/all`       | Get all users       | ✅   |
| GET    | `/user/{id}`      | Get one user        | ✅   |
| PATCH  | `/user/{id}`      | Update user         | ✅   |
| DELETE | `/user/{id}`      | Delete user         | ✅   |
| POST   | `/auth/login`     | User Login          | ✅   |
| POST   | `/auth//register` | Register new uer    | ✅   |
| POST   | `/auth/logout`    | User Logout         | ✅   |

Full details are available in Swagger UI.

---

## 🔑 Security

This API follows a **security-first approach** to protect users and data.

### ✅ Implemented Security
- **JWT Authentication**
  - All protected routes require a Bearer token
  - Tokens signed with `JWT_SECRET` from `.env`
- **Password Protection**
  - Stored with `bcrypt` hashing
  - Never returned in API responses
- **Role-Based Access**
  - Admin vs user permissions supported
- **Helmet**
  - Secures HTTP headers
- **CORS**
  - Restricted to trusted origins
- **Rate Limiting**
  - Protects against brute force / DDoS
- **Input Validation**
  - Requests validated against schemas
  - Invalid payloads rejected with safe error messages
- **Centralized Error Handling**
  - No stack traces exposed to clients
  - Detailed errors logged in `/log`
- **Logging**
  - Daily rotated logs for all requests & responses
  - Error logs stored separately for auditing

### 🚨 Reporting Vulnerabilities
If you discover a security issue, **do not open a public issue**.  
Instead, contact the maintainer privately 

### 🛡️ Recommended Practices
- Always use HTTPS in production  
- Rotate JWT secret regularly  
- Use environment variables, never hardcode secrets  
- Monitor logs for suspicious activity  
