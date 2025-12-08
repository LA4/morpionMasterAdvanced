# Morpion Master Advanced - Score Submission Feature

## 📋 Description

This project implements a web application with Google OAuth authentication and score submission functionality. Users can:
- Log in with their Google account
- View a personalized dashboard with their name
- Submit game scores to the database
- View their scores

## 🚀 Setup Instructions

### 1. Prerequisites
- Node.js (v14 or higher)
- A Supabase account and project
- Google Cloud Console account

### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create or select a project
3. Navigate to **APIs & Services** > **Credentials**
4. Create an **OAuth 2.0 Client ID**
5. Add these authorized redirect URIs:
   - `https://tghojvpmxzoieycydtwj.supabase.co/auth/v1/callback` (replace with your Supabase URL)
   - `http://localhost:3000/callback.html`

### 3. Supabase Configuration

#### A. Enable Google Authentication
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** > **Providers** > **Google**
4. Enable Google provider
5. Enter your **Client ID** and **Client Secret** from Google Cloud Console
6. Save the changes

#### B. Create the Scores Table
1. Go to **SQL Editor** in your Supabase dashboard
2. Run the SQL script from `database/create_scores_table.sql`
3. This will create the `scores` table with proper Row Level Security policies

### 4. Environment Variables

Create a `.env` file in the root directory:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=3000
```

Replace the values with your actual Supabase credentials.

### 5. Install Dependencies

```bash
npm install
```

### 6. Run the Application

```bash
node index.js
```

The server will start on `http://localhost:3000`

## 🎮 Usage

### Login Flow
1. Navigate to `http://localhost:3000/login.html`
2. Click **"Se connecter avec Google"**
3. Select your Google account and authorize
4. You'll be redirected to the callback page showing your user info

### Dashboard and Score Submission
1. From the callback page, click **"Dashboard"** or navigate to `http://localhost:3000/dashboard.html`
2. You'll see a welcome message with your name from Google auth
3. Enter a score in the input field
4. Click **"Envoyer le score"** to submit
5. The score will be saved to the database with your user information

## 📁 Project Structure

```
morpionMasterAdvanced/
├── api/
│   ├── score.js          # Score API routes (POST, GET)
│   └── user.js           # (Empty, for future use)
├── auth/
│   └── auth.js           # Google OAuth authentication routes
├── database/
│   └── create_scores_table.sql  # SQL script to create scores table
├── middleware/
│   └── authMiddleware.js # JWT token verification middleware
├── public/
│   ├── login.html        # Login page with Google button
│   ├── callback.html     # OAuth callback page
│   └── dashboard.html    # Main dashboard with score submission
├── index.js              # Express server entry point
├── supabaseClient.js     # Supabase client configuration
├── swagger.js            # Swagger API documentation
├── package.json          # Node.js dependencies
└── .env                  # Environment variables (not in git)
```

## 🔒 API Endpoints

### Authentication
- `GET /auth/v1/login/google` - Initiates Google OAuth flow
- `GET /auth/v1/callback` - OAuth callback handler

### Scores
- `POST /api/v1/scores` - Submit a new score (requires authentication)
  - Body: `{ "score": <number> }`
  - Headers: `Authorization: Bearer <access_token>`
- `GET /api/v1/scores` - Get all scores
  - Query params: `limit` (default: 10), `orderBy` (score|created_at)

### Documentation
- `GET /docs` - Swagger API documentation

## 🔐 Security Features

- JWT token verification for protected routes
- Row Level Security (RLS) in Supabase
- Users can only submit scores when authenticated
- Users can view all scores (leaderboard)
- Users can only modify their own scores

## 🐛 Troubleshooting

### "Token manquant" or "Token invalide"
- Make sure you're logged in
- Check that the Authorization header is properly set
- Try logging out and logging in again

### "redirect_uri_mismatch"
- Verify that the redirect URI is properly configured in Google Cloud Console
- Make sure it matches exactly (including protocol and port)

### Scores not saving
- Check that the Supabase `scores` table exists
- Verify Row Level Security policies are set up correctly
- Check browser console for errors

## 📝 Next Steps

Potential improvements:
- Add a leaderboard view to display top scores
- Implement real game logic instead of manual score input
- Add user profile page
- Implement score deletion
- Add pagination for score lists
- Add real-time score updates using Supabase subscriptions

## 📄 License

ISC
