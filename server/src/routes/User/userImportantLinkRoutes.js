// routes/User/userImportantLinkRoutes.js

import express from 'express';
import { getAllLinks, getLink } from '../../controllers/User/userImportantLinkController.js';

const router = express.Router();

// ✅ Public GET routes (only return ACTIVE links)
router.get('/', getAllLinks);        // List with pagination and search
router.get('/:id', getLink);         // Single item detail

export default router;
