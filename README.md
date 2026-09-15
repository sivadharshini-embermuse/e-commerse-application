# 🛒 E-Commerce Application

A full-stack E-Commerce web application built using **React, Node.js, Express.js, and MongoDB**.

This project provides a complete online shopping experience for customers along with an **Admin Dashboard** for managing products, users, orders, reviews, and store information.

The application is designed with a modern responsive UI and follows a client-server architecture with RESTful APIs.

---

## 📌 Project Overview

This E-Commerce application allows customers to:

- Create an account and log in securely
- Browse products
- Search and filter products
- View product details
- Add products to cart
- Manage cart quantities
- Place orders
- View order details
- Manage their profile
- Upload profile images
- Reset forgotten passwords
- Submit product reviews
- Browse About Us and Contact pages

Administrators can:

- View dashboard statistics
- Manage products
- Add products with images
- Update products
- Delete products
- Manage customer orders
- Update order status
- Manage users
- Change user roles
- Delete users
- Manage product reviews

---

# ✨ Features

## 👤 Customer Features

### Authentication

- User Registration
- User Login
- User Logout
- JWT-based authentication
- Password hashing using bcrypt
- Forgot Password
- Password Reset
- Profile Management
- Profile Avatar Upload

### 🛍️ Product Browsing

- View all products
- Product details page
- Product search
- Category filtering
- Price filtering
- Pagination
- Product ratings and reviews

### 🛒 Shopping Cart

- Add products to cart
- Remove products from cart
- Update product quantity
- Persistent cart functionality
- Cart total calculation

### 📦 Orders

- Place orders
- View order details
- View order history
- Order status tracking

### ⭐ Reviews

- Product reviews
- Product ratings
- Review management

### 📄 Additional Pages

- Home
- Products
- Product Details
- Cart
- Checkout
- About Us
- Contact Us
- User Profile
- Orders

---

# 👨‍💼 Admin Dashboard

The application includes a dedicated admin panel.

## 📊 Dashboard

The admin dashboard provides live store information such as:

- Total Revenue
- Total Orders
- Total Products
- Total Users
- Recent Orders
- Store Activity

Dashboard information is retrieved from the backend rather than using hard-coded values.

---

## 📦 Product Management

Admins can:

- View all products
- Create new products
- Edit existing products
- Delete products
- Upload product images
- Manage product information

Product images are stored using **Cloudinary**.

---

## 📋 Order Management

Admins can:

- View all customer orders
- View individual order details
- Update order status
- Delete orders

Supported order statuses include:

- Processing
- Shipped
- Delivered

---

## 👥 User Management

Admins can:

- View registered users
- View user information
- Change user roles
- Promote users to admin
- Remove admin privileges
- Delete users

The system also prevents an administrator from accidentally deleting their own account through the admin interface.

---

## ⭐ Review Management

Admins can:

- View product reviews
- Delete inappropriate or unwanted reviews

---

# 🔐 Security

Security was considered throughout the application.

### Authentication Security

- JWT authentication
- Password hashing using bcrypt
- Protected admin routes
- Role-based authorization
- Secure authentication cookies

### API Security

- Request rate limiting
- Protected admin APIs
- Input validation
- Controlled product field updates
- Razorpay signature verification code is implemented for the payment flow

### Environment Variables

Sensitive credentials are stored outside the source code.

Examples include:

- MongoDB connection string
- JWT secret
- Cloudinary credentials
- SMTP credentials
- Payment credentials

Sensitive environment files are excluded from Git using `.gitignore`.

---

# ☁️ Cloudinary Integration

Cloudinary is used for image management.

Currently used for:

- User profile avatars
- Product images

Product image uploads support multiple images and include file validation.

Image uploads are handled through the backend using `express-fileupload`.

---

# 📧 Email Integration

The application uses SMTP/Nodemailer for email functionality.

Email functionality includes:

- Forgot password email
- Password reset link

SMTP credentials are configured through environment variables and are not stored in the repository.

---

# 💳 Payment Integration

The project contains Razorpay payment integration and server-side payment signature verification.

However, **online payment is currently disabled/skipped for the deployed version** because the existing Razorpay credentials are not active.

The payment-related code is kept separate so that Razorpay can be enabled later by configuring valid credentials.

---

# 🏗️ Technology Stack

## Frontend

- React
- Vite
- React Router DOM
- Redux Toolkit
- Axios
- Tailwind CSS

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

## Authentication

- JWT
- bcryptjs
- Cookie Parser

## Cloud & Services

- Cloudinary
- Nodemailer
- Razorpay integration

## Development Tools

- Git
- GitHub
- npm

---

# 🏛️ Project Architecture

The project follows a client-server architecture.

```text
                    ┌──────────────────────┐
                    │      Customer        │
                    │      Browser         │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   React Frontend     │
                    │      + Vite          │
                    │   + Redux Toolkit     │
                    └──────────┬───────────┘
                               │
                         REST API
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Node.js + Express  │
                    │       Backend        │
                    └───────┬──────┬───────┘
                            │      │
                 ┌──────────┘      └──────────┐
                 ▼                            ▼
        ┌─────────────────┐          ┌─────────────────┐
        │    MongoDB      │          │    Cloudinary   │
        │    Database     │          │  Image Storage  │
        └─────────────────┘          └─────────────────┘

                            │
                            ▼
                    ┌─────────────────┐
                    │ SMTP / Nodemailer│
                    │  Email Service   │
                    └─────────────────┘


PROJECT STRUCTURE:

E-commerce-application/
│
├── backend/
│   │
│   ├── config/
│   ├── controller/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   │
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── features/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
├── package.json
└── README.md


APPLICATION FLOW
User
 │
 ▼
Registration / Login
 │
 ▼
Browse Products
 │
 ▼
Search / Filter
 │
 ▼
Product Details
 │
 ▼
Add to Cart
 │
 ▼
Checkout
 │
 ▼
Create Order
 │
 ▼
View Order


ADMIN FLOW
Admin Login
     │
     ▼
Admin Dashboard
     │
     ├── Products
     │     ├── Create
     │     ├── Update
     │     └── Delete
     │
     ├── Orders
     │     ├── View
     │     ├── Update Status
     │     └── Delete
     │
     ├── Users
     │     ├── View
     │     ├── Change Role
     │     └── Delete
     │
     └── Reviews
           ├── View
           └── Delete
