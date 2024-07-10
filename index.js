import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './routes/userRoutes.js';
import fileRouter from './routes/fileRouter.js'


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', userRouter);
app.use('/api', fileRouter);

app.listen(process.env.APP_PORT, () => {
    console.log('Server running on port', process.env.APP_PORT);
});
