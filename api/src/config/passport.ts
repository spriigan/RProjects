import { deserializeUser, serializeUser, use } from "passport";
import { Strategy } from "passport-local";
import User, { UserDocument } from "../models/User";

const LocalStrategy = Strategy;
serializeUser<any>((user, done) => {
  done(undefined, user);
});

deserializeUser<UserDocument>((payload, done) => {
  User.findById(payload.id, (err: NativeError, user: UserDocument) => {
    done(err, { id: user._id, username: user.username, email: user.email });
  });
});

use(
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    User.findOne({ email: email }, (err: NativeError, user: UserDocument) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(undefined, false, {
          message: `email ${email} is not found`,
        });
      }
      user.comparePassword(password, (err, isMatch: boolean) => {
        if (err) {
          return done(err);
        }
        if (isMatch) {
          return done(undefined, user);
        }
        done(undefined, false, { message: "wrong password" });
      });
    });
  })
);
