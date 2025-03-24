import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { Activity } from '../models/Activity';
import { Types } from 'mongoose';
import asyncHandler from 'express-async-handler';

// Types
interface ActivityInput {
  description: string;
  date: Date;
  cropId: Types.ObjectId;
}

interface FilterOptions {
  cropId?: string;
  dateFrom?: string;
  dateTo?: string;
}

// Utility function for building filters
const buildActivityFilters = (query: FilterOptions) => {
  const filter: Record<string, any> = {};
  
  if (query.cropId && Types.ObjectId.isValid(query.cropId)) {
    filter.cropId = new Types.ObjectId(query.cropId);
  }
  
  if (query.dateFrom || query.dateTo) {
    filter.date = {};
    if (query.dateFrom) filter.date.$gte = new Date(query.dateFrom);
    if (query.dateTo) filter.date.$lte = new Date(query.dateTo);
  }
  
  return filter;
};

// Error handling middleware
export const errorHandler: ErrorRequestHandler = (err, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  const statusCode = res.statusCode < 400 ? 500 : res.statusCode;
  res.status(statusCode).json({ success: false, error: err.name, message: err.message });
};

// Create Activity
export const createActivity = asyncHandler(async (req: Request, res: Response) => {
  const { description, date, cropId } = req.body as ActivityInput;

  if (!description || !date || !cropId || !Types.ObjectId.isValid(cropId)) {
    throw new Error('Invalid or missing fields: description, date, or cropId');
  }

  const activity = new Activity({
    description,
    date: new Date(date),
    cropId: new Types.ObjectId(cropId),
  });

  const savedActivity = await activity.save();
  const populatedActivity = await Activity.populate(savedActivity, { path: 'cropId' });

  res.status(201).json({
    success: true,
    data: populatedActivity,
    message: 'Activity created successfully',
  });
});

// Get All Activities
export const getAllActivities = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const filter = buildActivityFilters(req.query as FilterOptions);

  const [activities, total] = await Promise.all([
    Activity.find(filter).populate('cropId').sort({ date: -1 }).skip(skip).limit(limit),
    Activity.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: activities,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  });
});

// Get Activity by ID
export const getActivityById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id)) throw new Error('Invalid activity ID format');

  const activity = await Activity.findById(id).populate('cropId');
  if (!activity) throw new Error('Activity not found');

  res.status(200).json({ success: true, data: activity });
});

// Delete Activity
export const deleteActivity = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id)) throw new Error('Invalid activity ID format');

  const deletedActivity = await Activity.findByIdAndDelete(id);
  if (!deletedActivity) throw new Error('Activity not found');

  res.status(200).json({ success: true, message: 'Activity deleted successfully' });
});
// Get All Activities without pagination
export const getAllActivitiesWithoutPagination = asyncHandler(async (req, res) => {
  const filter = buildActivityFilters(req.query as FilterOptions);

  const activities = await Activity.find(filter).populate('cropId').sort({ date: -1 });

  res.status(200).json({
    success: true,
    data: activities,
  });
});
// Update Activity
export const updateActivity = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { description, date, cropId } = req.body as ActivityInput;

  // Check if the provided ID is valid
  if (!Types.ObjectId.isValid(id)) throw new Error('Invalid activity ID format');

  // Find the activity by ID
  const activity = await Activity.findById(id);

  // If activity does not exist
  if (!activity) throw new Error('Activity not found');

  // Update activity fields
  if (description) activity.description = description;
  if (date) activity.date = new Date(date);
  if (cropId && Types.ObjectId.isValid(cropId)) activity.cropId = new Types.ObjectId(cropId);

  // Save the updated activity
  const updatedActivity = await activity.save();
  const populatedActivity = await Activity.populate(updatedActivity, { path: 'cropId' });

  res.status(200).json({
    success: true,
    data: populatedActivity,
    message: 'Activity updated successfully',
  });
});
