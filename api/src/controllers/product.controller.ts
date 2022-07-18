import { NextFunction, Request, Response } from 'express';
import mongoose, { CallbackError, MongooseError } from 'mongoose';
import emporiumModel from '../models/emporium.model';
import ProductModel from '../models/Product.model';
import User, { UserDocument } from '../models/User';
import { NotFound } from '../types/error.type';

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const currentUser = req.user as UserDocument;
  try {
    const seller = await User.findById(currentUser.id);
    if (!seller) {
      const error = new NotFound('user or emporium not found');
      return next(error);
    }
    req.body.createdAt = Date.now();
    const newProduct = new ProductModel(req.body);
    newProduct.emporiumId = seller.emporiumId;
    req.files &&
      Array.isArray(req.files) &&
      req.files.map((file: Express.Multer.File) =>
        newProduct.pictures.push(file.filename),
      );
    const savedProduct = await newProduct.save();
    res.cookie('csrf', req.csrfToken()).status(201).json(savedProduct);
  } catch (error) {
    next(error);
  }
};

export const listAllProducts = async (req: Request, res: Response) => {
  const products = await ProductModel.find();
  res.cookie('csrf', req.csrfToken()).status(200).json(products);
};

export const findSingleProducrById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      const error = new NotFound('product not found');
      return next(error);
    }
    res.cookie('csrf', req.csrfToken()).status(200).json(product);
  } catch (error) {
    next(error);
  }
};

export const listAllProductsByCertainEmporium = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    emporiumModel
      .aggregate([
        { $match: { name: req.params.name } },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: 'emporiumId',
            as: 'products',
          },
        },
      ])
      .exec((err: CallbackError, emporium) => {
        console.log(emporium);
        res.cookie('csrf', req.csrfToken()).status(200).json(emporium);
      });
  } catch (error) {
    next(error);
  }
};
