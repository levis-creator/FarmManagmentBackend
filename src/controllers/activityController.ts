import { Request, Response } from 'express';
import { Activity } from '../models/Activity';

export const createActivity = async (req: Request, res: Response) => {
  try {
    const activity = new Activity(req.body);
    await activity.save();
    res.status(201).json(activity);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

export const getAllActivities = async (req: Request, res: Response) => {
  try {
    const activities = await Activity.find().populate('cropId');
    res.status(200).json(activities);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};