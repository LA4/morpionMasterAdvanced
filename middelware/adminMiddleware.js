import { supabase } from '../supabaseClient.js';

export const requireAdmin = async (req, res, next) => {
  console.log("je suis dans le middleware !!! req.user:", req.user);

  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Non authentifié' });
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', req.user.id)
    .single();

  if (error) {
    console.error('Erreur Supabase profil:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }

  if (!profile || profile.role !== 'admin') {
    return res.status(403).json({ message: 'Accès refusé : privilèges administrateur requis' });
  }

  next();
};
export const adminMiddleware = requireAdmin;