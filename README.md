# 🧱 Tiles Gallery

A modern full-stack tile marketplace built with **Next.js**, **Express.js**, **PostgreSQL**, and **Prisma**.

The application provides a complete tile browsing and marketplace experience with authentication, wishlist, cart management, user profiles, categories, and an admin dashboard.

---

## 🌐 Live Project

### Frontend

https://tiles-gallery-prisma.vercel.app

### Backend API

https://tiles-gallery-api-ywt8.onrender.com

### GitHub Repository

https://github.com/Safa-Anan08/tiles-gallery-prisma

---

## ✨ Features

### 🔐 Authentication

- Email & Password Registration
- Email & Password Login
- Google Sign In
- JWT-based authentication
- Protected routes
- Role-based authorization
- Automatic logout handling
- User profile management

---

### 🏠 Homepage

- Modern tile showcase
- Hero/banner section
- Featured tiles
- Promotional sections
- Scrolling marquee section
- Responsive design
- Smooth hover animations

---

### 🧱 All Tiles

Users can:

- Browse all available tiles
- Search tiles
- Filter tiles
- View tile details
- Check price
- Check stock status
- View category
- View material
- View dimensions

---

### 🔎 Tile Details

Each tile provides:

- Large preview image
- Tile name
- Description
- Price
- Category
- Material
- Dimensions
- Stock quantity
- Availability status

Users can:

- Add tile to wishlist
- Remove tile from wishlist
- Add tile to cart
- Remove tile from cart

---

### ❤️ Wishlist

Authenticated users can:

- Add tiles to wishlist
- Remove tiles from wishlist
- View wishlist
- Manage wishlist from their profile

---

### 🛒 Cart

Features include:

- Add tiles to cart
- Remove cart items
- Cart item counter
- Navbar cart badge
- Cart preview
- Dedicated cart page
- Persistent cart data for authenticated users

---

### 👤 My Profile

Users can:

- View profile information
- Update profile
- View wishlist
- View cart
- Manage account information

---

### 📂 Categories

Tiles are organized by categories.

Category information is used for:

- Tile filtering
- Tile classification
- Product organization

Current categories include:

- Ceramic
- Marble
- Porcelain
- Stone

---

### 🛠️ Admin Dashboard

Admin users have access to protected management features.

Admin functionality includes:

- Manage tiles
- Add new tiles
- Edit tiles
- Delete tiles
- Manage users
- Manage product information
- Protected admin routes

---

### 📱 Responsive UI

The application is optimized for:

- Desktop
- Tablet
- Mobile

#### Desktop Navigation

- Home
- All Tiles
- Profile
- Cart
- Login / Logout

#### Mobile Navigation

- Hamburger menu
- Responsive layout
- Mobile-friendly controls

---

# 🧰 Tech Stack

## Frontend

- **Next.js**
- **React**
- **JavaScript / JSX**
- **Tailwind CSS**
- **Lucide React**
- **React Icons**

---

## Backend

- **Node.js**
- **Express.js**
- **TypeScript**
- **REST API**

---

## Database

- **PostgreSQL**
- **Prisma ORM**

### Main Database Entities

- User
- Account
- Session
- Tile
- Category
- Cart
- Wishlist
- Message
- Verification

---

## Authentication

- **JWT**
- **Google Identity Services**
- Password-based authentication
- Role-based authorization
- bcrypt password hashing

---

# 🏗️ Project Structure

```text
tiles-gallery/
│
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── server/
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── schemas/
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   ├── package.json
│   └── tsconfig.json
│
├── src/
│   ├── app/
│   │   ├── admin/
│   │   ├── all-tiles/
│   │   ├── cart/
│   │   ├── login/
│   │   ├── register/
│   │   ├── wishlist/
│   │   └── tile/
│   │
│   ├── components/
│   └── lib/
│
├── public/
│
├── package.json
└── README.md
```

---

# 🚀 Installation

## 1. Clone Repository

```bash
git clone https://github.com/Safa-Anan08/tiles-gallery-prisma
cd tiles-gallery-prisma
```

## 2. Install Frontend Dependencies

```bash
npm install
```

## 3. Install Backend Dependencies

```bash
cd server
npm install
cd ..
```

## 4. Configure Environment Variables

Create a `.env` file according to the project's environment configuration.

Example:

```env
DATABASE_URL="your_postgresql_database_url"
JWT_SECRET="your_jwt_secret"
GOOGLE_CLIENT_ID="your_google_client_id"
```

## 5. Run Prisma Migration

```bash
npx prisma migrate dev
```

## 6. Generate Prisma Client

```bash
npx prisma generate
```

## 7. Run Frontend

```bash
npm run dev
```

## 8. Run Backend

From the `server` directory:

```bash
npm run dev
```

---

# 🌍 Deployment

## Frontend — Vercel

The Next.js frontend is deployed on Vercel.

Production frontend:

https://tiles-gallery-prisma.vercel.app

## Backend — Render

The Express.js backend is deployed on Render.

Production API:

https://tiles-gallery-api-ywt8.onrender.com

## Database

The application uses PostgreSQL with Prisma ORM.

---

# 📚 API Documentation

## Base URL

```text
https://tiles-gallery-api-ywt8.onrender.com/api
```

---

# 🔐 Authentication API

## Register User

**POST** `/auth/register`

Creates a new user account.

### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Success Response — 201

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER"
    }
  }
}
```

---

## Login

**POST** `/auth/login`

Authenticates a user and returns a JWT token.

### Request Body

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Success Response — 200

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "JWT_TOKEN",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER"
    }
  }
}
```

---

## Get Current User

**GET** `/auth/me`

Returns the currently authenticated user.

### Headers

```text
Authorization: Bearer JWT_TOKEN
```

### Success Response — 200

```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER"
  }
}
```

---

# 👤 Users API

## Get All Users

**GET** `/users`

Returns all users.

### Headers

```text
Authorization: Bearer JWT_TOKEN
```

### Success Response — 200

```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": []
}
```

---

## Get User By ID

**GET** `/users/:id`

Returns a specific user.

### Headers

```text
Authorization: Bearer JWT_TOKEN
```

### Success Response — 200

```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {}
}
```

---

## Update User

**PUT** `/users/:id`

Updates user information.

### Headers

```text
Authorization: Bearer JWT_TOKEN
Content-Type: application/json
```

### Request Body

```json
{
  "name": "Updated Name",
  "image": "https://example.com/profile.jpg"
}
```

### Success Response — 200

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {}
}
```

---

## Delete User

**DELETE** `/users/:id`

Soft deletes a user.

### Headers

```text
Authorization: Bearer JWT_TOKEN
```

### Success Response — 200

```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": null
}
```

---

# 📂 Categories API

## Get All Categories

**GET** `/categories`

Returns all active tile categories.

### Success Response — 200

```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": [
    {
      "id": "category_id",
      "name": "Ceramic",
      "slug": "ceramic",
      "description": "Durable and versatile ceramic tiles for walls and floors."
    }
  ]
}
```

---

## Get Category By ID

**GET** `/categories/:id`

Returns a specific category.

### Success Response — 200

```json
{
  "success": true,
  "message": "Category retrieved successfully",
  "data": {}
}
```

---

## Create Category

**POST** `/categories`

Creates a new tile category.

### Headers

```text
Authorization: Bearer JWT_TOKEN
Content-Type: application/json
```

### Request Body

```json
{
  "name": "Mosaic",
  "slug": "mosaic",
  "description": "Decorative mosaic tiles"
}
```

### Success Response — 201

```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {}
}
```

---

## Update Category

**PUT** `/categories/:id`

Updates an existing category.

### Headers

```text
Authorization: Bearer JWT_TOKEN
Content-Type: application/json
```

### Request Body

```json
{
  "name": "Premium Mosaic",
  "description": "Premium decorative mosaic tiles"
}
```

### Success Response — 200

```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {}
}
```

---

## Delete Category

**DELETE** `/categories/:id`

Soft deletes a category.

### Headers

```text
Authorization: Bearer JWT_TOKEN
```

### Success Response — 200

```json
{
  "success": true,
  "message": "Category deleted successfully",
  "data": null
}
```

---

# 🧱 Tiles API

The Tile API manages the main products in the marketplace.

## Get All Tiles

**GET** `/tiles`

Returns all available tiles.

### Success Response — 200

```json
{
  "success": true,
  "message": "Tiles retrieved successfully",
  "data": []
}
```

---

## Get Tile By ID

**GET** `/tiles/:id`

Returns detailed information about a tile.

### Success Response — 200

```json
{
  "success": true,
  "message": "Tile retrieved successfully",
  "data": {
    "id": "tile_001",
    "name": "Premium Ceramic Tile",
    "description": "Modern ceramic tile",
    "price": 25,
    "stock": 100,
    "categoryId": "category_id"
  }
}
```

---

## Create Tile

**POST** `/tiles`

Creates a new tile product.

### Headers

```text
Authorization: Bearer JWT_TOKEN
Content-Type: application/json
```

### Request Body

```json
{
  "name": "Premium Ceramic Tile",
  "description": "Modern ceramic tile",
  "price": 25,
  "stock": 100,
  "categoryId": "category_id",
  "material": "Ceramic",
  "dimensions": "12x24",
  "image": "https://example.com/tile.jpg"
}
```

### Success Response — 201

```json
{
  "success": true,
  "message": "Tile created successfully",
  "data": {}
}
```

---

## Update Tile

**PUT** `/tiles/:id`

Updates an existing tile.

### Headers

```text
Authorization: Bearer JWT_TOKEN
Content-Type: application/json
```

### Request Body

```json
{
  "name": "Updated Ceramic Tile",
  "price": 30,
  "stock": 80
}
```

### Success Response — 200

```json
{
  "success": true,
  "message": "Tile updated successfully",
  "data": {}
}
```

---

## Delete Tile

**DELETE** `/tiles/:id`

Soft deletes a tile.

### Headers

```text
Authorization: Bearer JWT_TOKEN
```

### Success Response — 200

```json
{
  "success": true,
  "message": "Tile deleted successfully",
  "data": null
}
```

---

# ❤️ Wishlist API

Wishlist operations require authentication.

## Get Wishlist

**GET** `/wishlist`

Returns the authenticated user's wishlist.

### Headers

```text
Authorization: Bearer JWT_TOKEN
```

### Success Response — 200

```json
{
  "success": true,
  "message": "Wishlist retrieved successfully",
  "data": []
}
```

---

## Add To Wishlist

**POST** `/wishlist`

Adds a tile to the user's wishlist.

### Headers

```text
Authorization: Bearer JWT_TOKEN
Content-Type: application/json
```

### Request Body

```json
{
  "tileId": "tile_001"
}
```

### Success Response — 201

```json
{
  "success": true,
  "message": "Tile added to wishlist",
  "data": {}
}
```

---

## Remove From Wishlist

**DELETE** `/wishlist/:tileId`

Removes a tile from the wishlist.

### Headers

```text
Authorization: Bearer JWT_TOKEN
```

### Success Response — 200

```json
{
  "success": true,
  "message": "Tile removed from wishlist",
  "data": null
}
```

---

# 🛒 Cart API

Cart operations require authentication.

## Get Cart

**GET** `/cart`

Returns the authenticated user's cart.

### Headers

```text
Authorization: Bearer JWT_TOKEN
```

### Success Response — 200

```json
{
  "success": true,
  "message": "Cart retrieved successfully",
  "data": []
}
```

---

## Add To Cart

**POST** `/cart`

Adds a tile to the user's cart.

### Headers

```text
Authorization: Bearer JWT_TOKEN
Content-Type: application/json
```

### Request Body

```json
{
  "tileId": "tile_001",
  "quantity": 2
}
```

### Success Response — 201

```json
{
  "success": true,
  "message": "Tile added to cart",
  "data": {}
}
```

---

## Remove From Cart

**DELETE** `/cart/:tileId`

Removes a tile from the cart.

### Headers

```text
Authorization: Bearer JWT_TOKEN
```

### Success Response — 200

```json
{
  "success": true,
  "message": "Tile removed from cart",
  "data": null
}
```

---

# 🏥 Health Check

## API Health

**GET** `/health`

Checks whether the API server is online.

### Success Response — 200

```json
{
  "success": true,
  "message": "Tiles Gallery Express API Server",
  "data": {
    "status": "online",
    "version": "1.0.0"
  }
}
```

---

# 🔑 Authentication Header

Protected endpoints require a JWT token.

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

---

# 📊 HTTP Status Codes

| Status Code | Meaning |
|---|---|
| 200 | Request successful |
| 201 | Resource created successfully |
| 400 | Bad request / validation error |
| 401 | Authentication required / invalid token |
| 403 | Forbidden / insufficient permissions |
| 404 | Resource not found |
| 409 | Resource conflict |
| 500 | Internal server error |

---

# 📦 Standard API Response

All API responses follow a consistent structure.

## Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

## Error Response

```json
{
  "success": false,
  "message": "Error message",
  "data": null
}
```

---

# 📝 Notes

- JWT authentication is used for protected endpoints.
- Admin-only operations require the `ADMIN` role.
- Delete operations use soft deletion where supported.
- Tile products are represented by the `Tile` model.
- Categories are represented by the `Category` model.
- Wishlist and cart operations require authentication.
- Reviews are not currently implemented.

---

# 🚧 Future Improvements

Potential future features:

- Checkout system
- Online payment integration
- Order management
- Order history
- Advanced product filtering
- Product comparison
- Inventory management
- Admin analytics dashboard
- Image optimization
- Email notifications

---

# 👨‍💻 Author

**Safa Anan**

Frontend Developer passionate about building modern, responsive, and user-friendly web applications.