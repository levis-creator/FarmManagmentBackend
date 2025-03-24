import express from 'express';
import {
  createResource,
  getAllResources,
  getResourceById,
  updateResource,
  deleteResource,
  getAllResourcesWithoutPagination
} from '../controllers/resourceController';

const router = express.Router();

// Create a new resource
router.post('/', createResource);

// Get all resources (paginated) with optional filtering
// Supports query params: ?page=1&limit=10&cropId=xxx&type=xxx
router.get('/', getAllResources);

// Get all resources without pagination (for dropdowns/exports)
// Supports query params: ?cropId=xxx
router.get('/all', getAllResourcesWithoutPagination);

// Get a single resource by ID
router.get('/:id', getResourceById);

// Update a resource
router.put('/:id', updateResource);

// Delete a resource
router.delete('/:id', deleteResource);

export default router;