import { Router } from 'express';
import { isAuthenticated } from '../config/passport';
import {
  deleteAccount,
  findUser,
  findUsers,
  login,
  logout,
  register,
  updateUserProfile,
} from '../controller/user';
import upload from '../middleware/uploadFile.middleware';

const route: Router = Router();
route.post('/login', login);
route.post('/', register);
route.post('/logout', isAuthenticated, logout);
route.get('/:id', isAuthenticated, findUser);
route.get('/', findUsers);
route.patch('/update-profile/', upload.single('avatar'), updateUserProfile);
route.delete('/:id', deleteAccount);
export default route;
