import express from 'express';
import { supabase } from '../supabaseClient.js';
import { verifyAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/v1/scores:
 *   post:
 *     summary: Soumet un nouveau score
 *     tags:
 *       - Scores
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - score
 *             properties:
 *               score:
 *                 type: integer
 *                 description: Le score obtenu par le joueur
 *                 example: 1500
 *     responses:
 *       201:
 *         description: Score enregistré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Score enregistré avec succès
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     user_id:
 *                       type: string
 *                     score:
 *                       type: integer
 *                     user_name:
 *                       type: string
 *                     created_at:
 *                       type: string
 *       400:
 *         description: Requête invalide
 *       401:
 *         description: Non authentifié
 */
router.post('/', verifyAuth, async (req, res) => {
    try {
        const { score } = req.body;
        
        // Validation
        if (score === undefined || score === null) {
            return res.status(400).json({ 
                error: 'Le score est requis.' 
            });
        }
        
        if (typeof score !== 'number' || score < 0) {
            return res.status(400).json({ 
                error: 'Le score doit être un nombre positif.' 
            });
        }

        // Get user info
        const user = req.user;
        const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonyme';

        // Insert score into database
        const { data, error } = await supabase
            .from('scores')
            .insert([
                {
                    user_id: user.id,
                    score: score,
                    user_name: userName
                }
            ])
            .select();

        if (error) {
            console.error('Erreur Supabase:', error);
            return res.status(500).json({ 
                error: 'Erreur lors de l\'enregistrement du score.' 
            });
        }

        res.status(201).json({
            message: 'Score enregistré avec succès',
            data: data[0]
        });

    } catch (error) {
        console.error('Erreur lors de l\'enregistrement du score:', error);
        res.status(500).json({ 
            error: 'Erreur serveur lors de l\'enregistrement du score.' 
        });
    }
});

/**
 * @swagger
 * /api/v1/scores:
 *   get:
 *     summary: Récupère tous les scores
 *     tags:
 *       - Scores
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Nombre de scores à récupérer
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           enum: [score, created_at]
 *           default: score
 *         description: Trier par score ou date
 *     responses:
 *       200:
 *         description: Liste des scores
 */
router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const orderBy = req.query.orderBy === 'created_at' ? 'created_at' : 'score';
        
        const { data, error } = await supabase
            .from('scores')
            .select('*')
            .order(orderBy, { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Erreur Supabase:', error);
            return res.status(500).json({ 
                error: 'Erreur lors de la récupération des scores.' 
            });
        }

        res.json({
            data: data
        });

    } catch (error) {
        console.error('Erreur lors de la récupération des scores:', error);
        res.status(500).json({ 
            error: 'Erreur serveur lors de la récupération des scores.' 
        });
    }
});

export default router;
