import { Request, Response } from 'express';
import User, { UserDocument } from '../models/User';

export const createEmporium = async (req: Request, res: Response) => {
  const user = req.user as UserDocument;
  const result = await User.updateOne(
    { _id: user.id },
    { $set: { emporium: req.body.emporium } },
  );
  res.cookie('csrf', req.csrfToken()).send(result);
};
