# 🎬 Movie Management API

This project provides APIs for **user authentication** and **movie management** (including bulk movie upload via Excel).

---

## 🚀 Features

- User Signup & Login with JWT authentication (cookies-based).
- Role-based access control (Admin only for some routes).
- Upload movies manually or in bulk via Excel file.
- Secure password storage using `bcryptjs`.
- Token handling with cookies.

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Auth**: JWT + Cookies
- **File Upload**: Multer + XLSX

---

## 📥 Postman Collection

To make testing easier, we have included a Postman collection.

- Import the collection into Postman:
  1. Download the file → [movie-api.postman_collection.json](./postman/movie-api.postman_collection.json)
  2. Open Postman → `Import` → select the JSON file.
  3. Use the requests directly.

This collection contains:

- Signup & Login requests
- Profile request
- Create Movie
- Bulk Upload Movies
- Get Movies

---

## 📦 Installation

1. Clone the repository
   ```bash
   git clone https://github.com/amarchauhan9758/movieManagementList
   cd  movieBackend
   ```

Install dependencies

npm install
Create a .env file in the root folder:

PORT=5000
MONGO_URI=mongodb://localhost:27017/moviesdb
JWT_SECRET=your_jwt_secret
Start the server

npm run dev
📌 API Endpoints
🔑 Auth Routes

Login – POST /auth/login

{
"email": "admin@example.com",
"password": "admin@123#"
}
Response → JWT Token (stored in cookie).

🎬 Movie Routes
🔹 Create Movie – POST /movies/create

{
"name": "Inception",
"rating": 9,
"genres": ["Sci-Fi", "Thriller"]
}
Bulk Upload Movies – POST /movies/bulk-upload

Upload an Excel file with columns: name, rating, genres (comma separated).

Example row:

name | rating | genres
Inception | 9 | Sci-Fi,Thriller
Avatar | 8 | Action,Fantasy
