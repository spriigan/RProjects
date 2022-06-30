import { Router } from 'express';
import { isAuthenticated } from '../config/passport';
import {
  addAddress,
  deleteAccount,
  deleteAddress,
  findUser,
  findUsers,
  getProfilePicture,
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
route.post('/add-address', isAuthenticated, addAddress);
route.get('/', isAuthenticated, findUser);
route.get('/all', findUsers);
route.get('/profile-picture/:picture', isAuthenticated, getProfilePicture);
route.patch('/update-profile/', upload.single('avatar'), updateUserProfile);
route.delete('/', isAuthenticated, deleteAccount);
route.delete('/:id', isAuthenticated, deleteAddress);
export default route;
