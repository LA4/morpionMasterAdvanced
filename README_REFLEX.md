# 🎯 Reflex Shot - Jeu de Réflexes Multijoueur

## 📝 Description

Reflex Shot est un jeu de réflexes en temps réel où deux joueurs s'affrontent pour déterminer qui a les réflexes les plus rapides. Le jeu se déroule en 5 rounds où les joueurs doivent cliquer le plus rapidement possible lorsque l'écran passe du rouge au vert.

## ✨ Fonctionnalités

### Authentification
- **Connexion obligatoire via Google OAuth** avant d'accéder au jeu
- Première connexion redirige automatiquement vers la page de connexion
- Les informations de l'utilisateur (nom, prénom) sont récupérées depuis Google

### Système de Jeu
- **Multijoueur en temps réel** (minimum 2 joueurs)
- **5 rounds par partie**
- **Système de points basé sur le temps de réaction** :
  - < 200ms : 1000 points ⚡
  - 200-300ms : 800 points
  - 300-400ms : 600 points
  - 400-500ms : 400 points
  - 500-700ms : 200 points
  - > 700ms : 100 points
- **Pénalité** : -100 points pour clic anticipé (sur rouge)
- **Classement final** avec médailles 🥇🥈🥉

## 🚀 Installation et Démarrage

### 1. Installer les dépendances (si ce n'est pas déjà fait)
```bash
npm install
```

### 2. Démarrer les serveurs

Vous devez démarrer **3 terminaux différents** :

#### Terminal 1 - Serveur HTTP (Express)
```bash
npm start
```
Ou en mode développement :
```bash
npm run dev
```

#### Terminal 2 - Serveur WebSocket Reflex Shot
```bash
npm run ws:reflex
```

#### Terminal 3 - Serveur WebSocket Morpion (optionnel, si vous voulez aussi le morpion)
```bash
npm run ws:morpion
```

### 3. Accéder au jeu

Ouvrez votre navigateur et allez sur :
```
http://10.15.2.246:3000
```

## 🎮 Comment jouer

1. **Connexion** : Cliquez sur "Se connecter avec Google" et autorisez l'application
2. **Attente des joueurs** : Une fois connecté, attendez qu'un autre joueur rejoigne
3. **Prêt** : Cliquez sur le bouton "PRÊT !" lorsque vous êtes prêt à commencer
4. **Départ** : Le jeu démarre quand tous les joueurs sont prêts (minimum 2)
5. **Jouer** : 
   - L'écran devient ROUGE - **NE CLIQUEZ PAS** (sinon pénalité !)
   - Attendez que l'écran devienne VERT
   - **CLIQUEZ** le plus vite possible quand c'est vert !
6. **Résultats** : Après 5 rounds, le classement final s'affiche

## 🏗️ Architecture Technique

### Serveurs
- **Port 3000** : Serveur HTTP Express (API + fichiers statiques)
- **Port 8080** : WebSocket Morpion (ancien jeu)
- **Port 8081** : WebSocket Reflex Shot (nouveau jeu)

### Technologies
- **Frontend** : HTML5, CSS3, JavaScript Vanilla, WebSocket API
- **Backend** : Node.js, Express.js, WebSocket (ws)
- **Authentification** : Supabase + Google OAuth
- **Temps réel** : WebSocket pour la synchronisation des joueurs

## 🔧 Modifications apportées

### Authentification
- ✅ Redirection automatique vers `/login` si pas de token
- ✅ Vérification côté serveur du cookie `sb-access-token`
- ✅ Récupération du nom complet depuis Google OAuth
- ✅ Plus de message "Bienvenue Joueur" par défaut

### Nouveau Jeu
- ✅ Serveur WebSocket dédié (`reflexServer.js`)
- ✅ Interface utilisateur moderne et responsive
- ✅ Système de rounds (5 rounds par partie)
- ✅ Calcul de points basé sur le temps de réaction
- ✅ Gestion des clics anticipés (pénalité)
- ✅ Affichage en temps réel des scores
- ✅ Classement final avec podium
- ✅ Support multi-joueurs (2+)

## 📁 Fichiers modifiés/créés

- ✅ `index.js` - Ajout vérification token
- ✅ `public/index.html` - Nouvelle interface Reflex Shot
- ✅ `websocket/reflexServer.js` - Nouveau serveur WebSocket
- ✅ `package.json` - Nouveaux scripts npm
- ✅ `README_REFLEX.md` - Cette documentation

## 🐛 Dépannage

### "Déconnecté" en rouge
- Vérifiez que le serveur WebSocket Reflex est bien démarré (`npm run ws:reflex`)
- Vérifiez que le port 8081 n'est pas utilisé par une autre application

### Redirection infinie vers /login
- Supprimez les cookies du navigateur
- Reconnectez-vous via Google

### Les autres joueurs ne me voient pas
- Vérifiez que tous les joueurs utilisent la même adresse IP (10.15.2.246)
- Assurez-vous que le firewall autorise les connexions sur le port 8081

## 👥 Multijoueur

Le jeu nécessite **minimum 2 joueurs** pour commencer. Vous pouvez :
- Ouvrir plusieurs onglets avec des comptes Google différents
- Demander à des amis sur le même réseau de se connecter
- Utiliser différents navigateurs sur la même machine

## 🎨 Personnalisation

Vous pouvez modifier dans `reflexServer.js` :
- `MIN_WAIT_TIME` : Temps minimum d'attente avant le vert (défaut: 2000ms)
- `MAX_WAIT_TIME` : Temps maximum d'attente avant le vert (défaut: 7000ms)
- `ROUND_COUNT` : Nombre de rounds par partie (défaut: 5)
- Fonction `calculateScore()` : Barème de points selon le temps de réaction

## 📄 Licence

Ce projet est à usage éducatif.

