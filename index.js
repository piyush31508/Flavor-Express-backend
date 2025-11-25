import 'dotenv/config';
import express from 'express';
import connect from './database/db.js';
import userRouter from './routes/userRoutes.js';
import productRouter from './routes/productRoutes.js';
import paymentRouter from './routes/paymentRoutes.js';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();

//middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());


//routes
app.use('/user', userRouter);
app.use('/payment', paymentRouter); 
app.use('/product', productRouter);



const port = process.env.PORT ;

app.listen(port,() => {
    console.log(`Server is running on port ${port}`);
    connect();
});