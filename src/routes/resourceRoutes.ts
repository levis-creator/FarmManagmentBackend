import express from 'express';
import { createResource, getAllResources } from '../controllers/resourceController';

const router = express.Router();

router.post('/', createResource);
router.get('/', getAllResources);

export default router;