import jwt from 'jsonwebtoken';
import { supabase } from '../supabaseClient.js';

/**
 * Middleware to verify JWT token from Supabase
 * Extracts the token from Authorization header and verifies it
 */
export const verifyAuth = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                error: 'Token manquant. Veuillez vous authentifier.' 
            });
        }

        const token = authHeader.split(' ')[1];

        // Verify token with Supabase
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({ 
                error: 'Token invalide ou expiré.' 
            });
        }

        // Attach user info to request
        req.user = user;
        req.token = token;
        
        next();
    } catch (error) {
        console.error('Erreur d\'authentification:', error);
        return res.status(401).json({ 
            error: 'Erreur lors de la vérification du token.' 
        });
    }
};
