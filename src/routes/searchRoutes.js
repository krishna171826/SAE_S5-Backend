// src/routes/searchRoutes.js
import express from 'express';
import { handleSearch } from '../controllers/searchController.js';

const router = express.Router();

router.post('/', handleSearch);

export default router;