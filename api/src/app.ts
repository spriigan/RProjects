import express, { Application, NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/user";
import connectRedis, { RedisStore } from "connect-redis";
import session from "express-session";
import { handleError } from "./middleware/error.middleware";
import { createClient } from "redis";
const app: Application = express();
dotenv.config();
const connect = async () => {
  await mongoose.connect(
    "mongodb+srv://nodeapi:jqS0vcYk4CDQO2e2@cluster0.0n4e6.mongodb.net/?retryWrites=true&w=majority"
  );
};
const RedisStore: RedisStore = connectRedis(session);
const redisClient = createClient({
  socket: {
    host: "localhost",
    port: 6379,
  },
});
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: "ueotkgmdhs;s,rgke449ujsms;ke",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      sameSite: true,
      secure: true,
    },
  })
);
app.use(express.json());
app.use("/user", userRoute);

app.use(handleError);
app.listen(3000, () => {
  connect();
  console.log("server running");
});
