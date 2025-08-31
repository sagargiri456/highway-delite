# Google OAuth Setup Guide

## Prerequisites
1. Google Cloud Console account
2. A Google Cloud Project

## Setup Steps

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API

### 2. Configure OAuth Consent Screen
1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in required information:
   - App name: "Highway Delight"
   - User support email: Your email
   - Developer contact information: Your email
4. Add scopes: `email`, `profile`, `openid`
5. Add test users if needed

### 3. Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized JavaScript origins:
   - `http://localhost:5173` (for development)
   - `http://localhost:3000` (if using different port)
5. Add authorized redirect URIs:
   - `http://localhost:5173/auth/google/callback`
6. Copy the Client ID and Client Secret

### 4. Environment Variables
Create a `.env` file in the backend directory with:

```env
# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/highway_delight

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 5. Frontend Configuration
In your frontend, you'll need to:
1. Install Google OAuth library: `npm install @react-oauth/google`
2. Configure Google OAuth provider
3. Add Google Sign-In button

## Security Notes
- Never commit your `.env` file to version control
- Use strong JWT secrets in production
- Restrict OAuth origins to your actual domains in production
- Regularly rotate your OAuth credentials

## Testing
1. Start your backend server
2. Test the `/api/auth/google` endpoint with a valid Google ID token
3. Verify user creation/login works correctly
