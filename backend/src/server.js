import express from 'express';
import dotenv from 'dotenv';
import router from './routes/auth.route.js'
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import messageRoute from './routes/message.route.js';
const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;


app.get('/', (req, res) => {
    res.send('Server is always ready');
});
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', router);
app.use('/api/message', messageRoute);

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);
    connectDB();
});