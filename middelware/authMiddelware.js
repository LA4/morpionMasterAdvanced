import { supabase } from '../supabaseClient.js';
export const requireAuth = async (req, res, next) => {
    const accessToken = req.cookies['sb-access-token'];

    if (!accessToken) {
        return res.status(401).redirect('/login?error=no_session');
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
        res.clearCookie('sb-access-token');
        return res.status(401).redirect('/login?error=expired_session');
    }

    req.user = user;

    next();
};
export const authMiddleware = requireAuth;