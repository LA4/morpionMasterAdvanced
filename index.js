import express from 'express';
import { specs, swaggerUi } from "./swagger.js";
import authRouter from "./auth/auth.js";
import userRouter from "./api/user.js";
import adminRouter from "./api/admin.js";
import scoreRouter from "./api/score.js";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { authMiddleware } from "./middelware/authMiddelware.js";
import { adminMiddleware } from "./middelware/adminMiddleware.js";
import { getLocalIP, displayServerInfo } from "./utils/networkUtils.js";
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const WS_PORT_REFLEX = process.env.WS_PORT_REFLEX || 8081;
const WS_PORT_MORPION = process.env.WS_PORT_MORPION || 8080;
const HOST = process.env.HOST || getLocalIP();
const version = "v1";

app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
app.use(cors());

// Middleware pour injecter l'IP du serveur dans toutes les réponses HTML
app.use((req, res, next) => {
    res.locals.serverHost = HOST;
    res.locals.serverPort = PORT;
    res.locals.wsPortReflex = WS_PORT_REFLEX;
    res.locals.wsPortMorpion = WS_PORT_MORPION;
    next();
});

// API pour récupérer la configuration du serveur
app.get('/api/config', (req, res) => {
    res.json({
        host: HOST,
        port: PORT,
        wsPortReflex: WS_PORT_REFLEX,
        wsPortMorpion: WS_PORT_MORPION,
        httpUrl: `http://${HOST}:${PORT}`,
        wsReflexUrl: `ws://${HOST}:${WS_PORT_REFLEX}`,
        wsMorpionUrl: `ws://${HOST}:${WS_PORT_MORPION}`
    });
});

app.use(`/auth/v1`, authRouter)
app.use(`/api/${version}/user`, authMiddleware, userRouter)
app.use(`/api/${version}/scores`, scoreRouter)
app.use(`/api/${version}/admin`, authMiddleware, adminMiddleware, adminRouter)

// Routes pour les pages HTML

app.get('/', (req, res) => {
    // Vérifier si l'utilisateur a un token
    const token = req.cookies['sb-access-token'];
    if (!token) {
        return res.redirect('/login');
    }
    res.sendFile('index.html', { root: 'public' });
});
app.get('/login', (req, res) => {
    res.sendFile('auth.html', { root: 'public' });
});
app.get('/test', (req, res) => {
    res.sendFile('test.html', { root: 'public' });
});


app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));


// Démarrage du serveur si ce fichier est le point d'entrée principal (pas importé par Vercel)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        displayServerInfo(PORT, WS_PORT_REFLEX, WS_PORT_MORPION, HOST);
    });
}

export default app;

