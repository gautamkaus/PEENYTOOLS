
# PennyTools - AI Tools E-commerce Platform

A modern, responsive e-commerce platform for selling subscription-based AI tools with attractive discounts. Built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

### Frontend Features
- **Modern Design**: Clean, AI-themed interface with gradient backgrounds and smooth animations
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Product Catalog**: Grid-based product display with filtering and search
- **Shopping Cart**: Duration-based subscription selection with dynamic pricing
- **Checkout Process**: UPI payment integration with WhatsApp support
- **User Authentication**: Login/registration with JWT token management
- **Admin Panel**: Dashboard with statistics, product management, and order tracking

### Technical Features
- **React 18**: Latest React with TypeScript for type safety
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Shadcn/ui**: High-quality, accessible UI components
- **React Router**: Client-side routing for SPA experience
- **Recharts**: Beautiful charts for admin dashboard
- **Lucide Icons**: Modern icon library
- **React Query**: Data fetching and state management

## 🎨 Design System

### Colors
- **Primary Blue**: `#2563EB` for buttons and branding
- **Background Gray**: `#F3F4F6` for page backgrounds
- **Discount Yellow**: `#FBBF24` for discount badges
- **Text Dark**: `#1F2937` for primary text
- **Success Green**: `#10B981` for WhatsApp and success states

### Typography
- **Headings**: Poppins font family (Google Fonts)
- **Body Text**: Inter font family (Google Fonts)
- **H1**: `text-4xl` (36px) for main headings
- **Body**: `text-base` (16px) for regular text

### Spacing & Layout
- **Container**: `max-w-7xl mx-auto` for content width
- **Padding**: Tailwind scale (`p-4`, `py-16`, etc.)
- **Grid**: Responsive grids (`md:grid-cols-3`, `lg:grid-cols-3`)

## 📱 Pages & Components

### Pages
1. **Home (`/`)**: Hero section, featured tools, benefits
2. **Products (`/products`)**: Full catalog with search and filters
3. **Cart (`/cart`)**: Shopping cart with duration selection
4. **Checkout (`/checkout`)**: Payment form with UPI integration
5. **Login (`/login`)**: Authentication (login/register)
6. **Admin (`/admin`)**: Admin dashboard and management

### Key Components
- **Header**: Navigation with logo and menu
- **ProductCard**: Reusable product display component
- **Hero Section**: Gradient background with CTA buttons
- **WhatsApp Integration**: Floating button and checkout integration

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Modern web browser

### Local Development
```bash
# Clone the repository
git clone <repository-url>
cd pennytools-frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:8080
```

### Build for Production
```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 🌐 Deployment

### Netlify Deployment
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy automatically on git push

### Vercel Deployment
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in project directory
3. Follow the prompts to deploy

### Environment Variables
```bash
# For production deployment
VITE_API_BASE_URL=https://your-api.com
VITE_WHATSAPP_NUMBER=+919876543210
```

## 🔌 API Integration

The frontend is designed to integrate with REST APIs:

### Authentication Endpoints
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/profile` - User profile (protected)

### Product Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Cart & Orders
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove from cart
- `POST /api/order` - Create order
- `GET /api/orders` - Get user orders

### Payment
- `POST /api/payment` - Process payment
- `POST /api/payment/verify` - Verify payment

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/orders` - All orders

## 📊 Performance Optimization

### Image Optimization
- Lazy loading with `loading="lazy"`
- WebP format for better compression
- Responsive images with `srcset`
- Optimized placeholder images from Unsplash

### Code Optimization
- Tree shaking for smaller bundle size
- Component lazy loading
- Efficient re-rendering with React.memo
- Optimized imports

### SEO Features
- Semantic HTML structure
- Meta tags for social sharing
- Structured data (JSON-LD)
- Alt text for all images
- Proper heading hierarchy

## 🎯 Key Features Implementation

### Subscription Duration System
Products use duration-based pricing instead of quantity:
```typescript
// Duration options: 1, 2, 3, 4, 6, 12 months
const totalPrice = discountedPrice * duration;
```

### WhatsApp Integration
Multiple WhatsApp touchpoints:
- Floating action button
- Cart checkout option
- Order confirmation
- Customer support

### Payment Flow
1. User fills checkout form
2. Makes UPI payment to provided ID
3. Enters transaction details
4. System verifies payment
5. Access is granted automatically

### Admin Dashboard
- Revenue and subscription metrics
- Interactive charts (Bar, Pie)
- Product management CRUD
- Order tracking and status updates

## 🔧 Customization

### Adding New Products
1. Use admin panel product form
2. Or add directly to `allProducts` array in `Products.tsx`
3. Include proper image URLs (300x200px recommended)

### Styling Modifications
- Update `tailwind.config.ts` for theme changes
- Modify CSS custom properties in `index.css`
- Use Tailwind utility classes for component styling

### Adding New Pages
1. Create page component in `src/pages/`
2. Add route to `App.tsx`
3. Update navigation in header components

## 📞 Support & Contact

- **WhatsApp**: +919876543210
- **Email**: support@pennytools.com
- **Website**: https://pennytools.com

## 📄 License

This project is proprietary software. All rights reserved.

---

Built with ❤️ using React, TypeScript, and Tailwind CSS.
