import express from "express";
import { supabase } from "../supabaseClient.js";

const scoreRouter = express.Router();

scoreRouter.get("/", async (req, res) => {
    /** 
    * @swagger
    * /api/v1/scores:
    *   get:
    *     summary: Get all scores
    *     tags: [Scores]
    *     responses:
    *       200:
    *         description: A list of scores.
    *         content:
    *           application/json:
    *             schema:
    *               type: array
    *               items:
    *                 type: object
    *                 properties:
    *                   id:
    *                     type: integer
    *                     description: The score ID.
    *                   player_name:
    *                     type: string
    *                     description: The name of the player.
    *                   value:
    *                     type: integer
    *                     description: The score value.
    *                   created_at:
    *                     type: string
    *                     format: date-time
    *                     description: The date and time the score was created.
    *       500:
    *         description: Server error.
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 error:
    *                   type: string
    *                   example: Database error message.
    */
    const { data, error } = await supabase
        .from("scores")
        .select("value, created_at, profiles(full_name)")
        .order("created_at", { ascending: false });

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);
});

scoreRouter.get('/score_by_User_id', async (req, res) => {
    /**
     * @swagger
     * /api/v1/score_by_User_id:
     *       get:
     *         summary: Get scores by user ID
     *         tags: [Scores]
     *         description: Retrieves all scores for a specific user.
     *         parameters:
     *           - in: query
     *             name: uid
     *             schema:
     *               type: string
     *               format: uuid
     *             required: true
     *             description: The unique identifier of the user.
     *         responses:
     *           200:
     *             description: A list of scores for the user.
     *             content:
     *               application/json:
     *                 schema:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       id:
     *                         type: string
     *                         format: uuid
     *                         description: The unique ID of the score entry.
     *                       userID:
     *                         type: string
     *                         description: The display name of the player.
     *                       value:
     *                         type: integer
     *                         description: The value of the score.
     *                       user_id:
     *                         type: string
     *                         format: uuid
     *                         description: The unique ID of the user who achieved this score.
     *                       created_at:
     *                         type: string
     *                         format: date-time
     *                         description: The date and time the score was created.
     *           400:
     *             description: Bad request, missing user ID.
     *             content:
     *               application/json:
     *                 schema:
     *                   type: object
     *                   properties:
     *                     error:
     *                       type: string
     *                       example: Missing user ID
     *           500:
     *             description: Server error.
     *             content:
     *               application/json:
     *                 schema:
     *                   type: object
     *                   properties:
     *                     error:
     *                       type: string
     *                       example: Database error message.
     */
    const { uid } = req.body.user_id;
    const { data, error } = await supabase.from("scores").select("*").eq("user_id", uid);
    if (!uid) {
        return res.status(400).json({ error: "Missing user ID" });
    }
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.status(200).json(data);
})
scoreRouter.get('/score_by_date', async (req, res) => {
    /**
     * @swagger
     * /api/v1/score_by_date:
     *       get:
     *         summary: Get scores by date
     *         tags: [Scores]
     *         description: Retrieves all scores for a specific date.
     *         parameters:
     *           - in: query
     *             name: date
     *             schema:
     *               type: string
     *               format: date
     *             required: true
     *             description: The date to retrieve scores for.
     *         responses:
     *           200:
     *             description: A list of scores for the specified date.
     *             content:
     *               application/json:
     *                 schema:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       id:
     *                         type: string
     *                         format: uuid
     *                         description: The unique ID of the score entry.
     *                       userID:
     *                         type: string
     *                         description: The display name of the player.
     *                       value:
     *                         type: integer
     *                         description: The value of the score.
     *                       user_id:
     *                         type: string
     *                         format: uuid
     *                         description: The unique ID of the user who achieved this score.
     *                       created_at:
     *                         type: string
     *                         format: date-time
     *                         description: The date and time the score was created.
     *           400:
     *             description: Bad request, missing date.
     *             content:
     *               application/json:
     *                 schema:
     *                   type: object
     *                   properties:
     *                     error:
     *                       type: string
     *                       example: Missing date
     *           500:
     *             description: Server error.
     *             content:
     *               application/json:
     *                 schema:
     *                   type: object
     *                   properties:
     *                     error:
     *                       type: string
     *                       example: Database error message.
     */
    const { date } = req.query;
    if (!date) {
        return res.status(400).json({ error: "Missing date" });
    }
    const { data, error } = await supabase.from("scores").select("*").eq("created_at", date);
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.status(200).json(data);
})
scoreRouter.post("/", async (req, res) => {
    /**
     * @swagger
     * /api/v1/scores:
     *   post:
     *     summary: Create a new score
     *     tags: [Scores]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - userID
     *               - value
     *             properties:
     *               userID:
     *                 type: string
     *                 description: The name of the player
     *               value:
     *                 type: integer
     *                 description: The score value
     *     responses:
     *       201:
     *         description: Score created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                   description: The score ID
     *                 userID:
     *                   type: string
     *                   description: The name of the player
     *                 value:
     *                   type: integer
     *                   description: The score value
     *                 created_at:
     *                   type: string
     *                   format: date-time
     *                   description: The date and time the score was created
     *       400:
     *         description: Bad request, missing userID or value
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: "Missing player or value"
     *       500:
     *         description: Server error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: "Database error message"
     */

    const { userID, value } = req.body;

    if (!userID || !value) {
        return res.status(400).json({ error: "Missing player or value" });
    }

    const { data, error } = await supabase.from("scores").insert({ userID, value });

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data);
})

export default scoreRouter;