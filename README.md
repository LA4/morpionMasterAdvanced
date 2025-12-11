# 🎯 REFLEX SHOT - Jeu de Réflexes Multijoueur

Un jeu de réflexes en temps réel où les joueurs s'affrontent pour déterminer qui a les réactions les plus rapides !

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![WebSocket](https://img.shields.io/badge/WebSocket-Real--time-blue.svg)](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
[![OAuth](https://img.shields.io/badge/Auth-Google%20OAuth-red.svg)](https://developers.google.com/identity/protocols/oauth2)

## 🎮 Aperçu

Reflex Shot est un jeu multijoueur en temps réel où les joueurs doivent cliquer le plus rapidement possible lorsque l'écran passe du rouge au vert. Le jeu se déroule en 5 rounds, avec un système de points basé sur le temps de réaction et des pénalités pour les clics anticipés.

### Fonctionnalités Principales

- ⚡ **Jeu en temps réel** avec WebSocket
- 👥 **Multijoueur** (minimum 2 joueurs)
- 🎯 **Système de points** basé sur le temps de réaction
- 🔐 **Authentification Google OAuth** via Supabase
- 🏆 **Classement final** avec podium
- 🌐 **Configuration IP automatique** - fonctionne sur n'importe quelle machine
- 📱 **Interface responsive** et moderne

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 18+ installé
- Compte Supabase (gratuit)
- Compte Google pour OAuth

### Installation

```bash
# Cloner le projet
git clone <repo-url>
cd morpionMasterAdvanced

# Installer les dépendances
npm install
```

### Configuration

1. Créez un fichier `.env` (ou utilisez celui existant)
2. Ajoutez vos clés Supabase :
   ```env
   SUPABASE_URL=votre_url_supabase
   SUPABASE_ANON_KEY=votre_clé_supabase
   ```

### Lancement

**Terminal 1 - Serveur HTTP :**
```bash
npm start
```

**Terminal 2 - Serveur WebSocket :**
```bash
npm run ws:reflex
```

**Accédez au jeu :**
```
http://VOTRE_IP:3000
```
*(L'IP est affichée dans le terminal)*

### Configuration Supabase

1. Démarrez les serveurs
2. Notez l'URL de callback affichée dans le terminal
3. Allez sur [Supabase Dashboard](https://supabase.com/dashboard)
4. **Authentication** → **URL Configuration**
5. Ajoutez l'URL callback dans **Redirect URLs**
6. Sauvegardez

**C'est prêt ! 🎉**

## 📖 Documentation

- **[START_HERE.md](START_HERE.md)** - Guide ultra-rapide pour commencer
- **[AIDE-MÉMOIRE.md](AIDE-MÉMOIRE.md)** - Commandes essentielles et astuces
- **[CONFIG_DYNAMIQUE.md](CONFIG_DYNAMIQUE.md)** - Configuration IP automatique
- **[QUICK_START.md](QUICK_START.md)** - Guide de démarrage détaillé
- **[COMMANDES.md](COMMANDES.md)** - Toutes les commandes disponibles
- **[RECAP.md](RECAP.md)** - Récapitulatif des fonctionnalités

## 🎯 Comment Jouer

1. **Connexion** - Connectez-vous avec votre compte Google
2. **Attente** - Attendez qu'un autre joueur rejoigne (minimum 2)
3. **Prêt** - Tous les joueurs cliquent sur "PRÊT !"
4. **Jeu** - L'écran devient rouge puis vert après un délai aléatoire
5. **Clic** - Cliquez le plus vite possible quand l'écran est VERT
6. **Résultats** - Après 5 rounds, le classement final s'affiche

### Système de Points

| Temps de Réaction | Points | Description |
|-------------------|--------|-------------|
| < 200ms | 1000 | ⚡ Exceptionnel |
| 200-300ms | 800 | 💪 Très rapide |
| 300-400ms | 600 | 👍 Rapide |
| 400-500ms | 400 | ✓ Bon |
| 500-700ms | 200 | • Correct |
| > 700ms | 100 | - Lent |
| **Clic sur ROUGE** | **-100** | ❌ Pénalité |

## 🏗️ Architecture

```
┌──────────────────────────────────┐
│   Frontend (HTML/CSS/JS)         │
│   - Interface de jeu             │
│   - WebSocket client             │
└──────────┬───────────────────────┘
           │
           ├──HTTP (3000)──→ Express Server
           │                 - Auth Google OAuth
           │                 - API REST
           │                 - Fichiers statiques
           │
           └──WS (8081)────→ WebSocket Server
                            - Gestion du jeu
                            - Synchronisation joueurs
                            - Calcul des scores
```

## 🛠️ Technologies

- **Backend :** Node.js, Express.js
- **WebSocket :** ws (WebSocket library)
- **Authentification :** Supabase + Google OAuth
- **Frontend :** HTML5, CSS3, JavaScript Vanilla
- **Base de données :** Supabase (PostgreSQL)

## 🌐 Configuration IP Automatique

**Nouvelle fonctionnalité !** L'application détecte automatiquement l'IP locale de la machine hôte.

### Avantages

- ✅ Pas besoin de modifier le code
- ✅ Fonctionne sur n'importe quelle machine
- ✅ Affichage clair de l'IP au démarrage
- ✅ URLs générées automatiquement
- ✅ Instructions Supabase affichées

### API de Configuration

L'application expose une API pour récupérer la configuration :

```bash
GET /api/config
```

Retourne :
```json
{
  "host": "192.168.1.100",
  "port": 3000,
  "wsPortReflex": 8081,
  "httpUrl": "http://192.168.1.100:3000",
  "wsReflexUrl": "ws://192.168.1.100:8081"
}
```

## 🎮 Multi-joueurs

Pour jouer avec d'autres personnes sur le réseau local :

1. Démarrez les serveurs sur une machine
2. Notez l'IP affichée (ex: `192.168.1.100`)
3. Partagez `http://192.168.1.100:3000` aux autres joueurs
4. Tout le monde se connecte avec Google
5. Le jeu démarre automatiquement avec 2+ joueurs

**Note :** Tous les joueurs doivent être sur le même réseau WiFi/local.

## 🧪 Page de Test

Accédez à `/test` pour :
- ✅ Vérifier l'état des serveurs
- ✅ Tester l'authentification
- ✅ Voir la configuration en temps réel
- ✅ Diagnostiquer les problèmes

```
http://VOTRE_IP:3000/test
```

## 📊 Scripts Disponibles

```bash
npm start           # Démarre le serveur HTTP
npm run dev         # Mode développement avec auto-reload
npm run ws:reflex   # Démarre le serveur WebSocket Reflex Shot
npm run ws:morpion  # Démarre le serveur WebSocket Morpion (ancien jeu)
```

## 🔧 Configuration Avancée

### Variables d'Environnement (.env)

```env
# Supabase
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_ANON_KEY=votre_clé

# Serveur (optionnel)
HOST=              # Laissez vide pour détection auto
PORT=3000
WS_PORT_REFLEX=8081
WS_PORT_MORPION=8080
```

### Personnalisation du Jeu

Éditez `websocket/reflexServer.js` :

```javascript
// Temps d'attente avant le signal vert
const MIN_WAIT_TIME = 2000;  // 2 secondes
const MAX_WAIT_TIME = 7000;  // 7 secondes

// Nombre de rounds par partie
const ROUND_COUNT = 5;

// Système de points
function calculateScore(reactionTime) {
  if (reactionTime < 200) return 1000;
  // ... modifiez selon vos besoins
}
```

## 🐛 Résolution de Problèmes

### "Connexion : Déconnecté" (WebSocket)
```bash
# Vérifiez que le serveur WS est démarré
npm run ws:reflex
```

### Erreur OAuth "Redirect URI Mismatch"
1. Vérifiez l'URL dans le terminal
2. Ajoutez-la exactement dans Supabase
3. Format : `http://IP:PORT/auth/v1/callback`

### Les joueurs ne peuvent pas se connecter
- ✅ Vérifiez que vous êtes sur le même réseau
- ✅ Désactivez temporairement le pare-feu
- ✅ Vérifiez que l'IP partagée est correcte

## 📈 Améliorations Futures

- [ ] Mode solo contre IA
- [ ] Sauvegarde des scores dans la base de données
- [ ] Leaderboard global
- [ ] Rooms privées avec codes
- [ ] Mode "survie" avec élimination
- [ ] Achievements et badges
- [ ] Replay des parties
- [ ] Graphiques de progression

## 👥 Contributeurs

- Développé pour le cours de Web Services - M2 YNOV

## 📄 Licence

Ce projet est à usage éducatif.

## 🙏 Remerciements

- Supabase pour l'authentification
- Google OAuth pour l'identification des utilisateurs
- La communauté Node.js et Express

---

**Développé avec ❤️ pour le plaisir et l'apprentissage**

**Bon jeu ! 🎮⚡**

