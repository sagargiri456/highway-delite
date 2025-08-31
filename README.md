# Highway Delite - Full-Stack Note-Taking App

> A modern, full-stack note-taking application with email/OTP authentication and a beautiful split-screen design.

## 🎯 Project Overview

**Highway Delite** A full-stack note-taking application built to match precise design mockups with a split-screen layout, custom blue gradient background, and OTP-based authentication. Designed for desktop-first responsiveness and deployed on Render (backend) and Vercel (frontend).

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API communication
- **React Hook Form** for form management

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Nodemailer** for email services
- **bcrypt** for password hashing



---

## 📐 Project Overview

**Goal**: Build a full-stack note-taking app with exact design fidelity and secure authentication.

**Timeline**: 3 days  
**Design Focus**: Split-screen layout, HD logo with blue star, exact form styling, and responsive adaptation.

---

## 🧰 Tech Stack

- **Frontend**: React (TypeScript) + Vite + Tailwind CSS
- **Backend**: Node.js + Express (TypeScript)
- **Database**: MongoDB (via Atlas)
- **Auth**: Email + OTP (via Nodemailer), JWT
- **Optional**: Google OAuth (Phase 6)
- **Deployment**: Vercel (frontend), Render (backend)

---

## 🎨 Design Highlights

- Split-screen layout: White form panel + blue gradient background
- HD logo with blue star icon
- Exact form styling with rounded inputs, blue focus states
- Typography and spacing matched to mockups
- Responsive layout for desktop, tablet, and mobile

---

## 🔐 Authentication Flow

1. **Sign Up**: Name + DOB + Email → Get OTP → Verify OTP
2. **Login**: Email → Get OTP → Verify OTP
3. **JWT**: Token-based session management with refresh and logout
4. **Security**: Rate limiting, input validation, token blacklisting

---

## 📝 Notes Management

- Create, update, delete notes (CRUD)
- Notes tied to authenticated user
- Pagination (10 per page)
- Responsive dashboard with welcome card and note list
- Search/filter functionality

---

## 🚀 Deployment

- **Backend**: [Render Web Service](https://highway-delite-backend-gjt3.onrender.com)
- **Frontend**: [Vercel Static Site](https://vercel.com/sagar-giris-projects/highway-delite/dDdVKBFS2ZBuUxnP7y4xB2e8AvFu)

---

## ⚙️ Setup Instructions

### 1. Clone the Repo
```bash
git clone https://github.com/your-username/highway-delite.git
cd highway-delite

cd backend && npm install
cd ../frontend && npm install

Backend .env
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password

Frontend .env
VITE_API_BASE_URL=your_backend_base_api_url

# Backend
cd backend
npm run start

# Frontend
cd frontend
npm run dev

📄 API Endpoints
Auth
POST /api/auth/register
POST /api/auth/send-otp
POST /api/auth/verify-otp
POST /api/auth/login
POST /api/auth/logout

Notes
GET /api/notes
POST /api/notes
PUT /api/notes/:id
DELETE /api/notes/:id


📱 Responsive Strategy

Device	Layout Adaptation
Desktop	Split-screen: Form (40%) + Background (60%)
Tablet	Equal split: Form (50%) + Background (50%)
Mobile	Stacked layout: Form on top, background minimized

🧪 Testing & Validation
ESLint + Prettier for code quality
Express-validator for input validation
Manual testing of all auth and notes flows
Responsive testing across screen sizes


## 📊 Development Journey

### Phase 1: Project Foundation (Day 1 Morning)
**Duration**: 4 hours  
**Focus**: Repository setup, design system, and backend foundation

#### Key Achievements:
- ✅ Created GitHub repository with proper structure
- ✅ Implemented exact blue gradient background matching design mockups
- ✅ Built HD logo component with blue star icon
- ✅ Established split-screen layout system (desktop-first)
- ✅ Set up Express server with TypeScript configuration
- ✅ Configured MongoDB database connection

#### Major Decision Points:
- **Vite over Create React App**: Chosen for faster development and building
- **Email/OTP First**: Prioritized email authentication over Google OAuth for design consistency
- **Desktop-First Design**: Matched provided mockups which were clearly desktop-focused

### Phase 2: Authentication System (Day 1 Afternoon)
**Duration**: 5 hours  
**Focus**: Email/OTP authentication backend and database models

#### Key Achievements:
- ✅ Implemented 6-digit OTP generation and verification
- ✅ Built comprehensive user registration flow
- ✅ Added rate limiting (3 OTP requests per 15 minutes)
- ✅ Created JWT token system with refresh logic
- ✅ Set up nodemailer for email delivery

#### Technical Challenges Solved:
- **OTP Security**: Implemented time-based expiry and attempt limiting
- **Email Delivery**: Configured reliable SMTP with fallback options
- **Token Management**: Built secure JWT with blacklisting capability

### Phase 3: Frontend Authentication UI (Day 1 Evening)
**Duration**: 6 hours  
**Focus**: Exact design replication of authentication interfaces

#### Key Achievements:
- ✅ Replicated split-screen layout with pixel-perfect accuracy
- ✅ Built responsive form components with blue focus states
- ✅ Implemented 3D wave pattern background gradient
- ✅ Created seamless signup/login flow with OTP verification
- ✅ Added "Resend OTP" functionality with cooldown timer

#### Design Specifications:
- **Color Palette**: Primary Blue (#3B82F6), Dark Blue (#1E3A8A)
- **Layout**: 40% form panel, 60% background on desktop
- **Typography**: Clean sans-serif with specific font weights
- **Interactive Elements**: Blue hover states, rounded corners

### Phase 4: Dashboard & Notes Management (Day 2 Morning)
**Duration**: 5 hours  
**Focus**: Notes CRUD operations and dashboard interface

#### Key Achievements:
- ✅ Built complete notes CRUD API with JWT protection
- ✅ Implemented paginated notes listing (10 per page)
- ✅ Created dashboard with welcome card and user info
- ✅ Added note creation, editing, and deletion features
- ✅ Built confirmation modals for destructive actions

### Phase 5: Integration & Mobile Optimization (Day 2 Afternoon)
**Duration**: 4 hours  
**Focus**: API integration and responsive design adaptation

#### Key Achievements:
- ✅ Connected all UI components to backend APIs
- ✅ Implemented optimistic updates for better UX
- ✅ Adapted split-screen layout for mobile devices
- ✅ Added comprehensive error handling and loading states
- ✅ Set up protected routes and navigation flow

#### Mobile Strategy:
- **Tablet (768px+)**: Maintains split-screen with adjusted proportions
- **Mobile (<768px)**: Stacks form above minimized background
- **Touch Optimization**: Larger buttons, improved spacing

## 📦 Package Installation Guide

### Prerequisites
```bash
node --version  # v18.0.0 or higher
npm --version   # v8.0.0 or higher
```

### Backend Dependencies

#### Core Dependencies
```bash
# Framework and server
npm install express@4.18.2
npm install cors@2.8.5
npm install helmet@7.0.0
npm install compression@1.7.4

# Database and ODM
npm install mongoose@7.5.0
npm install mongodb@5.7.0

# Authentication and security
npm install bcrypt@5.1.1
npm install jsonwebtoken@9.0.2
npm install express-rate-limit@6.10.0

# Email service
npm install nodemailer@6.9.4

# Validation and utilities
npm install express-validator@7.0.1
npm install dotenv@16.3.1
npm install uuid@9.0.0
```

#### Development Dependencies
```bash
# TypeScript setup
npm install -D typescript@5.1.6
npm install -D @types/node@20.5.0
npm install -D @types/express@4.17.17
npm install -D @types/cors@2.8.13
npm install -D @types/bcrypt@5.0.0
npm install -D @types/jsonwebtoken@9.0.2
npm install -D @types/nodemailer@6.4.8

# Development tools
npm install -D nodemon@3.0.1
npm install -D ts-node@10.9.1
npm install -D concurrently@8.2.0

# Code quality
npm install -D eslint@8.47.0
npm install -D prettier@3.0.2
npm install -D @typescript-eslint/parser@6.4.1
npm install -D @typescript-eslint/eslint-plugin@6.4.1
```

### Frontend Dependencies

#### Core Dependencies
```bash
# React and routing
npm install react@18.2.0
npm install react-dom@18.2.0
npm install react-router-dom@6.15.0

# HTTP client and state management
npm install axios@1.5.0
npm install @tanstack/react-query@4.32.6

# Form handling
npm install react-hook-form@7.46.1
npm install @hookform/resolvers@3.3.1

# UI and styling
npm install tailwindcss@3.3.3
npm install autoprefixer@10.4.15
npm install postcss@8.4.28

# Icons and utilities
npm install lucide-react@0.263.1
npm install clsx@2.0.0
npm install date-fns@2.30.0
```

#### Development Dependencies
```bash
# Build tool and development server
npm install -D vite@4.4.9
npm install -D @vitejs/plugin-react@4.0.4

# TypeScript support
npm install -D typescript@5.1.6
npm install -D @types/react@18.2.21
npm install -D @types/react-dom@18.2.7

# Code quality
npm install -D eslint@8.47.0
npm install -D eslint-plugin-react@7.33.2
npm install -D eslint-plugin-react-hooks@4.6.0
npm install -D prettier@3.0.2
npm install -D prettier-plugin-tailwindcss@0.5.4
```

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/highway-delite.git
cd highway-delite
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure your environment variables
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Configure your API endpoints
npm run dev
```

### 4. Environment Configuration

#### Backend (.env)
```bash
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/highway-delite
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

#### Frontend (.env)
```bash
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Highway Delite
```

## 📝 Key Features

- **🔐 Secure Authentication**: Email/OTP verification with JWT tokens
- **📱 Responsive Design**: Desktop-first with mobile optimization
- **✨ Modern UI**: Split-screen layout with 3D gradient background
- **📋 Note Management**: Full CRUD operations for notes
- **⚡ Fast Performance**: Vite-powered frontend, optimized backend
- **🛡️ Security First**: Rate limiting, input validation, secure headers

## 🎨 Design Highlights

- **Split-Screen Architecture**: 40/60 desktop layout, adaptive mobile
- **Blue Gradient System**: Custom 3D wave pattern background
- **HD Brand Identity**: Consistent logo and color scheme
- **Touch-Friendly**: Optimized for both desktop and mobile interactions

## 📖 Project Structure

```
highway-delite/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API service functions
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   └── package.json
├── backend/                 # Node.js Express backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Database models
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Helper functions
│   │   └── types/          # TypeScript types
│   └── package.json
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


---

**Highway Delite** - Building the future of note-taking, one feature at a time. 🚀