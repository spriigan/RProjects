import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import passportLocal from 'passport-local';
import User, { UserDocument } from '../models/User';

const LocalStrategy = passportLocal.Strategy;
passport.serializeUser<string>((user: any, done) => {
  done(undefined, user._id);
});

passport.deserializeUser<UserDocument>((payload, done) => {
  User.findById(payload, (err: NativeError, user: UserDocument) => {
    done(err, { id: user._id, username: user.username, email: user.email });
  });
});
passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      const user = await User.findOne({ email: email }).select('+password');
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
        done(undefined, false, { message: 'wrong password' });
      });
    },
  ),
);

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.cookie('csrf', req.csrfToken()).send('please, log in');
};
