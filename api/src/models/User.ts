import { compare, genSalt, hash } from 'bcrypt';
import { Document, model, Schema } from 'mongoose';
import { nanoid } from 'nanoid';

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}
export type Address = {
  _id: string;
  country: string;
  city: string;
  zipCode: number;
  fullAddress: string;
};
export type UserDocument = Document & {
  username: string;
  email: string;
  password: string;
  role: Role;
  createdAt: number;
  lastLoginAt: number;
  profile: {
    name: string;
    gender: string;
    picture: string;
    addresses: Address[];
  };
  emporium: {
    emporiumId: string;
    name: string;
    addresses: Address[];
    email: string;
    rating: number;
    productsCount: number;
    followers: number;
    description: string;
    notes: string;
    joinAt: number;
  };
  comparePassword: ComparePasswordFunction;
};
type ComparePasswordFunction = (
  plainPassword: string,
  cb: (err: any, isMatch: boolean) => void,
) => void;
const UserSchema = new Schema<UserDocument>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: Role, default: Role.USER },
  createdAt: { type: Number, required: true },
  lastLoginAt: { type: Number },
  profile: {
    name: String,
    gender: String,
    picture: String,
    addresses: [
      {
        _id: { type: String, default: nanoid() },
        country: String,
        city: String,
        zipCode: Number,
        fullAddress: String,
      },
    ],
  },
  emporium: {
    emporiumId: String,
    name: String,
    addresses: [
      {
        _id: { type: String, default: nanoid() },
        country: String,
        city: String,
        zipCode: Number,
        fullAddress: String,
      },
    ],
    email: String,
    rating: Number,
    productsCount: Number,
    followers: Number,
    description: String,
    notes: String,
    joinAt: Number,
  },
});

UserSchema.pre('save', function save(next) {
  const user = this as UserDocument;
  if (!user.isModified('password')) {
    return next();
  }
  genSalt(10, (err, salt) => {
    if (err) {
      next(err);
    }
    hash(user.password, salt, (err, hash) => {
      if (err) {
        next(err);
      }
      user.password = hash;
      next();
    });
  });
});

const comparePassword: ComparePasswordFunction = function (
  this: any,
  plainPassword,
  cb,
) {
  compare(plainPassword, this.password, (err, isMatch: boolean) => {
    cb(err, isMatch);
  });
};
UserSchema.methods.comparePassword = comparePassword;
export default model<UserDocument>('User', UserSchema);
