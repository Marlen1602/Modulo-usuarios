import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import politicasRoutes from "./routes/politicas.router.js"
import terminos from "./routes/terminosCondiciones.router.js"
import deslinde from "./routes/deslindeLegal.router.js"
import empresaRoutes from "./routes/empresa.routes.js";
import incidenciaRoutes from "./routes/incidencias.routes.js";
import configuracion from "./routes/config.routes.js";
import menuRoutes from "./routes/menu.routes.js";
import faqRoutes from "./routes/faq.routes.js";
import xss from 'xss-clean';
import cookieParser from 'cookie-parser';

const app=express()
app.use(cookieParser());
app.use(xss());

app.use(cors({
    origin: ["http://localhost:5173", "https://smokeygrill.netlify.app","https://smoke-and-grill.com","https://smoke-and-grill.com:8080","https://smokes-and-grill.com:8080","https://smokes-and-grill.com"], // Agregar URLs permitidas
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
    credentials: true, // Permitir cookies
}));


app.use(morgan('dev'));
app.use(express.json());

app.use('/api',authRoutes);
app.use('/api',politicasRoutes);
app.use('/api',terminos);
app.use('/api',deslinde);
app.use("/api/empresa", empresaRoutes);
app.use('/api',incidenciaRoutes);
app.use('/api',configuracion);
app.use("/api/menu", menuRoutes);
app.use("/api", faqRoutes);

export default app;