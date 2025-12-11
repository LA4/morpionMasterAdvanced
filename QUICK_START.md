# 🎯 GUIDE DE DÉMARRAGE RAPIDE - REFLEX SHOT

## ⚡ Démarrage Rapide (3 terminaux)

### Option 1 : Lancement manuel (RECOMMANDÉ)

Ouvrez **3 terminaux PowerShell** et lancez dans chacun :

#### Terminal 1️⃣
```powershell
npm start
```

#### Terminal 2️⃣
```powershell
npm run ws:reflex
```

#### Terminal 3️⃣ (Optionnel - pour le morpion)
```powershell
npm run ws:morpion
```

### Option 2 : Script automatique (expérimental)

```powershell
.\start-servers.ps1
```

## 🌐 Accès au jeu

Une fois les serveurs démarrés, ouvrez votre navigateur :

```
http://10.15.2.246:3000
```

## ✅ Vérifications

Si vous voyez ces messages, tout est OK :

✅ Terminal 1 : `Listening on port 3000`
✅ Terminal 2 : `Reflex Shot server is running on port 8081`

## 🎮 Première utilisation

1. Vous serez redirigé vers la page de connexion
2. Cliquez sur "Se connecter avec Google"
3. Autorisez l'application
4. Vous arrivez sur le jeu avec votre nom/prénom
5. Attendez un autre joueur ou ouvrez un autre onglet
6. Cliquez sur "PRÊT !" quand vous êtes prêt

## ⚠️ Problèmes courants

### "Connexion : Déconnecté" (rouge)
➡️ Le serveur WebSocket n'est pas démarré
🔧 Lancez `npm run ws:reflex` dans un terminal

### Redirection vers /login en boucle
➡️ Problème de cookie
🔧 Supprimez les cookies du site ou utilisez mode privé

### "En attente des joueurs..."
➡️ Normal ! Il faut minimum 2 joueurs
🔧 Ouvrez un autre onglet avec un autre compte Google

## 📊 Système de points

| Temps de réaction | Points |
|------------------|--------|
| < 200 ms         | 1000   |
| 200-300 ms       | 800    |
| 300-400 ms       | 600    |
| 400-500 ms       | 400    |
| 500-700 ms       | 200    |
| > 700 ms         | 100    |
| Clic anticipé    | -100   |

## 🏆 Déroulement d'une partie

1. Les joueurs cliquent sur "PRÊT"
2. La partie démarre automatiquement (5 rounds)
3. Chaque round :
   - Écran ROUGE → Attendez !
   - Écran VERT → CLIQUEZ !
4. Après 5 rounds → Classement final
5. Cliquez sur "Rejouer" pour relancer

## 🎯 Conseils pour gagner

- Ne cliquez JAMAIS sur le rouge (-100 points)
- Restez concentré sur l'écran
- Visez un temps < 300ms pour le top score
- Les réflexes s'améliorent avec la pratique !

## 🆘 Support

En cas de problème, vérifiez :
1. Les 2 serveurs sont bien démarrés
2. Vous êtes connecté via Google
3. Minimum 2 joueurs dans la partie
4. Pare-feu n'bloque pas les ports 3000 et 8081

---

**Bon jeu ! 🎮⚡**

