# ⚡ COMMANDES ESSENTIELLES - REFLEX SHOT

## 🚀 Démarrage Rapide

### Option A : Démarrage Manuel (RECOMMANDÉ)

Ouvrez **2 terminaux PowerShell** séparés :

#### Terminal 1 - Serveur HTTP/API
```powershell
npm start
```
✅ Serveur Express démarre sur port 3000

#### Terminal 2 - Serveur WebSocket Reflex
```powershell
npm run ws:reflex
```
✅ Serveur WebSocket démarre sur port 8081

### Option B : Script Automatique
```powershell
.\start-servers.ps1
```
⚠️ Moins de contrôle sur les logs

---

## 🌐 URLs d'Accès

| Page | URL | Description |
|------|-----|-------------|
| **Jeu** | http://10.15.2.246:3000 | Page principale du jeu |
| **Login** | http://10.15.2.246:3000/login | Connexion Google |
| **Test** | http://10.15.2.246:3000/test | Page de diagnostic |
| **API Docs** | http://10.15.2.246:3000/docs | Documentation Swagger |

---

## 📦 Commandes NPM

```powershell
# Installer les dépendances
npm install

# Démarrer le serveur HTTP (Express)
npm start

# Démarrer en mode dev avec auto-reload
npm run dev

# Démarrer le serveur WebSocket Reflex Shot
npm run ws:reflex

# Démarrer le serveur WebSocket Morpion (ancien jeu)
npm run ws:morpion
```

---

## 🧪 Commandes de Test

### Vérifier si les ports sont libres
```powershell
# Vérifier port 3000
netstat -ano | findstr :3000

# Vérifier port 8081
netstat -ano | findstr :8081

# Vérifier port 8080
netstat -ano | findstr :8080
```

### Tuer un processus sur un port
```powershell
# Trouver le PID
netstat -ano | findstr :3000

# Tuer le processus (remplacer PID)
taskkill /PID <PID> /F
```

---

## 🗑️ Nettoyage

### Effacer les cookies (PowerShell)
```powershell
# Via la page de test
Start-Process "http://10.15.2.246:3000/test"
# Puis cliquer sur "Effacer les cookies"
```

### Réinstaller les dépendances
```powershell
# Supprimer node_modules
Remove-Item -Recurse -Force node_modules

# Réinstaller
npm install
```

---

## 🔍 Debug

### Voir les logs en temps réel
```powershell
# Les logs s'affichent directement dans les terminaux où vous avez lancé les serveurs
```

### Accéder à la page de test
```powershell
Start-Process "http://10.15.2.246:3000/test"
```

### Console navigateur
```
F12 → Console
```

---

## 🛑 Arrêt des Serveurs

### Arrêter un terminal
```
Ctrl + C
```

### Arrêter tous les processus Node
```powershell
# ATTENTION : Arrête TOUS les processus Node.js
Get-Process node | Stop-Process -Force
```

---

## 📋 Checklist Avant de Jouer

- [ ] Terminal 1 : `npm start` lancé
- [ ] Terminal 2 : `npm run ws:reflex` lancé
- [ ] Message "Listening on port 3000" visible
- [ ] Message "Reflex Shot server is running on port 8081" visible
- [ ] Navigateur ouvert sur http://10.15.2.246:3000
- [ ] Authentification Google réussie
- [ ] Au moins 2 joueurs connectés

---

## 🎮 Commandes en Jeu

Une fois dans le jeu :

1. **S'authentifier** → Cliquez sur "Se connecter avec Google"
2. **Attendre** → Minimum 2 joueurs nécessaires
3. **Se préparer** → Cliquez sur "PRÊT !"
4. **Jouer** → Cliquez sur VERT uniquement !
5. **Voir résultats** → Après 5 rounds
6. **Rejouer** → Bouton "Rejouer"
7. **Se déconnecter** → Bouton "Déconnexion"

---

## 🔧 Configuration Avancée

### Modifier les paramètres du jeu

Éditez `websocket/reflexServer.js` :

```javascript
// Lignes 12-14
const MIN_WAIT_TIME = 2000;  // Temps min avant vert (ms)
const MAX_WAIT_TIME = 7000;  // Temps max avant vert (ms)
const ROUND_COUNT = 5;       // Nombre de rounds
```

### Modifier le système de points

Éditez `websocket/reflexServer.js`, fonction `calculateScore()` :

```javascript
// Ligne 41+
function calculateScore(reactionTime) {
  if (reactionTime < 200) return 1000;
  if (reactionTime < 300) return 800;
  // Modifiez selon vos besoins
}
```

---

## 📚 Documentation Complète

Pour plus de détails, consultez :

- `README_REFLEX.md` → Documentation technique complète
- `QUICK_START.md` → Guide de démarrage rapide
- `RECAP.md` → Récapitulatif des modifications
- `/test` → Page de test interactive

---

## 🆘 Aide Rapide

| Problème | Solution |
|----------|----------|
| Port déjà utilisé | `taskkill /PID <PID> /F` |
| Serveur ne démarre pas | Vérifiez les erreurs dans le terminal |
| Pas de connexion WS | Lancez `npm run ws:reflex` |
| Redirect infini | Effacez les cookies |
| Pas de 2ème joueur | Ouvrez un autre onglet |

---

## 📞 Support

1. Consultez la page `/test` pour diagnostiquer
2. Vérifiez que les 2 serveurs tournent
3. Regardez les logs des terminaux
4. Vérifiez la console du navigateur (F12)

---

**Créé le 11/12/2025 - Reflex Shot v1.0**

