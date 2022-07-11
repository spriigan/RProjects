import { Router } from 'express';
import { isAuthenticated } from '../config/passport';
import {
  createEmporium,
  deleteEmporium,
  getEmporia,
  getOwnedEmporium,
  updateEmporium,
} from '../controllers/emporium.controller';

const emporiumRoute: Router = Router();
emporiumRoute.post('/', isAuthenticated, createEmporium);
emporiumRoute.get('/all', getEmporia);
emporiumRoute.get('/', isAuthenticated, getOwnedEmporium);
emporiumRoute.patch('/', isAuthenticated, updateEmporium);
emporiumRoute.delete('/', isAuthenticated, deleteEmporium);
export default emporiumRoute;
