import express from 'express';
import dotenv from 'dotenv';
import router from './routes/auth.route.js'
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import messageRoute from './routes/message.route.js';
import cors from 'cors';
import { io, server, app } from './lib/socket.js';

dotenv.config();
const PORT = process.env.PORT || 3000;


app.get('/', (req, res) => {
    res.send('Server is always ready');
});
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use('/api/auth', router);
app.use('/api/messages', messageRoute);

server.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);
    connectDB();
});