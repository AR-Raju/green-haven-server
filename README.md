# GreenHaven E-commerce API

A comprehensive e-commerce API built with Node.js, Express, TypeScript, and MongoDB. This API provides all the necessary endpoints for building a modern e-commerce platform with features like user authentication, product management, order processing, payment integration, and more.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: User registration, profile management, and admin controls
- **Product Management**: CRUD operations for products with categories and inventory
- **Order Management**: Complete order lifecycle from creation to fulfillment
- **Payment Integration**: Stripe payment processing with webhooks
- **Wishlist**: User wishlist functionality
- **Reviews & Ratings**: Product review system with moderation
- **Blog System**: Content management for blog posts
- **File Upload**: Image upload with ImageBB integration
- **Shipping**: Shipping zones and methods management
- **Analytics**: Comprehensive dashboard analytics
- **Search & Filtering**: Advanced query capabilities
- **Rate Limiting**: API protection and abuse prevention
- **CORS**: Cross-origin resource sharing configuration

## 📋 Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Deployment](#deployment)

## 🛠 Installation

1. Clone the repository:
   \`\`\`bash
   git clone <repository-url>
   cd greenhaven-server
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Create a \`.env\` file in the root directory with the required environment variables (see below).

4. Build the project:
   \`\`\`bash
   npm run build
   \`\`\`

5. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## 🔧 Environment Variables

Create a \`.env\` file in the root directory with the following variables:

\`\`\`env

# Server Configuration

NODE_ENV=development
PORT=5000

# Database

DATABASE_URL=mongodb://localhost:27017/greenhaven

# or for MongoDB Atlas:

# DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/greenhaven

# JWT Secrets

JWT_ACCESS_SECRET=your-super-secret-jwt-access-key
JWT_ACCESS_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-jwt-refresh-key
JWT_REFRESH_EXPIRES_IN=30d

# CORS Origins (comma-separated)

CORS_ORIGIN=http://localhost:3000,https://yourdomain.com

# Stripe (for payments)

STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# ImageBB (for image uploads)

IMAGE_BB_API_KEY=your_imagebb_api_key
\`\`\`

## 📚 API Documentation

### Base URL

- **Development**: \`http://localhost:5000/api\`
- **Production**: \`https://your-domain.vercel.app/api\`

### Postman Collection

Import the provided Postman collection (\`postman/GreenHaven-API.postman_collection.json\`) to test all endpoints. The collection includes:

- Pre-configured environment variables
- Automatic token management
- Sample requests for all endpoints
- Test scripts for response validation

### Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

\`\`\`
Authorization: Bearer <your-jwt-token>
\`\`\`

## 🔐 Authentication

### User Roles

- **user**: Regular customers
- **vendor**: Can manage products and view orders
- **admin**: Full access to all resources

### Authentication Flow

1. Register or login to get JWT tokens
2. Include access token in Authorization header
3. Tokens expire based on configuration
4. Use refresh token to get new access tokens

## 📖 Endpoints

### Health Check

- **GET** \`/\` - API health check
- **GET** \`/health\` - Detailed health status

### Authentication (\`/auth\`)

- **POST** \`/auth/register\` - Register new user
- **POST** \`/auth/login\` - User login
- **GET** \`/auth/me\` - Get current user (requires auth)
- **POST** \`/auth/change-password\` - Change password (requires auth)
- **POST** \`/auth/logout\` - Logout user

### Users (\`/users\`)

- **POST** \`/users\` - Create user (admin only)
- **GET** \`/users\` - Get all users (admin only)
- **GET** \`/users/:id\` - Get single user
- **PATCH** \`/users/:id\` - Update user
- **DELETE** \`/users/:id\` - Delete user (admin only)

### Categories (\`/categories\`)

- **POST** \`/categories\` - Create category (admin/vendor)
- **GET** \`/categories\` - Get all categories
- **GET** \`/categories/:id\` - Get single category
- **PATCH** \`/categories/:id\` - Update category (admin/vendor)
- **DELETE** \`/categories/:id\` - Delete category (admin only)

### Products (\`/products\`)

- **POST** \`/products\` - Create product (admin/vendor)
- **GET** \`/products\` - Get all products
- **GET** \`/products/:id\` - Get single product
- **PATCH** \`/products/:id\` - Update product (admin/vendor)
- **DELETE** \`/products/:id\` - Delete product (admin/vendor)

### Orders (\`/orders\`)

- **POST** \`/orders\` - Create order
- **GET** \`/orders\` - Get all orders (admin/vendor)
- **GET** \`/orders/:id\` - Get single order
- **PATCH** \`/orders/:id\` - Update order status (admin/vendor)

### Payment (\`/payment\`)

- **POST** \`/payment/create-payment-intent\` - Create Stripe payment intent
- **POST** \`/payment/confirm-payment\` - Confirm payment

### Wishlist (\`/wishlist\`)

- **GET** \`/wishlist\` - Get user wishlist (requires auth)
- **POST** \`/wishlist\` - Add to wishlist (requires auth)
- **DELETE** \`/wishlist/:productId\` - Remove from wishlist (requires auth)

### Reviews (\`/reviews\`)

- **POST** \`/reviews\` - Create review (requires auth)
- **GET** \`/reviews\` - Get all reviews
- **GET** \`/reviews/:id\` - Get single review
- **PATCH** \`/reviews/:id\` - Update review (owner/admin)
- **DELETE** \`/reviews/:id\` - Delete review (owner/admin)

### Blog (\`/blog\`)

- **POST** \`/blog\` - Create blog post (admin/vendor)
- **GET** \`/blog\` - Get all blog posts
- **GET** \`/blog/:slug\` - Get single blog post
- **PATCH** \`/blog/:slug\` - Update blog post (owner/admin)
- **DELETE** \`/blog/:slug\` - Delete blog post (owner/admin)

### Upload (\`/upload\`)

- **POST** \`/upload\` - Upload image (multipart/form-data)

### Shipping (\`/shipping\`)

- **POST** \`/shipping/zones\` - Create shipping zone (admin)
- **GET** \`/shipping/zones\` - Get shipping zones
- **POST** \`/shipping/methods\` - Create shipping method (admin)
- **GET** \`/shipping/methods\` - Get shipping methods

### Analytics (\`/analytics\`)

- **GET** \`/analytics\` - Get dashboard analytics (admin/vendor)

## 🔍 Query Parameters

Most GET endpoints support the following query parameters:

### Pagination

- \`page\`: Page number (default: 1)
- \`limit\`: Items per page (default: 10)

### Search

- \`searchTerm\`: Search in specified fields

### Sorting

- \`sort\`: Sort by field(s), prefix with \`-\` for descending
  - Example: \`sort=-createdAt,title\`

### Filtering

- Any field can be used as a filter
  - Example: \`category=electronics&inStock=true\`

### Field Selection

- \`fields\`: Select specific fields
  - Example: \`fields=title,price,image\`

## 📝 Request/Response Examples

### Register User

\`\`\`bash
POST /api/auth/register
Content-Type: application/json

{
"name": "John Doe",
"email": "john@example.com",
"password": "password123",
"role": "user"
}
\`\`\`

**Response:**
\`\`\`json
{
"success": true,
"message": "User registered successfully",
"data": {
"\_id": "64f8a1b2c3d4e5f6a7b8c9d0",
"name": "John Doe",
"email": "john@example.com",
"role": "user",
"isActive": true,
"emailVerified": false,
"createdAt": "2023-09-06T10:30:00.000Z"
}
}
\`\`\`

### Create Product

\`\`\`bash
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
"title": "Monstera Deliciosa",
"description": "Beautiful large-leafed indoor plant",
"price": 29.99,
"quantity": 50,
"image": "https://example.com/monstera.jpg",
"category": "64f8a1b2c3d4e5f6a7b8c9d1"
}
\`\`\`

### Get Products with Filters

\`\`\`bash
GET /api/products?page=1&limit=10&searchTerm=plant&sort=-createdAt&category=64f8a1b2c3d4e5f6a7b8c9d1&inStock=true
\`\`\`

## ⚠️ Error Handling

The API returns consistent error responses:

\`\`\`json
{
"success": false,
"message": "Error description",
"errorSources": [
{
"path": "field_name",
"message": "Specific error message"
}
],
"stack": "Error stack trace (development only)"
}
\`\`\`

### Common HTTP Status Codes

- \`200\`: Success
- \`201\`: Created
- \`400\`: Bad Request
- \`401\`: Unauthorized
- \`403\`: Forbidden
- \`404\`: Not Found
- \`429\`: Too Many Requests
- \`500\`: Internal Server Error

## 🛡️ Rate Limiting

The API implements rate limiting to prevent abuse:

- **General**: 100 requests per 15 minutes per IP
- **Booking**: 10 requests per 15 minutes per IP (production only)

Rate limit headers are included in responses:

- \`X-RateLimit-Limit\`: Request limit
- \`X-RateLimit-Remaining\`: Remaining requests
- \`X-RateLimit-Reset\`: Reset time

## 🚀 Deployment

### Vercel Deployment

1. Install Vercel CLI:
   \`\`\`bash
   npm i -g vercel
   \`\`\`

2. Deploy:
   \`\`\`bash
   vercel --prod
   \`\`\`

3. Set environment variables in Vercel dashboard

### Environment Setup

Ensure all environment variables are configured in your deployment platform:

- Database connection string
- JWT secrets
- Third-party API keys (Stripe, ImageBB)
- CORS origins

## 🧪 Testing with Postman

1. Import the collection: \`postman/GreenHaven-API.postman_collection.json\`
2. Set the \`baseUrl\` variable to your API URL
3. Start with authentication endpoints to get tokens
4. The collection automatically manages authentication tokens
5. Test all endpoints with provided sample data

### Collection Features

- **Environment Variables**: Automatic token and ID management
- **Test Scripts**: Response validation and variable extraction
- **Sample Data**: Ready-to-use request bodies
- **Documentation**: Detailed descriptions for each endpoint

## 📊 Analytics Data

The analytics endpoint provides comprehensive dashboard data:

- **Overview**: Total orders, products, users, revenue
- **Sales Trends**: Daily sales data for charts
- **Top Products**: Best-selling products with revenue
- **Order Statistics**: Status distribution
- **User Growth**: Registration trends
- **Review Metrics**: Rating statistics
- **Blog Performance**: View counts and engagement
- **Inventory Alerts**: Low stock notifications

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Request throttling
- **CORS Configuration**: Cross-origin request control
- **Input Validation**: Zod schema validation
- **SQL Injection Prevention**: MongoDB parameterized queries
- **XSS Protection**: Helmet.js security headers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation for common solutions

---

**Happy coding! 🌱**
\`\`\`
