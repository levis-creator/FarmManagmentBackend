import { Request, Response } from 'express';
import { Resource } from '../models/Resource';
import { Types } from 'mongoose';
import asyncHandler from 'express-async-handler';

// Types
interface ResourceInput {
  name: string;
  quantity: number;
  type: string;
  cropId: Types.ObjectId;
}

// Create Resource
export const createResource = asyncHandler(async (req: Request, res: Response) => {
  const { name, quantity, type, cropId } = req.body as ResourceInput;

  // Validate input
  if (!name || !quantity || !type || !cropId) {
    throw new Error('Missing required fields: name, quantity, type, or cropId');
  }

  if (!Types.ObjectId.isValid(cropId)) {
    throw new Error('Invalid cropId format');
  }

  const resource = new Resource({
    name,
    quantity,
    type,
    cropId: new Types.ObjectId(cropId)
  });

  const savedResource = await resource.save();
  const populatedResource = await Resource.populate(savedResource, { path: 'cropId' });

  res.status(201).json({
    success: true,
    data: populatedResource,
    message: 'Resource created successfully'
  });
});

// Get All Resources
export const getAllResources = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  // Filtering options
  const filter: Record<string, any> = {};
  
  if (req.query.cropId) {
    if (!Types.ObjectId.isValid(req.query.cropId as string)) {
      throw new Error('Invalid cropId format');
    }
    filter.cropId = new Types.ObjectId(req.query.cropId as string);
  }
  
  if (req.query.type) {
    filter.type = req.query.type;
  }

  const [resources, total] = await Promise.all([
    Resource.find(filter)
      .populate('cropId')
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit),
    Resource.countDocuments(filter)
  ]);

  res.status(200).json({
    success: true,
    data: resources,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1
    }
  });
});

// Get All Resources Without Pagination
export const getAllResourcesWithoutPagination = asyncHandler(async (req: Request, res: Response) => {
  const filter: Record<string, any> = {};
  
  if (req.query.cropId) {
    if (!Types.ObjectId.isValid(req.query.cropId as string)) {
      throw new Error('Invalid cropId format');
    }
    filter.cropId = new Types.ObjectId(req.query.cropId as string);
  }

  const resources = await Resource.find(filter)
    .populate('cropId')
    .sort({ name: 1 });

  res.status(200).json({
    success: true,
    count: resources.length,
    data: resources
  });
});

// Get Resource by ID
export const getResourceById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  if (!Types.ObjectId.isValid(id)) {
    throw new Error('Invalid resource ID format');
  }

  const resource = await Resource.findById(id).populate('cropId');
  
  if (!resource) {
    throw new Error('Resource not found');
  }

  res.status(200).json({
    success: true,
    data: resource
  });
});

// Update Resource
export const updateResource = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body as Partial<ResourceInput>;

  if (!Types.ObjectId.isValid(id)) {
    throw new Error('Invalid resource ID format');
  }

  if (updateData.cropId && !Types.ObjectId.isValid(updateData.cropId)) {
    throw new Error('Invalid cropId format');
  }

  const updatedResource = await Resource.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  ).populate('cropId');

  if (!updatedResource) {
    throw new Error('Resource not found');
  }

  res.status(200).json({
    success: true,
    data: updatedResource,
    message: 'Resource updated successfully'
  });
});

// Delete Resource
export const deleteResource = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!Types.ObjectId.isValid(id)) {
    throw new Error('Invalid resource ID format');
  }

  const deletedResource = await Resource.findByIdAndDelete(id);

  if (!deletedResource) {
    throw new Error('Resource not found');
  }

  res.status(200).json({
    success: true,
    message: 'Resource deleted successfully'
  });
});