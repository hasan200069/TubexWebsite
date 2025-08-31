# TubeX IT Services Platform

A modern full-stack web application for IT services marketplace with real-time chat, payment integration, and comprehensive admin/client dashboards.

## Tech Stack

- **Frontend**: React + TailwindCSS
- **Backend**: Node.js + Express  
- **Database**: MongoDB + Mongoose
- **Real-time**: Socket.IO
- **Payments**: Stripe
- **Auth**: JWT

## Features

### Public Website
- Browse IT services without login
- Pages: Home, Services, About, Contact, FAQ
- Call-to-action for registration

### Client Dashboard  
- Purchase IT services
- Submit custom quote requests
- Track orders and payments
- Real-time chat with support

### Admin Dashboard
- Manage IT services (CRUD)
- View/manage orders and quotes
- Payment management
- Client communication

## Quick Start

1. Install dependencies:
   ```bash
   npm run install-all
   ```

2. Set up environment variables:
   - Copy `.env.example` to `.env` in backend folder
   - Add your MongoDB URI, JWT secret, and Stripe keys

3. Start development servers:
   ```bash
   npm run dev
   ```

## Project Structure

```
├── backend/           # Node.js/Express API
├── frontend/          # React application
├── Logo-1.png        # Brand logo
└── README.md
```

## Environment Setup

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/tubex
JWT_SECRET=your_jwt_secret_here
STRIPE_SECRET_KEY=your_stripe_secret
PORT=5000
```

### Frontend
- API_URL configured in src/config.js
