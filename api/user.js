import express from "express";
const userRouter = express.Router();

userRouter.get("/me", async (req, res) => {
    /**
     * @swagger
     * /api/v1/user/me:
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

    const user = req.user;
    res.status(200).json({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.email
    });

});
export default userRouter;