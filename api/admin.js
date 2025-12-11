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
     */

    const { data: profiles, error } = await supabase.from('profiles').select('*');

    if (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }

    res.status(200).json(profiles);
});
export default adminRouter;