# TubeX IT Services Platform - Setup Guide

## Quick Setup Instructions

### 1. Install Dependencies
```bash
# Install root dependencies
npm install

# Install all project dependencies (backend + frontend)
npm run install-all
```

### 2. Environment Configuration

#### Backend Environment (.env)
Create `backend/.env` from `backend/env.example`:
```env
MONGODB_URI=mongodb://localhost:27017/tubex
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

#### Frontend Environment (.env)
Create `frontend/.env` from `frontend/env.example`:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
REACT_APP_SOCKET_URL=http://localhost:5000
```

### 3. Database Setup
Make sure you have MongoDB installed and running:
- Local MongoDB: `mongod`
- Or use MongoDB Atlas cloud database

### 4. Start Development Servers
```bash
# Start both backend and frontend concurrently
npm run dev

# Or start individually:
npm run backend  # Starts backend on port 5000
npm run frontend # Starts frontend on port 3000
```

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **API Health Check**: http://localhost:5000/api/health

## Default Admin Account
To test admin features, you'll need to manually create an admin user in the database or modify the registration endpoint temporarily to create admin users.

## Features Included

### ✅ Complete Features
- **Backend**: Node.js/Express with MongoDB
- **Authentication**: JWT-based with secure password hashing
- **Database Models**: Users, Services, Orders, Quotes, Chat
- **API Routes**: Complete REST API for all features
- **Frontend**: React with TypeScript and TailwindCSS
- **Responsive Design**: Mobile-first approach
- **Modern UI**: Professional design with animations
- **Protected Routes**: Role-based access control
- **Real-time Ready**: Socket.IO integration
- **Payment Ready**: Stripe integration structure

### 🚧 Implementation Needed
- **Payment Processing**: Complete Stripe integration
- **File Uploads**: Image and document handling
- **Email System**: User verification and notifications
- **Advanced Chat**: Full real-time chat implementation
- **Search & Filters**: Advanced service filtering
- **Dashboard Analytics**: Charts and statistics
- **Admin Panel**: Complete CRUD operations

## Tech Stack
- **Frontend**: React, TypeScript, TailwindCSS, Framer Motion
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT, bcryptjs
- **Real-time**: Socket.IO
- **Payments**: Stripe
- **UI Libraries**: Lucide React, React Hot Toast

## Project Structure
```
TubexWebsite/
├── backend/                 # Node.js/Express API
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   └── server.js           # Server entry point
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   └── config/         # Configuration files
└── Logo-1.png             # Brand logo
```

## Next Steps for Full Implementation
1. Implement file upload functionality
2. Complete payment processing with Stripe
3. Build advanced admin dashboard with analytics
4. Implement full chat system with Socket.IO
5. Add email notifications
6. Implement advanced search and filtering
7. Add comprehensive error handling
8. Set up deployment configuration
9. Add testing suites
10. Implement SEO optimization

This foundation provides a solid starting point for a production-ready IT services marketplace!
