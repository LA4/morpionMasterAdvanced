# 🎯 REFLEX SHOT - AIDE-MÉMOIRE

## 🚀 LANCER LE JEU (2 commandes)

### Terminal 1
```powershell
npm start
```

### Terminal 2
```powershell
npm run ws:reflex
```

### Navigateur
```
http://10.15.2.246:3000
```

---

## ✅ CE QUI A ÉTÉ CORRIGÉ

### Problème 1 : Authentification
- ✅ Plus de "Bienvenue Joueur" par défaut
- ✅ Redirection automatique vers Google OAuth
- ✅ Nom/Prénom affiché dès la connexion

### Problème 2 : Nouveau Jeu
- ✅ Jeu Reflex Shot créé
- ✅ 2 joueurs minimum
- ✅ 5 rounds par partie
- ✅ Points selon temps de réaction
- ✅ Pénalité pour clic anticipé (-100)
- ✅ Classement final

---

## 📊 POINTS DU JEU

| Temps | Points |
|-------|--------|
| < 200ms | 1000 ⚡ |
| 200-300ms | 800 |
| 300-400ms | 600 |
| 400-500ms | 400 |
| 500-700ms | 200 |
| > 700ms | 100 |
| Rouge | -100 ❌ |

---

## 📁 DOCUMENTATION CRÉÉE

1. **README_REFLEX.md** → Doc complète
2. **QUICK_START.md** → Guide rapide
3. **COMMANDES.md** → Toutes les commandes
4. **RECAP.md** → Détails techniques
5. **start-servers.ps1** → Script auto
6. **/test** → Page de diagnostic

---

## 🐛 PROBLÈMES FRÉQUENTS

**"Connexion : Déconnecté"**
→ Lancez `npm run ws:reflex`

**Redirect infini vers /login**
→ Supprimez les cookies

**"Attente des joueurs..."**
→ Il faut 2 joueurs minimum

---

## 🎮 COMMENT JOUER

1. Lancez les 2 serveurs
2. Connectez-vous avec Google
3. Attendez un 2ème joueur
4. Cliquez "PRÊT !"
5. Ne cliquez QUE sur le VERT !
6. Après 5 rounds → Classement

---

## 📞 PAGES UTILES

**Remplacez VOTRE_IP par l'IP affichée dans le terminal**

- **Jeu :** http://VOTRE_IP:3000
- **Test :** http://VOTRE_IP:3000/test
- **Login :** http://VOTRE_IP:3000/login
- **API :** http://VOTRE_IP:3000/docs
- **Config API :** http://VOTRE_IP:3000/api/config ⭐ NOUVEAU

---

## 🌍 MULTI-JOUEURS

Pour jouer avec d'autres personnes :

1. Démarrez les serveurs sur VOTRE machine
2. Notez l'IP affichée (ex: 192.168.1.100)
3. Partagez `http://192.168.1.100:3000` aux autres
4. Tout le monde se connecte avec Google
5. C'est parti ! 🎮

**Les autres joueurs doivent être sur le même réseau WiFi/local**

---

**Tout est prêt ! Bon jeu ! 🎮⚡**

