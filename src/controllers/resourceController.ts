import { Request, Response } from 'express';
import { Resource } from '../models/Resource';

export const createResource = async (req: Request, res: Response) => {
  try {
    const resource = new Resource(req.body);
    await resource.save();
    res.status(201).json(resource);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

export const getAllResources = async (req: Request, res: Response) => {
  try {
    const resources = await Resource.find();
    res.status(200).json(resources);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};