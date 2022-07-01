import express, { Application } from 'express';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import userRoute from './routes/user';
import connectRedis, { RedisStore } from 'connect-redis';
import session from 'express-session';
import bodyParser from 'body-parser';
import { handleError } from './middleware/error.middleware';
import { createClient } from 'redis';
import passport from 'passport';
import csrf from 'csurf';
import './config/passport';
import helmet from 'helmet';
import { resolve } from 'path';
import emporiumRoute from './routes/emporium.route';
config({ path: resolve(__dirname, '../.env') });
const app: Application = express();
app.use(express.json());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
const connect = async () => {
  await mongoose.connect(`${process.env.MONGO_URI}`);
};
const RedisStore: RedisStore = connectRedis(session);
const redisClient = createClient({
  host: process.env.HOST,
  port: Number(process.env.REDIS_PORT),
});
redisClient.on('connect', () => {
  console.log('connect to redis');
});
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: `${process.env.SESSION_SECRET}`,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000,
      httpOnly: false,
      sameSite: true,
      secure: false,
    },
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(csrf());
app.use('/user', userRoute);
app.use('/emporium', emporiumRoute);
app.use(handleError);
app.listen(process.env.PORT, () => {
  connect();
  console.log('server running');
});
