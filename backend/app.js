import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import nodemailer from 'nodemailer';
import router from './routes/routes.js';


dotenv.config();
const app = express(); //http://146.56.146.174/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD', 'DELETE'],
    credentials: true
}));
app.use(logger());
app.set('etag', false);

app.use(express.static('build'));

app.use('/', router);

app.locals.transporter = nodemailer.createTransport({
    host: 'smtp.daum.net',
    port: '465',
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
})


app.listen(3001, () => {
	console.log('App started on port 3001');
});

export default app;
