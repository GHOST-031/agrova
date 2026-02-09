# Agrova - F2C Marketplace Frontend

A modern, responsive React.js frontend for a Farmer-to-Consumer marketplace that connects farmers directly with consumers for fresh, quality produce.

## 🌱 Features

### For Consumers

- **Product Browsing**: Search and filter fresh products by category, location, and freshness
- **Shopping Cart**: Add products to cart with quantity management
- **Wishlist**: Save favorite products for later
- **Order Tracking**: Track orders with real-time status updates
- **Reviews & Ratings**: Rate products and farmers

### For Farmers

- **Dashboard**: Overview of sales, orders, and performance metrics
- **Product Management**: Add, edit, and manage product listings
- **Inventory Tracking**: Monitor stock levels and automatic updates
- **Order Management**: Accept, reject, and track customer orders
- **Earnings Dashboard**: View sales history and pending payments

### For Admins

- **Analytics Dashboard**: Comprehensive charts and statistics
- **User Management**: Manage farmers and consumers
- **Product Moderation**: Approve and monitor product listings
- **Order Oversight**: Monitor all marketplace transactions

### Common Features

- **Authentication**: Secure login/signup for all user types
- **Real-time Chat**: Communication between farmers and consumers
- **Notifications**: Stay updated with order status and marketplace activity
- **Theme Switching**: Toggle between light and dark forest themes
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

## 🎨 Design & Theme

- **Forest Theme**: Earthy greens and natural colors throughout
- **Dark Mode**: Beautiful dark forest theme option
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Interactive Elements**: Hover effects, transitions with Framer Motion
- **Accessibility**: WCAG compliant design patterns

## 🛠 Tech Stack

- **Frontend Framework**: React 18 with hooks and functional components
- **Styling**: TailwindCSS with custom forest theme
- **Routing**: React Router DOM for navigation
- **Animations**: Framer Motion for smooth transitions
- **Charts**: Chart.js and React-Chartjs-2 for analytics
- **Icons**: Lucide React for modern iconography
- **State Management**: React Context API
- **Build Tool**: Vite for fast development and building
- **Notifications**: React Hot Toast

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd f2c-marketplace-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔐 Demo Authentication

The application includes demo credentials for testing different user roles:

### Consumer Demo

- **Email**: consumer@demo.com
- **Password**: demo123

### Farmer Demo

- **Email**: farmer@demo.com
- **Password**: demo123

### Admin Demo

- **Email**: admin@demo.com
- **Password**: demo123

## 📱 Pages & Routes

### Public Routes

- `/` - Homepage with featured products
- `/login` - Authentication page
- `/signup` - User registration
- `/products` - Product listings with search and filters
- `/products/:id` - Individual product details

### Consumer Routes (Protected)

- `/consumer/cart` - Shopping cart management
- `/consumer/wishlist` - Saved products
- `/consumer/orders` - Order history and tracking
- `/consumer/checkout` - Order placement flow

### Farmer Routes (Protected)

- `/farmer/dashboard` - Farmer overview and metrics
- `/farmer/products` - Product management interface
- `/farmer/orders` - Order management system
- `/farmer/earnings` - Sales and earnings dashboard

### Admin Routes (Protected)

- `/admin/dashboard` - Admin analytics and overview
- `/admin/users` - User management interface
- `/admin/products` - Product moderation tools
- `/admin/orders` - Order oversight and management

## 🎯 Key Components

### Layout Components

- **Navbar**: Responsive navigation with user-specific menus
- **Footer**: Comprehensive footer with links and newsletter signup
- **ProtectedRoute**: Route protection based on authentication status

### UI Components

- **Button**: Flexible button component with variants and loading states
- **Card**: Reusable card component with hover effects
- **Modal**: Accessible modal component with animations
- **ProductCard**: Specialized product display card
- **OrderCard**: Order status and details card

### Context Providers

- **ThemeContext**: Dark/light theme management
- **AuthContext**: User authentication and session management

## 🔮 Future Enhancements

- **Payment Integration**: Stripe, PayPal, UPI payment gateways
- **Real-time Chat**: WebSocket-based messaging system
- **GPS Integration**: Location-based farmer discovery
- **Push Notifications**: Browser and mobile notifications
- **PWA Support**: Progressive Web App capabilities
- **Multi-language**: Internationalization support

## 🤝 Backend Integration

This frontend is designed to integrate seamlessly with a Spring Boot backend. The API structure includes:

- **Authentication**: JWT-based authentication endpoints
- **Products**: CRUD operations for product management
- **Orders**: Order processing and status management
- **Users**: User profile and management endpoints
- **Analytics**: Data endpoints for dashboard metrics

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support, email support@fresh2consumer.com or join our Slack channel.

---

**Agrova** - Connecting farmers and consumers for a sustainable future! 🌱

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
