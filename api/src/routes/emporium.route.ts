import { Router } from 'express';
import { isAuthenticated } from '../config/passport';
import {
  addEmporiumAddress,
  createEmporium,
  deleteEmporium,
  getEmporia,
  getOwnedEmporium,
  updateEmporium,
} from '../controllers/emporium.controller';

const emporiumRoute: Router = Router();
emporiumRoute.post('/', isAuthenticated, createEmporium);
emporiumRoute.post('/add-address', isAuthenticated, addEmporiumAddress);
emporiumRoute.get('/all', getEmporia);
emporiumRoute.get('/', isAuthenticated, getOwnedEmporium);
emporiumRoute.patch('/', isAuthenticated, updateEmporium);
emporiumRoute.delete('/', isAuthenticated, deleteEmporium);
export default emporiumRoute;
