import { Router } from 'express';
import { isAuthenticated } from '../config/passport';
import { createEmporium } from '../controller/emporium.controller';

const emporiumRoute: Router = Router();
emporiumRoute.post('/', isAuthenticated, createEmporium);
export default emporiumRoute;
