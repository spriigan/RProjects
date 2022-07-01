import { Emporium, Profile, Role } from '../models/User';

export class CreateUserDto {
  username?: string;
  email?: string;
  password?: string;
  role?: Role;
  createdAt?: number;
  lastLoginAt?: number;
  profile?: Profile;
  emporium?: Emporium;
}
