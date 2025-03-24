"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const activityController_1 = require("../controllers/activityController");
const router = express_1.default.Router();
// Create a new activity
router.post('/', activityController_1.createActivity);
// Get all activities (paginated)
router.get('/', activityController_1.getAllActivities);
// Get all activities without pagination
router.get('/all', activityController_1.getAllActivitiesWithoutPagination);
// Get a single activity by ID
router.get('/:id', activityController_1.getActivityById);
// Update an activity
router.put('/:id', activityController_1.updateActivity);
// Delete an activity
router.delete('/:id', activityController_1.deleteActivity);
exports.default = router;
