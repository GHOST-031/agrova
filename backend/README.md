# Agrova Backend API

Node.js + Express + MongoDB backend for the Agrova agricultural marketplace platform.

## Features

- 🔐 JWT Authentication & Authorization
- 👥 User Management (Consumer, Farmer, Admin roles)
- 🛒 Product Catalog with Search & Filters
- 📦 Order Management with Status Tracking
- 💳 Payment Integration (Stripe & Razorpay)
- 🛍️ Shopping Cart & Wishlist
- ⭐ Product Reviews & Ratings
- 📍 Address Management with GPS
- 💬 Real-time Chat (Socket.io)
- 🔔 Real-time Notifications
- 📧 Email Notifications
- 📤 File Uploads (Cloudinary)
- 🔒 Security (Helmet, Rate Limiting, CORS)

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js 4.18.2
- **Database:** MongoDB with Mongoose 8.0.3
- **Authentication:** JWT + bcryptjs
- **Real-time:** Socket.io 4.6.0
- **File Storage:** Cloudinary
- **Payment:** Stripe & Razorpay
- **Email:** Nodemailer
- **Security:** Helmet, express-rate-limit, CORS

## Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create .env file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables:**
   Edit `.env` file with your credentials:
   - MongoDB connection string
   - JWT secret key
   - Cloudinary credentials
   - Payment gateway keys (Stripe/Razorpay)
   - Email service credentials

## Environment Variables

```env
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/agrova

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Payment Gateways
STRIPE_SECRET_KEY=your_stripe_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Email Service
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@agrova.com
```

## Running the Server

### Development Mode (with nodemon):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Documentation

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | Login user | Public |
| GET | `/me` | Get current user | Private |
| PUT | `/updatepassword` | Update password | Private |
| POST | `/logout` | Logout user | Private |

### Product Routes (`/api/products`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get all products | Public |
| GET | `/:id` | Get single product | Public |
| POST | `/` | Create product | Farmer/Admin |
| PUT | `/:id` | Update product | Farmer/Admin |
| DELETE | `/:id` | Delete product | Farmer/Admin |
| PUT | `/:id/stock` | Update stock | Farmer/Admin |
| GET | `/farmer/:farmerId` | Get farmer products | Public |

### Order Routes (`/api/orders`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/` | Create order | Consumer |
| GET | `/` | Get all orders | Admin |
| GET | `/:id` | Get single order | Private |
| GET | `/my/orders` | Get user orders | Consumer |
| GET | `/farmer/orders` | Get farmer orders | Farmer |
| PUT | `/:id/status` | Update order status | Farmer/Admin |
| PUT | `/:id/tracking` | Update tracking | Farmer/Admin |
| PUT | `/:id/cancel` | Cancel order | Consumer |

### Cart Routes (`/api/cart`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get user cart | Private |
| POST | `/` | Add item to cart | Private |
| PUT | `/:productId` | Update cart item | Private |
| DELETE | `/:productId` | Remove from cart | Private |
| DELETE | `/` | Clear cart | Private |

### Wishlist Routes (`/api/wishlist`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get wishlist | Private |
| POST | `/:productId` | Add to wishlist | Private |
| DELETE | `/:productId` | Remove from wishlist | Private |
| GET | `/check/:productId` | Check if in wishlist | Private |

## Database Models

### User
- Authentication & profile management
- Role-based access (consumer/farmer/admin)
- Farm details for farmers
- Preferences for consumers

### Product
- Product catalog
- Stock management
- Ratings & reviews
- Category organization
- Search indexing

### Order
- Order processing
- Status tracking
- Payment details
- Delivery address
- Order history

### Address
- User addresses
- GPS coordinates
- Default address handling

### Cart
- Shopping cart items
- Quantity management
- Total calculation

### Wishlist
- Saved products
- Quick access

### Review
- Product ratings
- Verified purchase flag
- Rating aggregation

### Category
- Product categorization
- Hierarchical structure

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting (100 requests per 15 minutes)
- Helmet.js security headers
- CORS configuration
- Input validation
- MongoDB injection prevention

## Real-time Features (Socket.io)

### Events:
- `join` - Join chat room
- `sendMessage` - Send chat message
- `typing` - Typing indicator
- `sendNotification` - Push notifications

## Project Structure

```
backend/
├── controllers/       # Route controllers
├── models/           # Mongoose models
├── routes/           # API routes
├── middleware/       # Custom middleware
├── utils/            # Helper functions
├── .env.example      # Environment variables template
├── server.js         # Main server file
└── package.json      # Dependencies
```

## Error Handling

All API responses follow this format:

**Success Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error (development only)"
}
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT License
