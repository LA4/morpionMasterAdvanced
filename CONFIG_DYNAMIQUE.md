# 🌐 CONFIGURATION DYNAMIQUE DE L'IP - GUIDE COMPLET

## ✅ PROBLÈME RÉSOLU : IP CODÉE EN DUR

### Avant
- IP `10.15.2.246` était codée en dur partout
- Impossible d'héberger le jeu depuis une autre machine
- Nécessité de modifier manuellement tous les fichiers

### Maintenant
- ✅ **Détection automatique de l'IP locale**
- ✅ **Affichage de l'IP dans les terminaux**
- ✅ **URLs générées dynamiquement**
- ✅ **Fonctionne sur n'importe quelle machine**

---

## 🚀 DÉMARRAGE (Inchangé)

### Terminal 1 - Serveur HTTP
```powershell
npm start
```

### Terminal 2 - Serveur WebSocket
```powershell
npm run ws:reflex
```

---

## 📺 CE QUI S'AFFICHE AU DÉMARRAGE

### Terminal 1 (HTTP/API)
```
╔════════════════════════════════════════════════════════════╗
║           🎯 REFLEX SHOT - SERVEUR DÉMARRÉ 🎯            ║
╚════════════════════════════════════════════════════════════╝

📡 ADRESSE IP DU SERVEUR :
   🌐 192.168.1.100

🔌 PORTS ACTIFS :
   ├─ HTTP/API    : 3000
   ├─ WS Reflex   : 8081
   └─ WS Morpion  : 8080

🌐 ACCÈS AU JEU :
   👉 http://192.168.1.100:3000

📄 AUTRES PAGES :
   ├─ Login : http://192.168.1.100:3000/login
   ├─ Test  : http://192.168.1.100:3000/test
   └─ API   : http://192.168.1.100:3000/docs

⚠️  CONFIGURATION SUPABASE :
   Ajoutez cette URL de callback dans Supabase :
   👉 http://192.168.1.100:3000/auth/v1/callback

📋 PARTAGER AUX JOUEURS :
   Donnez cette adresse aux autres joueurs :
   👉 http://192.168.1.100:3000

═══════════════════════════════════════════════════════════════
```

### Terminal 2 (WebSocket Reflex)
```
╔════════════════════════════════════════════════════════════╗
║        🎮 SERVEUR WEBSOCKET REFLEX DÉMARRÉ 🎮           ║
╚════════════════════════════════════════════════════════════╝

📡 ADRESSE IP DU SERVEUR :
   🌐 192.168.1.100

🔌 CONNEXION WEBSOCKET :
   👉 ws://192.168.1.100:8081

✅ En attente de connexions des joueurs...

═══════════════════════════════════════════════════════════════
```

---

## ⚙️ CONFIGURATION SUPABASE

### Étape 1 : Récupérer l'URL de Callback
Quand vous démarrez le serveur, vous verrez :
```
⚠️  CONFIGURATION SUPABASE :
   Ajoutez cette URL de callback dans Supabase :
   👉 http://192.168.1.100:3000/auth/v1/callback
```

### Étape 2 : Configurer Supabase
1. Allez sur https://supabase.com
2. Ouvrez votre projet
3. **Authentication** → **URL Configuration**
4. Dans **Redirect URLs**, ajoutez :
   ```
   http://VOTRE_IP:3000/auth/v1/callback
   ```
5. Sauvegardez

### Étape 3 : Configurer Google OAuth
1. Dans **Authentication** → **Providers** → **Google**
2. Les paramètres OAuth sont déjà configurés
3. Assurez-vous que l'URL de callback est bien ajoutée

---

## 🎮 PARTAGER LE JEU

### Pour les Joueurs sur le Même Réseau Local

1. **Démarrez les serveurs** sur votre machine
2. **Notez l'adresse affichée** dans le terminal :
   ```
   👉 http://192.168.1.100:3000
   ```
3. **Partagez cette adresse** aux autres joueurs
4. Chaque joueur ouvre cette URL dans son navigateur
5. Tous se connectent avec leur compte Google
6. Le jeu démarre automatiquement avec 2+ joueurs !

---

## 🔧 CONFIGURATION AVANCÉE

### Option 1 : Utiliser une IP Spécifique

Si la détection automatique ne fonctionne pas, modifiez `.env` :

```env
# Spécifier une IP manuelle
HOST=192.168.1.100
```

### Option 2 : Changer les Ports

Modifiez `.env` :

```env
PORT=3000
WS_PORT_REFLEX=8081
WS_PORT_MORPION=8080
```

Puis redémarrez les serveurs.

---

## 🌍 FONCTIONNEMENT TECHNIQUE

### Architecture Dynamique

```
┌─────────────────────────────────────────┐
│  Démarrage du Serveur                   │
└─────────────────┬───────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────┐
│  Détection de l'IP Locale               │
│  - Parcourt les interfaces réseau       │
│  - Trouve l'IP non-interne (non 127.x)  │
│  - Fallback sur localhost si nécessaire │
└─────────────────┬───────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────┐
│  Affichage dans le Terminal             │
│  - IP détectée                          │
│  - URLs complètes                       │
│  - Instructions Supabase                │
└─────────────────┬───────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────┐
│  API /api/config                        │
│  Expose la configuration aux clients :  │
│  {                                      │
│    "host": "192.168.1.100",            │
│    "port": 3000,                       │
│    "wsReflexUrl": "ws://..."           │
│  }                                      │
└─────────────────┬───────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────┐
│  Frontend (index.html)                  │
│  1. Appelle /api/config                │
│  2. Récupère les URLs dynamiques        │
│  3. Se connecte au WebSocket            │
└─────────────────────────────────────────┘
```

### Fichiers Modifiés

1. **utils/networkUtils.js** (CRÉÉ)
   - Fonction `getLocalIP()` pour détection IP
   - Fonction `displayServerInfo()` pour affichage

2. **index.js**
   - Import de `getLocalIP()`
   - Détection de l'IP au démarrage
   - Route `/api/config` pour exposer la config
   - Affichage formaté dans le terminal

3. **websocket/reflexServer.js**
   - Détection de l'IP locale
   - Affichage des informations de connexion
   - Utilisation des variables d'environnement

4. **auth/auth.js**
   - Utilisation de l'IP dynamique pour les redirections OAuth
   - Plus d'IP en dur
   - Logs de débogage améliorés

5. **public/index.html**
   - Appel à `/api/config` au chargement
   - Récupération dynamique de l'URL WebSocket
   - Fallback en cas d'erreur

6. **public/auth.html**
   - Utilisation de `window.location` pour URL dynamique
   - Plus d'IP codée en dur

7. **public/test.html**
   - Récupération de la config depuis `/api/config`
   - Affichage de l'IP détectée

8. **.env**
   - Ajout de `HOST`, `PORT`, `WS_PORT_REFLEX`, `WS_PORT_MORPION`
   - Variables configurables

---

## 🧪 TESTER LA CONFIGURATION

### 1. Ouvrir la Page de Test
```
http://VOTRE_IP:3000/test
```

### 2. Vérifier les Logs
Dans la section "Logs", vous devriez voir :
```
Configuration chargée: http://192.168.1.100:3000
```

### 3. Tester les Serveurs
Cliquez sur "Retester les serveurs" :
- ✅ HTTP (3000): En ligne
- ✅ WebSocket (8081): En ligne

---

## 🐛 RÉSOLUTION DE PROBLÈMES

### L'IP affichée n'est pas la bonne

**Solution 1 : Spécifier manuellement dans .env**
```env
HOST=192.168.1.100
```

**Solution 2 : Vérifier les interfaces réseau**
```powershell
ipconfig
```
Cherchez votre IP locale (192.168.x.x ou 10.x.x.x)

### Erreur OAuth Redirect URI Mismatch

1. Vérifiez l'URL affichée dans le terminal
2. Ajoutez-la dans Supabase → Authentication → URL Configuration
3. Format exact : `http://IP:PORT/auth/v1/callback`

### Les joueurs ne peuvent pas se connecter

**Vérifiez le pare-feu :**
```powershell
# Autoriser les ports
New-NetFirewallRule -DisplayName "Reflex Shot HTTP" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "Reflex Shot WS" -Direction Inbound -LocalPort 8081 -Protocol TCP -Action Allow
```

**Vérifiez que vous êtes sur le même réseau :**
- Tous les joueurs doivent être sur le même WiFi/réseau local

---

## 📝 EXEMPLES D'UTILISATION

### Scénario 1 : Développement Local (Solo)
```
1. npm start (Terminal 1)
2. npm run ws:reflex (Terminal 2)
3. Ouvrir http://localhost:3000
4. Tester en mode solo
```

### Scénario 2 : Réseau Local (Multi-joueurs)
```
1. Personne A démarre les serveurs
2. Terminal affiche : http://192.168.1.100:3000
3. Personne A ajoute l'URL callback dans Supabase
4. Personne B/C/D ouvrent http://192.168.1.100:3000
5. Tout le monde se connecte et joue !
```

### Scénario 3 : Changement de Machine
```
1. Nouvelle personne clone le repo
2. npm install
3. npm start + npm run ws:reflex
4. Nouvelle IP s'affiche automatiquement
5. Mise à jour de l'URL callback dans Supabase
6. Prêt à jouer !
```

---

## ✅ AVANTAGES DE LA NOUVELLE CONFIGURATION

| Avant | Après |
|-------|-------|
| IP codée en dur | ✅ IP détectée automatiquement |
| Modification manuelle de 6 fichiers | ✅ Aucune modification nécessaire |
| Impossible de changer d'hôte | ✅ Fonctionne sur n'importe quelle machine |
| Pas d'info sur l'IP à partager | ✅ Affichage clair dans le terminal |
| Config Supabase à deviner | ✅ URL callback affichée directement |
| Test compliqué | ✅ Page /test avec config affichée |

---

## 🎯 CHECKLIST POUR NOUVEAU SERVEUR

Quand quelqu'un d'autre héberge le jeu :

- [ ] Cloner le repo
- [ ] `npm install`
- [ ] Démarrer les 2 serveurs
- [ ] Noter l'IP affichée dans le terminal
- [ ] Ajouter l'URL callback dans Supabase
- [ ] Partager l'URL du jeu aux joueurs
- [ ] Vérifier sur /test que tout fonctionne
- [ ] C'est parti ! 🎮

---

## 📞 API de Configuration

### GET /api/config

Retourne la configuration du serveur :

```json
{
  "host": "192.168.1.100",
  "port": 3000,
  "wsPortReflex": 8081,
  "wsPortMorpion": 8080,
  "httpUrl": "http://192.168.1.100:3000",
  "wsReflexUrl": "ws://192.168.1.100:8081",
  "wsMorpionUrl": "ws://192.168.1.100:8080"
}
```

**Usage dans le frontend :**
```javascript
const response = await fetch('/api/config');
const config = await response.json();
const ws = new WebSocket(config.wsReflexUrl);
```

---

## 🎉 RÉSUMÉ

**Plus besoin de modifier le code pour changer d'hôte !**

1. Démarrez les serveurs
2. Lisez l'IP affichée
3. Configurez Supabase
4. Partagez aux joueurs
5. Jouez ! 🚀

**Tout est automatique et dynamique ! ✅**

