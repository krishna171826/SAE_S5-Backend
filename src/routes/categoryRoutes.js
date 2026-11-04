import express from 'express';
import categoryController from '../controllers/categoryController.js';


const router = express.Router();

//route: GET /api/categories
router.get('/', categoryController.getAllCategories)

export default router;