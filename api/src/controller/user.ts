import { NextFunction, Request, Response } from 'express';
import { body, check, validationResult } from 'express-validator';
import { CallbackError } from 'mongoose';
import passport from 'passport';
import { join } from 'path';
import User, { Address, UserDocument } from '../models/User';
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
    const newUser: any = await user.save();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = newUser._doc;
    res.cookie('csrf', req.csrfToken()).status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const findUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const currentUser = req.user as UserDocument;
  const user = await User.findOne({ _id: currentUser.id });
  if (!user) {
    const error = new NotFound(
      `there is no user registered by this ID: ${req.params.id}`,
    );
    return next(error);
  }
  res.cookie('csrf', req.csrfToken()).status(200).json(user);
};

export const findUsers = async (req: Request, res: Response) => {
  const users = await User.find();
  res.cookie('csrf', req.csrfToken()).status(200).json(users);
};

export const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user as UserDocument;
  User.findById(user.id, (err: any, user: UserDocument) => {
    if (err) {
      return next(err);
    }
    let address: Address | any;
    if (req.body.address != undefined) {
      address = JSON.parse(req.body.address);
    }
    user.email = req.body.email || user.email;
    user.profile.name = req.body.name || user.profile.name;
    user.profile.gender = req.body.gender || user.profile.gender;
    address &&
      user.profile.addresses.forEach((data) => {
        if (data._id === address._id) {
          data.city = address.city || data.city;
          data.country = address.country || data.country;
          data.zipCode = address.zipCode || data.zipCode;
          data.fullAddress = address.fullAddress || data.fullAddress;
          return;
        }
      });
    user.profile.picture = req.file?.filename || user.profile.picture;
    user.save((err: CallbackError, result: UserDocument) => {
      if (err) {
        return next(err);
      }
      res.cookie('csrf', req.csrfToken()).json(result);
    });
  });
};

export const deleteAccount = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user as UserDocument;
  await User.deleteOne({ _id: user.id });
  logout(req, res, next);
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
      res.cookie('csrf', req.csrfToken()).send(req.user);
    });
  })(req, res, next);
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    res.cookie('csrf', req.csrfToken()).send('logged out');
  });
};

export const addAddress = async (req: Request, res: Response) => {
  const user = req.user as UserDocument;
  const result = await User.updateOne(
    { _id: user.id },
    { $push: { 'profile.addresses': req.body } },
  );
  res.cookie('csrf', req.csrfToken()).send(result);
};

export const deleteAddress = async (req: Request, res: Response) => {
  const user = req.user as UserDocument;
  const result = await User.updateOne(
    { _id: user.id },
    { $pull: { 'profile.addresses': { _id: req.params.id } } },
  );
  res.cookie('csrf', req.csrfToken()).send(result);
};

export const getProfilePicture = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res
    .cookie('csrf', req.csrfToken())
    .sendFile(
      join(
        process.cwd(),
        `public/uploads/images/profile/${req.params.picture}`,
      ),
      (err) => {
        if (err) {
          return next(err);
        }
      },
    );
};
