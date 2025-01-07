import express from 'express';
import dotenv from 'dotenv';
import router from './routes/auth.routes.js';
import connectToMongoDB from './db/connectToMongoDB.js';

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;


app.get('/', (req, res) => {
    res.send('Server is always ready');
});
app.use(express.json());
app.use('/api/auth', router);

app.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server running on port ${PORT}`);
});