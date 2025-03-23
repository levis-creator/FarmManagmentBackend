import express from 'express';
import { createActivity, getAllActivities } from '../controllers/activityController';

const router = express.Router();

router.post('/', createActivity);
router.get('/', getAllActivities);

export default router;