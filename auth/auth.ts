import express from 'express';
import { supabase } from '../supabaseClient.js';
import * as dotenv from 'dotenv';
dotenv.config();
const router = express.Router();
router.get('/login/google', async (req, res) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${process.env.WEB_URL}/auth/v1/callback`
        }
    });

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.redirect(data.url);
});

router.get('/callback', async (req, res) => {
    const { access_token, refresh_token } = req.query;

    if (access_token) {
        const { data, error } = await supabase.auth.setSession({
            access_token,
            refresh_token
        });

        if (error) {
            return res.redirect('/login?error=auth_failed');
        }

        return res.redirect('/dashboard');
    }

    res.redirect('/login');
});