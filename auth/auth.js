import express from 'express';
import { supabase } from '../supabaseClient.js';
import { getLocalIP } from '../utils/networkUtils.js';
import * as dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || getLocalIP();

router.get('/login/google', async (req, res) => {
    /**
     * @swagger
     * /auth/v1/login/google:
     *   get:
     *     summary: Initiate Google OAuth authentication via Supabase
     *     tags:
     *       - Auth
     *     responses:
     *       302:
     *         description: Redirect to Google authentication URL
     *         headers:
     *           Location:
     *             description: Redirect URL to OAuth provider (Google)
     *             schema:
     *               type: string
     *       400:
     *         description: Error during authentication attempt
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: "Authentication failed"
     */

    const callbackUrl = `http://${HOST}:${PORT}/auth/v1/callback`;

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: callbackUrl
        },
        queryParams: {
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
        return res.status(400).json({ error: "No code" });
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

    const userName = data.session.user.user_metadata.full_name || data.session.user.email;
    res.cookie('user-name', userName, {
        secure: false,
        maxAge: 3600000
    });
    res.cookie('user-id', data.session.user.id ,{
        secure: false,
        maxAge: 3600000,
    });

    return res.redirect(`http://${HOST}:${PORT}/`);
});

router.get('/logout', async (req, res) => {
    await supabase.auth.signOut();
    res.redirect(`http://${HOST}:${PORT}/login`);
});

export default router;