import express from 'express';
import {supabase} from '../supabaseClient.js';
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
    const {data, error} = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `http://localhost:3000/callback.html`
        }
    });

    if (error) {
        return res.status(400).json({error: error.message});
    }

    res.redirect(data.url);
});

router.get('/callback', async (req, res) => {
    const {access_token, refresh_token} = req.query;

    if (access_token) {
        const {data, error} = await supabase.auth.setSession({
            access_token,
            refresh_token
        });

        if (error) {
            return res.redirect('/login?error=auth_failed');
        }

        return res.redirect('../public/callback.html');
    }

    res.redirect('/login');
});
export default router;