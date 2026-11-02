import express from 'express';
import { createVisitorController } from '../controllers/visitorController.js';

const router = express.Router();

// Route POST /api/visitors
router.post('/visitors', createVisitorController);

export default router;