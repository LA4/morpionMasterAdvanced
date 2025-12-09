import express from 'express';
import { specs, swaggerUi } from "./swagger.js";
import authRouter from "./auth/auth.js";
import userRouter from "./api/user.js";
import scoreRouter from "./api/score.js";
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 3000;
const version = "v1";

app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
app.use(cors());
app.use(`/auth/v1`, authRouter)
app.use(`/api/${version}/user`, authMiddleware, userRouter)
app.use(`/api/${version}/score`, scoreRouter)


app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
export default app;