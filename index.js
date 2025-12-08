import express from 'express';
import {specs, swaggerUi} from "./swagger.js";
import authRouter from "./auth/auth.js";
import scoreRouter from "./api/score.js";
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));
app.use(cors());
app.use("/auth/v1", authRouter);
app.use("/api/v1/scores", scoreRouter);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
export default app;