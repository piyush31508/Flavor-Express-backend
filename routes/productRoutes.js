import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
} from '../controller/productController.js';

const router = express.Router();

router
  .post('/create', createProduct)
  .get('/all', getAllProducts)
  .get('/search', searchProducts) 
  .get('/:id', getProductById)
  .put('/:id', updateProduct)
  .delete('/:id', deleteProduct);

export default router;
