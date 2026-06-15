import { Router } from 'express';
import multer from 'multer';

import CategoryController from './app/controllers/CategoryController.js';
import OrderController from './app/controllers/OrderController.js';
import ProductController from './app/controllers/ProductController.js';
import SessionController from './app/controllers/SessionController.js';
import UserController from './app/controllers/UserController.js';
import multerConfig from './config/multer.cjs';
import authMiddleware from './app/middlewares/auth.js';
import adminMiddleware from './app/middlewares/admin.js';

const routes = new Router();

const upload = multer(multerConfig);

/* Criação de usuários */
routes.post('/users', UserController.store);

/* Criação de login com autenticação JWT */
routes.post('/session', SessionController.store);

routes.use(authMiddleware); // todas as rotas daqui pra baixo utilizam a Middleware

/*--------- Rotas de produtos ----------------*/
routes.post(
  '/products',
  adminMiddleware,
  upload.single('file'),
  ProductController.store,
);

routes.put(
  '/products/:id',
  adminMiddleware,
  upload.single('file'),
  ProductController.update,
);

routes.get('/products', ProductController.index);

/*---------------- Rotas de Categorias -------- */
routes.post(
  '/categories',
  adminMiddleware,
  upload.single('file'),
  CategoryController.store,
);

routes.put(
  '/categories/:id',
  adminMiddleware,
  upload.single('file'),
  CategoryController.update,
);

routes.get('/categories', CategoryController.index);

/*----------------Rotas de pedidos--------------*/
routes.post('/orders', OrderController.store);

routes.put('/orders/:id', adminMiddleware, OrderController.update);

routes.get('/orders', OrderController.index);

export default routes;
