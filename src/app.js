import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import politicasRoutes from "./routes/politicas.router.js"
import terminos from "./routes/terminosCondiciones.router.js"
import deslinde from "./routes/deslindeLegal.router.js"
import xss from 'xss-clean';
import cookieParser from 'cookie-parser';

const app=express()
app.use(cookieParser());
app.use(xss());

app.use(cors({
    origin:'https://smokeygrill.vercel.app',
    //origin: 'http://localhost:5173',
    credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());

app.use('/api',authRoutes);
app.use('/api',politicasRoutes);
app.use('/api',terminos);
app.use('/api',deslinde);

export default app;