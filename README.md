# Online-Bookstore-Website
A modern Online Bookstore Website built with users to browse books, search by category, manage a shopping cart, place orders, and securely authenticate their accounts. It also includes an admin dashboard for managing books, users, and orders.

## 🚀 Features

### User Features
- User Registration & Login (JWT Authentication)
- Browse all books
- Search books by title, author, or category
- View detailed book information
- Add books to cart
- Update cart quantity
- Remove books from cart
- Place orders
- View order history
- Responsive design for mobile and desktop

### Admin Features
- Secure Admin Login
- Dashboard Overview
- Add new books
- Edit existing books
- Delete books
- Manage categories
- View all users
- Manage customer orders

## 🛠️ Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla JS)

### Backend
- Node.js
- Express.js

### Authentication
- JSON Web Token (JWT)
- bcrypt.js

### Other Tools
- Git
- GitHub
- Postman
- Visual Studio Code

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/Online-Bookstore-Website.git
```

```bash
cd Online-Bookstore-Website
```

---

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Server

```bash
npm start
```

For development:

```bash
npm run dev
```

---

## 📡 API Routes

### Authentication

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile
```

### Books

```
GET     /api/books
GET     /api/books/:id
POST    /api/books
PUT     /api/books/:id
DELETE  /api/books/:id
```

### Cart

```
GET     /api/cart
POST    /api/cart
PUT     /api/cart/:id
DELETE  /api/cart/:id
```

### Orders

```
POST    /api/orders
GET     /api/orders
GET     /api/orders/:id
```

---

