"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const resourceController_1 = require("../controllers/resourceController");
const router = express_1.default.Router();
// Create a new resource
router.post('/', resourceController_1.createResource);
// Get all resources (paginated) with optional filtering
// Supports query params: ?page=1&limit=10&cropId=xxx&type=xxx
router.get('/', resourceController_1.getAllResources);
// Get all resources without pagination (for dropdowns/exports)
// Supports query params: ?cropId=xxx
router.get('/all', resourceController_1.getAllResourcesWithoutPagination);
// Get a single resource by ID
router.get('/:id', resourceController_1.getResourceById);
// Update a resource
router.put('/:id', resourceController_1.updateResource);
// Delete a resource
router.delete('/:id', resourceController_1.deleteResource);
exports.default = router;
