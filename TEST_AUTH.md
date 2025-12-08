# Test de l'authentification Google OAuth via Supabase

## 📋 Prérequis

### 1. Configuration Google Cloud Console
1. Allez sur [Google Cloud Console](https://console.cloud.google.com)
2. Créez ou sélectionnez un projet
3. Allez dans **APIs & Services** > **Credentials**
4. Créez un **OAuth 2.0 Client ID**
5. Ajoutez ces URIs de redirection autorisées :
   - `https://tghojvpmxzoieycydtwj.supabase.co/auth/v1/callback`
   - `http://localhost:3000/callback.html`

### 2. Configuration Supabase Dashboard
1. Allez sur [Supabase Dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet
3. **Authentication** > **Providers** > **Google**
4. Activez Google
5. Collez votre **Client ID** et **Client Secret** de Google Cloud Console
6. Sauvegardez

## 🚀 Lancement du serveur

```bash
npm install
node index.js
```

Le serveur démarre sur `http://localhost:3000`

## 🧪 Test de l'authentification

### Étape 1 : Page de connexion
1. Ouvrez votre navigateur
2. Allez sur : `http://localhost:3000/login.html`
3. Cliquez sur le bouton **"Se connecter avec Google"**

### Étape 2 : Authentification Google
1. Vous êtes redirigé vers la page de connexion Google
2. Sélectionnez votre compte Google
3. Acceptez les permissions

### Étape 3 : Page de succès
1. Vous êtes redirigé vers : `http://localhost:3000/callback.html`
2. La page affiche :
   - ✅ **"Connexion réussie !"**
   - Vos informations utilisateur (email, nom, etc.)
   - Votre access token
   - User ID

## 📁 Structure des fichiers

```
public/
  ├── login.html       → Page de connexion avec bouton Google
  └── callback.html    → Page affichée après authentification réussie

auth/
  └── auth.js          → Routes d'authentification (/login/google, /callback)

.env                   → Variables d'environnement (SUPABASE_URL, etc.)
index.js               → Serveur Express
```

## 🔍 Routes disponibles

| Route | Description |
|-------|-------------|
| `GET /login.html` | Page de connexion |
| `GET /auth/v1/login/google` | Initie l'OAuth Google (redirection) |
| `GET /callback.html` | Page de succès avec infos utilisateur |

## 🐛 Dépannage

### Erreur : "Unsupported provider: missing OAuth secret"
➡️ Le Client Secret n'est pas configuré dans Supabase Dashboard

### Erreur : "redirect_uri_mismatch"
➡️ L'URI de redirection n'est pas autorisée dans Google Cloud Console

### La page callback ne récupère pas la session
➡️ Vérifiez que le SDK Supabase est bien chargé depuis le CDN

## 📝 Notes importantes

- Les tokens OAuth arrivent dans l'URL via le **fragment** (`#access_token=...`)
- Le SDK Supabase côté client récupère automatiquement ces tokens
- L'access token est nécessaire pour les requêtes API authentifiées
- Le token expire après un certain temps (configurable dans Supabase)

## 🔒 Sécurité

⚠️ **Ne commitez JAMAIS** :
- Le fichier `.env`
- Le Client Secret de Google
- Les access tokens

Ajoutez `.env` dans votre `.gitignore` !

