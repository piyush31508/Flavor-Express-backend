import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
} from '../controller/productController.js';
import { isAuth } from '../middleware/isAuth.js';
import { isAdmin } from '../middleware/isAdmin.js';

const router = express.Router();

// public
router.get('/all', getAllProducts);
router.get('/search', searchProducts);
router.get('/:id', getProductById);

// admin-only
router.post('/create', isAuth, isAdmin, createProduct);
router.put('/:id', isAuth, isAdmin, updateProduct);
router.delete('/:id', isAuth, isAdmin, deleteProduct);

export default router;
