import { NextFunction, Request, Response } from 'express';
import { body, check, validationResult } from 'express-validator';
import passport from 'passport';
import User, { UserDocument } from '../models/User';
import { BadRequest, NotFound } from './../types/error.type';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  await check('email', 'email is not valid').isEmail().run(req);
  await body('email').normalizeEmail({ gmail_remove_dots: false }).run(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new BadRequest('complete all required field');
    return next(error);
  }
  req.body.createdAt = Date.now();
  const existingEmail = await User.findOne({ email: req.body.email });
  const existingUsername = await User.findOne({ username: req.body.username });
  try {
    if (existingEmail || existingUsername) {
      throw new BadRequest(
        'there is a user registered under this email or username',
      );
    }
    const user: UserDocument = new User(req.body);
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

export const findUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = await User.findOne({ _id: req.params.id });
  if (!user) {
    const error = new NotFound(
      `there is no user registered by this ID: ${req.params.id}`,
    );
    return next(error);
  }
  res.status(200).json(user);
};

export const findUsers = async (req: Request, res: Response) => {
  const users = await User.find();
  res.status(200).json(users);
};

export const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = await User.findOne({ _id: req.params.id });
  if (!user) {
    const error = new NotFound(
      `there is no user registered by this ID: ${req.params.id}`,
    );
    return next(error);
  }
  user.email = req.body.email || user.email;
  user.profile.name = req.body.name || user.profile.name;
  user.profile.gender = req.body.gender || user.profile.gender;
  user.profile.location = req.body.location || user.profile.location;
  user.profile.picture = req.body.picture || user.profile.picture;
  const updated = await user.save();
  res.status(200).json(updated);
};

export const deleteAccount = async (req: Request, res: Response) => {
  const result = await User.deleteOne({ _id: req.params.id });
  res.status(200).json(result);
};
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  await check('email', 'Email is not valid').isEmail().run(req);
  await check('password', 'Password cannot be blank')
    .isLength({ min: 1 })
    .run(req);
  await body('email').normalizeEmail({ gmail_remove_dots: false }).run(req);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new BadRequest('complete all required fields');
    return next(error);
  }

  passport.authenticate('local', (err: Error, user: UserDocument) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      const error = new NotFound('user not found');
      return next(error);
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      res.send('logged in');
    });
  })(req, res, next);
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.session.cookie.maxAge = 0;
    res.send('logged out');
  });
};
