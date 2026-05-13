# BlogAppComplete

A full-stack MERN Blog Application where users can register, login, create blogs, edit posts, upload images, and interact with content through a modern responsive interface.

---

# Features

- User Authentication (Signup/Login)
- JWT-based Authorization
- Create, Edit & Delete Blogs
- Upload Blog Images
- Responsive UI
- Protected Routes
- MongoDB Database Integration
- REST API Architecture
- Toast Notifications
- React Router Navigation
- Secure Password Hashing using bcrypt

---

# Tech Stack

## Frontend

- React.js
- Vite
- React Router DOM
- Axios
- CSS / Tailwind CSS

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- dotenv
- cors

---

# Project Structure

```bash
BlogAppComplete/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── App.jsx
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── server.js
│
└── README.md
```

---

# Database Schemas

## User Model

| Field Name | Data Type | Required | Unique |
|------------|------------|----------|---------|
| _id | ObjectId | Yes | Yes |
| username | String | Yes | No |
| email | String | Yes | Yes |
| password | String | Yes | No |
| createdAt | Date | Yes | No |
| updatedAt | Date | Yes | No |

---

## Blog Model

| Field Name | Data Type | Required | Unique |
|------------|------------|----------|---------|
| _id | ObjectId | Yes | Yes |
| title | String | Yes | No |
| content | String | Yes | No |
| image | String | No | No |
| author | ObjectId (ref: User) | Yes | No |
| createdAt | Date | Yes | No |
| updatedAt | Date | Yes | No |

---

## Comment Model

| Field Name | Data Type | Required | Unique |
|------------|------------|----------|---------|
| _id | ObjectId | Yes | Yes |
| comment | String | Yes | No |
| user | ObjectId (ref: User) | Yes | No |
| blog | ObjectId (ref: Blog) | Yes | No |
| createdAt | Date | Yes | No |
| updatedAt | Date | Yes | No |

---

# Installation

## Clone Repository

```bash
git clone https://github.com/Harshitha-27-cell/BlogAppComplete.git
```

---

# Backend Setup

```bash
cd backend
npm install
npm start
```

---

# Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

# Environment Variables

Create a `.env` file inside the backend folder.

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

---

# API Routes

## Auth Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/signup | Register User |
| POST | /api/auth/login | Login User |

## Blog Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/blogs | Get All Blogs |
| POST | /api/blogs | Create Blog |
| PUT | /api/blogs/:id | Update Blog |
| DELETE | /api/blogs/:id | Delete Blog |

---

# Screenshots

- Login Page
- Signup Page
- Home Feed
- Blog Details Page
- Create Blog Page

---

# Future Enhancements

- Like & Save Blogs
- Dark Mode
- Comment System UI
- User Profiles
- Search & Filter Blogs
- AI-based Blog Recommendations
- Real-time Notifications

---

# Author

Kachapuram Harshitha

GitHub: https://github.com/Harshitha-27-cell

---

# Conclusion

This project demonstrates a complete MERN stack blog platform with authentication, CRUD operations, secure backend APIs, and responsive frontend development.