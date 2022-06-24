import { Role } from '../models/User';
import { CreateProfileDto } from './create-profile.dto';

export class CreateUserDto {
  username?: string;
  email?: string;
  password?: string;
  role?: Role;
  createdAt?: number;
  lastLoginAt?: number;
  profile?: CreateProfileDto;
}
