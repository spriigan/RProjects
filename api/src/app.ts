import express, { Application } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoute from './routes/user';
import connectRedis, { RedisStore } from 'connect-redis';
import session from 'express-session';
import bodyParser from 'body-parser';
import { handleError } from './middleware/error.middleware';
import { createClient } from 'redis';
import passport from 'passport';
import './config/passport';

const app: Application = express();
dotenv.config();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
const connect = async () => {
  await mongoose.connect(
    'mongodb+srv://nodeapi:jqS0vcYk4CDQO2e2@cluster0.0n4e6.mongodb.net/?retryWrites=true&w=majority',
  );
};
const RedisStore: RedisStore = connectRedis(session);
const redisClient = createClient({
  host: 'localhost',
  port: 6379,
});
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: 'ueotkgmdhs;s,rgke449ujsms;ke',
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
redisClient.on('connect', () => {
  console.log('connect to redis');
});
app.use('/user', userRoute);
app.use(handleError);
app.listen(3000, () => {
  connect();
  console.log('server running');
});
