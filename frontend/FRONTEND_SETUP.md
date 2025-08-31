# Frontend Setup Guide

## Google OAuth Configuration

### 1. Environment Variables
Create a `.env` file in the frontend directory with:

```env
# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here

# Backend API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
```

### 2. Google OAuth Setup
1. Follow the backend setup guide to get your Google Client ID
2. Add the Client ID to your `.env` file
3. Ensure the authorized origins include your frontend URL

### 3. Features Added
- ✅ Google Sign-In button on both Signin and Signup pages
- ✅ Consistent styling with existing UI components
- ✅ Proper error handling and loading states
- ✅ Automatic navigation to dashboard after successful sign-in

### 4. Component Structure
- `GoogleSignInButton`: Reusable button component with Google branding
- Integrated into both authentication pages
- Uses the same styling patterns as existing buttons

### 5. Testing
1. Start both backend and frontend servers
2. Navigate to `/signin` or `/signup`
3. Click "Continue with Google" button
4. Complete Google OAuth flow
5. Verify automatic navigation to dashboard

## Notes
- The Google OAuth flow is completely separate from the email OTP flow
- Users can choose either authentication method
- Google users are automatically verified and don't need OTP
- Profile pictures from Google are stored and displayed
