import { Request, Response, RequestHandler } from 'express';
import { Crop } from '../models/Crop';

export const createCrop: RequestHandler = async (req, res) => {
  try {
    const crop = new Crop(req.body);
    await crop.save();
    res.status(201).json(crop); // No need to return
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

export const getAllCrops: RequestHandler = async (req, res) => {
  try {
    const crops = await Crop.find();
    res.status(200).json(crops);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const getCropById: RequestHandler = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) {
      res.status(404).json({ error: 'Crop not found' });
      return;
    }
    res.status(200).json(crop);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const updateCrop: RequestHandler = async (req, res) => {
  try {
    const crop = await Crop.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!crop) {
      res.status(404).json({ error: 'Crop not found' });
      return;
    }
    res.status(200).json(crop);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

export const deleteCrop: RequestHandler = async (req, res) => {
  try {
    const crop = await Crop.findByIdAndDelete(req.params.id);
    if (!crop) {
      res.status(404).json({ error: 'Crop not found' });
      return;
    }
    res.status(200).json({ message: 'Crop deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
