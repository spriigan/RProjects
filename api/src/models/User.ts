import { compare, genSalt, hash } from 'bcrypt';
import { Document, Error, model, Schema } from 'mongoose';

enum Role {
  ADMIN = 'admin',
  USER = 'user',
}
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
    location: string;
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
    location: String,
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
