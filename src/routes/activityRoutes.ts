import express from 'express';
import { 
  createActivity,
  getAllActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
  getAllActivitiesWithoutPagination
} from '../controllers/activityController';

const router = express.Router();

// Create a new activity
router.post('/', createActivity);

// Get all activities (paginated)
router.get('/', getAllActivities);

// Get all activities without pagination
router.get('/all', getAllActivitiesWithoutPagination);

// Get a single activity by ID
router.get('/:id', getActivityById);

// Update an activity
router.put('/:id', updateActivity);

// Delete an activity
router.delete('/:id', deleteActivity);

export default router;