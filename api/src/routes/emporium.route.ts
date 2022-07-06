import { Router } from 'express';
import { isAuthenticated } from '../config/passport';
import {
  createEmporium,
  getEmporia,
  getOwnedEmporium,
} from '../controllers/emporium.controller';

const emporiumRoute: Router = Router();
emporiumRoute.post('/', isAuthenticated, createEmporium);
emporiumRoute.get('/all', getEmporia);
emporiumRoute.get('/', isAuthenticated, getOwnedEmporium);
export default emporiumRoute;
