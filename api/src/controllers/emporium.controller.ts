import { NextFunction, Request, Response } from 'express';
import { body, check, validationResult } from 'express-validator';
import mongoose, { MongooseError } from 'mongoose';
import User, { UserDocument } from '../models/User';
import { BadRequest, NotFound } from '../types/error.type';
import Emporium, { EmporiumDocument } from '../models/emporium.model';

export const createEmporium = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  await check('email', 'email is not valid').isEmail().run(req);
  await body('email').normalizeEmail({ gmail_remove_dots: false }).run(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new BadRequest('complete all required fields');
    return next(error);
  }
  const foundEmail = await Emporium.findOne({ email: req.body.email });
  if (foundEmail) {
    const error = new BadRequest(
      `there is an emporium associated by email ${req.body.email}, please use another email`,
    );
    return next(error);
  }
  const user = req.user as UserDocument;
  User.findById(user.id, (err: MongooseError, user: UserDocument) => {
    if (err) {
      return next(err);
    }
    req.body.joinAt = Date.now();
    const newEmporium = new Emporium(req.body);
    newEmporium.save((err, emporium: EmporiumDocument) => {
      if (err) {
        return next(err);
      }
      user.emporium._id = emporium;
      user.emporium.name = emporium.name;
      user.isAlsoSeller = true;
      user.save((err) => {
        if (err) {
          return next(err);
        }
      });
      res.cookie('csrf', req.csrfToken()).status(201).json(emporium);
    });
  });
};

export const getEmporia = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  Emporium.find((err: MongooseError, found: any) => {
    if (err) {
      return next(err);
    }
    res.cookie('csrf', req.csrfToken()).status(200).json(found);
  });
};

export const getOwnedEmporium = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user as UserDocument;
  User.findById(user.id, (err: MongooseError, found: UserDocument) => {
    if (err) {
      return next(err);
    }
    if (!found.emporium._id) {
      const error = new BadRequest("you haven't create an emporium");
      return next(error);
    }
    Emporium.findById(
      found.emporium._id,
      (err: MongooseError, found: EmporiumDocument) => {
        if (err) {
          return next(err);
        }
        res.cookie('csrf', req.csrfToken()).status(200).json(found);
      },
    );
  });
};

export const updateEmporium = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const currentUser = req.user as UserDocument;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const user = await User.findById(currentUser.id);
    if (!user || !user.isAlsoSeller) {
      const err = new NotFound('User or emporium is not found');
      return next(err);
    }
    const emporium = await Emporium.findByIdAndUpdate(
      user.emporium._id,
      {
        $set: req.body,
      },
      { new: true },
    ).session(session);
    user.emporium.name = req.body.name || user.emporium.name;
    await user.save();
    await session.commitTransaction();
    session.endSession();
    res.cookie('csrf', req.csrfToken()).status(200).json(emporium);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const deleteEmporium = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const currentUser = req.user as UserDocument;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const user = await User.findById(currentUser.id);
    if (!user || !user.isAlsoSeller) {
      const err = new NotFound("user or emporium doesn't exist");
      return next(err);
    }
    await Emporium.findByIdAndDelete(user.emporium._id).session(session);
    await User.findByIdAndUpdate(currentUser.id, {
      $unset: { emporium: '' },
      $set: { isAlsoSeller: false },
    });
    await session.commitTransaction();
    session.endSession();
    res.cookie('csrf', req.csrfToken()).status(200).send('emporium deleted');
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};
