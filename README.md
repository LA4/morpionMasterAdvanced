# Morpion Master Advanced API

Bienvenue dans la documentation de l'API Morpion Master Advanced. Ce projet fournit une API REST et un serveur WebSocket pour gérer les utilisateurs, les scores et le jeu de réflexe "Reflex Shot".

## 🚀 Démarrage Rapide

### Prérequis

- Node.js (v16 ou supérieur recommandé)
- Un projet Supabase configuré

### Installation

1. Clonez le dépôt.
2. Installez les dépendances :

```bash
npm install
```

### Configuration

Créez un fichier `.env` à la racine du dossier `morpionMasterAdvanced` avec les variables suivantes :

```env
PORT=3000
WS_PORT_REFLEX=8081
HOST=localhost
SUPABASE_URL=votre_url_supabase
SUPABASE_KEY=votre_cle_supabase
```

### Lancement

Pour lancer le serveur en mode développement (avec rechargement automatique) :

```bash
npm run dev
```

Pour lancer le serveur en production :

```bash
npm start
```

Le serveur sera accessible à l'adresse `http://localhost:3000` (ou le port configuré).

## 📚 Documentation API (Swagger)

Une documentation interactive complète est disponible via Swagger UI une fois le serveur lancé :

👉 **[http://localhost:3000/docs](http://localhost:3000/docs)**

## 🔐 Authentification

L'API utilise Supabase pour l'authentification.

- **Connexion Google** : `GET /auth/v1/login/google`
    - Redirige l'utilisateur vers la page de connexion Google.
    - Une fois connecté, un cookie `sb-access-token` est défini.
- **Déconnexion** : `GET /auth/v1/logout`

## 📡 Endpoints API REST

### Utilisateurs (`/api/v1/user`)

- `GET /me` : Récupère les informations de l'utilisateur connecté. (Nécessite d'être authentifié)

### Scores (`/api/v1/scores`)

- `GET /` : Récupère la liste de tous les scores.
- `GET /scoreByUserId?uid={uuid}` : Récupère les scores d'un utilisateur spécifique.

### Admin (`/api/v1/admin`)

- `GET /profiles` : Récupère la liste de tous les profils utilisateurs. (Nécessite les droits admin)

### Configuration

- `GET /api/config` : Renvoie la configuration publique du serveur (URLs, ports).

## 🎮 API WebSocket (Reflex Shot)

Le jeu "Reflex Shot" utilise une connexion WebSocket dédiée.

**URL de connexion** : `ws://<HOST>:<WS_PORT_REFLEX>` (par défaut : `ws://localhost:8081`)

### Messages Client -> Serveur

Envoyez ces messages au format JSON :

| Type    | Description                               | Exemple de Payload                           |
| ------- | ----------------------------------------- | -------------------------------------------- |
| `JOIN`  | Rejoindre la partie                       | `{ "type": "JOIN", "playerName": "Pseudo" }` |
| `READY` | Signaler que le joueur est prêt           | `{ "type": "READY" }`                        |
| `CLICK` | Cliquer (réagir au changement de couleur) | `{ "type": "CLICK" }`                        |

### Messages Serveur -> Client

Le serveur envoie des messages au format JSON pour informer de l'état du jeu :

| Type            | Description                                         | Payload                                         |
| --------------- | --------------------------------------------------- | ----------------------------------------------- |
| `CONNECTED`     | Connexion établie                                   | `{ "content": "Bienvenue..." }`                 |
| `PLAYER_JOINED` | Un joueur a rejoint                                 | `{ "playerName": "...", "playerCount": 1 }`     |
| `GAME_STATE`    | État global du jeu                                  | `{ "players": [...], "gameActive": bool, ... }` |
| `ROUND_START`   | Début d'une manche (Rouge)                          | `{ "round": 1, "color": "red" }`                |
| `COLOR_CHANGE`  | Le feu passe au vert ! (C'est le moment de cliquer) | `{ "color": "green" }`                          |
| `VALID_CLICK`   | Clic valide                                         | `{ "reactionTime": 250, "points": 800, ... }`   |
| `EARLY_CLICK`   | Clic trop tôt (pénalité)                            | `{ "message": "Trop tôt !", "score": -100 }`    |
| `ROUND_END`     | Fin de la manche                                    | `{ "results": [...] }`                          |
| `GAME_END`      | Fin de la partie                                    | `{ "ranking": [...] }`                          |

## 🛠️ Scripts

- `npm start` : Lance le serveur principal.
- `npm run dev` : Lance le serveur avec nodemon.
- `npm run ws:reflex` : Lance uniquement le serveur WebSocket Reflex (utilisé en interne par le serveur principal).