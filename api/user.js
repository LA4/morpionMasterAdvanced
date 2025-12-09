import express from "express";
import { supabase } from "../supabaseClient.js";
const userRouter = express.Router();

userRouter.get("/me", async (req, res) => {
    /**
     * @swagger
     * /api/user/v1/me:
     *   get:
     *     summary: Get current authenticated user details
     *     tags: [Users]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: User details
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: string
     *                   description: The user ID
     *                 email:
     *                   type: string
     *                   description: The user's email address
     *                 name:
     *                   type: string
     *                   description: The user's name
     *       401:
     *         description: Unauthorized, authentication token missing or invalid
     */


    const { data, error } = await supabase.auth.getUser();

    if (error) {
        return res.status(401).json({ error: error.message });
    }

    if (!data || !data.user) {
        return res.status(401).json({ error: "User not found or not authenticated." });
    }

    const user = data.user;
    res.status(200).json({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.email // Assuming name might be in user_metadata or fallback to email
    });
});
export default userRouter;