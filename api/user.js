import express from "express";
const userRouter = express.Router();

userRouter.get("/me", async (req, res) => {
    /**
     * @swagger
     * /api/v1/user/me:
     *   get:
     *     summary: Get current authenticated user details
     *     tags: [Users]
     *     responses:
     *       200:
     *         description: User details retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: string
     *                   description: The user ID
     *                   example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
     *                 email:
     *                   type: string
     *                   description: The user's email address
     *                   example: "user@example.com"
     *                 name:
     *                   type: string
     *                   description: The user's name
     *                   example: "John Doe"
     *       400:
     *         description: Bad request, invalid request parameters
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: Error message
     *                   example: "Bad Request"
     *       500:
     *         description: Internal server error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: Error message
     *                   example: "Internal Server Error"
     */

    const {user, error} = req.user;

    if (!user.id || !user.email) {
        return res.status(400).json({ error: "Bad Request" });
    }
    if (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }

    res.status(200).json({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.email
    });

});

export default userRouter;