import express from "express";
import { supabase } from "../supabaseClient.js";
const adminRouter = express.Router();

adminRouter.get("/profiles", async (req, res) => {
    /**
     * @swagger
     * /api/v1/admin/profiles:
     *   get:
     *     summary: Get all user profiles
     *     tags: [Admin]
     *     responses:
     *       200:
     *         description: List of user profiles
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: string
     *                     description: The user ID
     *                   email:
     *                     type: string
     *                     description: The user's email address
     *                   name:
     *                     type: string
     *                     description: The user's name
     *       401:
     *         description: Unauthorized, admin access required
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: Unauthorized
     *       404:
     *         description: No profiles found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: No profiles found
     *       500:
     *         description: Internal server error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: Internal server error
     */

    const { data: profiles, error } = await supabase.from('profiles').select('*');
    
    if (!req.user || !req.user.is_admin) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!profiles) {
        return res.status(404).json({ message: 'No profiles found' });
    }
    if (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }

    res.status(200).json(profiles);
});
export default adminRouter;