import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
export default app;