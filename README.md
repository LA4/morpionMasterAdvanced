# Morpion Master Advanced API

Welcome to the documentation for the Morpion Master Advanced API.  
This project provides a REST API and a WebSocket server to manage users, scores, and the reflex game "Reflex Shot".

## Our Team

- Ludo Andreotti
- Nina Guiguet
- Angie Pons
- Julien Vaglia
- Catherine Jules

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher recommended)
- A configured Supabase project

### Installation

1. Clone the repository.
2. Install the dependencies:

npm install

### Configuration

Create a `.env` file at the root of the `morpionMasterAdvanced` folder with the following variables:

PORT=3000
WS_PORT_REFLEX=8081
HOST=localhost
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key

### Running the Server

To start the server in development mode (with automatic reload):

npm run dev

To start the server in production mode:

npm start

The server will be available at `http://localhost:3000` (or the configured port).

## 📚 API Documentation (Swagger)

A complete interactive documentation is available via Swagger UI once the server is running:

http://localhost:3000/docs

## 🔐 Authentication

The API uses Supabase for authentication.

- **Google Login**: `GET /auth/v1/login/google`
  - Redirects the user to the Google login page.
  - Once authenticated, a `sb-access-token` cookie is set.
- **Logout**: `GET /auth/v1/logout`

## 📡 REST API Endpoints

### Users (`/api/v1/user`)

- `GET /me` : Retrieves information about the currently authenticated user. (Authentication required)

### Scores (`/api/v1/scores`)

- `GET /` : Retrieves the list of all scores.
- `GET /scoreByUserId?uid={uuid}` : Retrieves the scores of a specific user.

### Admin (`/api/v1/admin`)

- `GET /profiles` : Retrieves the list of all user profiles. (Admin privileges required)

### Configuration

- `GET /api/config` : Returns the public server configuration (URLs, ports).

## 🎮 WebSocket API (Reflex Shot)

The "Reflex Shot" game uses a dedicated WebSocket connection.

**Connection URL**: `ws://<HOST>:<WS_PORT_REFLEX>` (default: `ws://localhost:8081`)

### Client -> Server Messages

Send these messages in JSON format:

Type    | Description                                | Example Payload
------- | ------------------------------------------ | --------------------------------------------
JOIN    | Join the game                               | { "type": "JOIN", "playerName": "Nickname" }
READY   | Indicate that the player is ready           | { "type": "READY" }
CLICK   | Click (react to the color change)           | { "type": "CLICK" }

### Server -> Client Messages

The server sends JSON messages to inform clients about the game state:

Type            | Description                                              | Payload
--------------- | -------------------------------------------------------- | -----------------------------------------------
CONNECTED       | Connection established                                   | { "content": "Welcome..." }
PLAYER_JOINED   | A player has joined                                      | { "playerName": "...", "playerCount": 1 }
GAME_STATE      | Global game state                                        | { "players": [...], "gameActive": bool, ... }
ROUND_START     | Start of a round (Red light)                              | { "round": 1, "color": "red" }
COLOR_CHANGE    | Light turns green! (Time to click)                        | { "color": "green" }
VALID_CLICK     | Valid click                                               | { "reactionTime": 250, "points": 800, ... }
EARLY_CLICK     | Clicked too early (penalty)                               | { "message": "Too early!", "score": -100 }
ROUND_END       | End of the round                                         | { "results": [...] }
GAME_END        | End of the game                                          | { "ranking": [...] }

## 🛠️ Scripts

- `npm start` : Starts the main server.
- `npm run dev` : Starts the server with nodemon.
- `npm run ws:reflex` : Starts only the Reflex WebSocket server (used internally by the main server).