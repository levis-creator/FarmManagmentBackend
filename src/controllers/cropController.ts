import { Request, Response } from 'express';
import { Crop } from '../models/Crop';
import { Activity } from '../models/Activity';
import { Resource } from '../models/Resource';
import mongoose, { Types } from 'mongoose';
import asyncHandler from 'express-async-handler';

// Types
interface CropInput {
  name: string;
  variety:string
  plantingDate: Date;
  harvestDate?: Date;
  status: string;
}

// Create Crop
export const createCrop = asyncHandler(async (req: Request, res: Response) => {
  const { name, plantingDate, variety, status } = req.body as CropInput;


  if (!name || !plantingDate || !status) {
    throw new Error('Missing required fields: name, plantingDate, or status');
  }

  const crop = new Crop({
    name,
    variety,
    plantingDate: new Date(plantingDate),
    harvestDate: req.body.harvestDate ? new Date(req.body.harvestDate) : undefined,
    status,
  });

  const savedCrop = await crop.save();
  res.status(201).json({
    success: true,
    data: savedCrop,
    message: 'Crop created successfully'
  });
});

// Get All Crops
export const getAllCrops = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  // Basic filtering
  const filter: Record<string, any> = {};
  if (req.query.status) {
    filter.status = req.query.status;
  }
  if (req.query.dateFrom) {
    filter.plantingDate = { $gte: new Date(req.query.dateFrom as string) };
  }
  if (req.query.dateTo) {
    filter.plantingDate = filter.plantingDate 
      ? { ...filter.plantingDate, $lte: new Date(req.query.dateTo as string) }
      : { $lte: new Date(req.query.dateTo as string) };
  }

  const [crops, total] = await Promise.all([
    Crop.find(filter)
      .sort({ plantingDate: -1 })
      .skip(skip)
      .limit(limit),
    Crop.countDocuments(filter)
  ]);

  res.status(200).json({
    success: true,
    data: crops,
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

// Get All Crops Without Pagination
export const getAllCropsWithoutPagination = asyncHandler(async (req: Request, res: Response) => {
  const filter: Record<string, any> = {};
  if (req.query.status) {
    filter.status = req.query.status;
  }

  const crops = await Crop.find(filter).sort({ plantingDate: -1 });
  res.status(200).json({
    success: true,
    count: crops.length,
    data: crops
  });
});

// Get Crop by ID
export const getCropById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id)) throw new Error('Invalid crop ID format');

  const crop = await Crop.findById(id);
  if (!crop) throw new Error('Crop not found');

  res.status(200).json({
    success: true,
    data: crop
  });
});

// Update Crop
export const updateCrop = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id)) throw new Error('Invalid crop ID format');

  const updatedCrop = await Crop.findByIdAndUpdate(
    id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!updatedCrop) throw new Error('Crop not found');

  res.status(200).json({
    success: true,
    data: updatedCrop,
    message: 'Crop updated successfully'
  });
});

// Delete Crop (with cascading deletion of activities and resources)
export const deleteCrop = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id)) throw new Error('Invalid crop ID format');

  // Start a transaction for atomic operations
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // First delete all related activities and resources
    await Promise.all([
      Activity.deleteMany({ cropId: id }).session(session),
      Resource.deleteMany({ cropId: id }).session(session)
    ]);

    // Then delete the crop
    const deletedCrop = await Crop.findByIdAndDelete(id).session(session);
    if (!deletedCrop) {
      throw new Error('Crop not found');
    }

    // Commit the transaction if all operations succeeded
    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: 'Crop and all related activities and resources deleted successfully'
    });
  } catch (error) {
    // If any operation fails, abort the transaction
    await session.abortTransaction();
    throw error;
  } finally {
    // End the session
    session.endSession();
  }
});