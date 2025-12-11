import express from 'express';
import { supabase } from '../supabaseClient.js';
import * as dotenv from 'dotenv';

dotenv.config();
const router = express.Router();
router.get('/login/google', async (req, res) => {
    /**
     * @swagger
     * /auth/v1/login/google:
     *   get:
     *     summary: Initie l'authentification OAuth Google via Supabase
     *     tags:
     *       - Auth
     *     responses:
     *       302:
     *         description: Redirection vers l'URL d'authentification Google
     *         headers:
     *           Location:
     *             description: URL de redirection vers le fournisseur OAuth (Google)
     *             schema:
     *               type: string
     *       400:
     *         description: Erreur lors de la tentative d'authentification
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     */
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `http://10.15.2.246:3000/auth/v1/callback`
        }, queryParams: {
            access_type: 'offline',
            prompt: 'consent',
        },
    });

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.redirect(data.url);
});

router.get('/callback', async (req, res) => {
    const { code } = req.query;
    if (!code) {
        return res.status(400).json({ error: "Aucun code fourni" });
    }
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
        return res.redirect('/login?error=auth_failed');
    }
    const { access_token } = data.session;

    res.cookie('sb-access-token', access_token, {
        secure: false,
        maxAge: 3600000,
    });

    // // Ajout du nom d'utilisateur dans un cookie simple pour lecture front
    const userName = data.session.user.user_metadata.full_name || data.session.user.email;
    res.cookie('user-name', userName, {
        secure: false,
        maxAge: 3600000
    });

    return res.redirect('http://10.15.2.246:3000/');
});

router.get('/logout', async (req, res) => {
    await supabase.auth.signOut();
    res.redirect('http://10.15.2.246:3000/login');
});

export default router;