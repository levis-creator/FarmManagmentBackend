import { Schema, model, Document, Types } from 'mongoose';
import { Activity } from './Activity';
import { Resource } from './Resource';

interface ICrop extends Document {
  name: string;
  variety: string;
  plantingDate: Date;
  harvestDate: Date;
  status: 'Planting' | 'Growing' | 'Harvesting';
}

const CropSchema = new Schema<ICrop>({
  name: { type: String, required: true },
  variety: { type: String, required: true },
  plantingDate: { type: Date, required: true },
  harvestDate: { type: Date, required: true },
  status: { type: String, enum: ['Planting', 'Growing', 'Harvesting'], default: 'Planting' },
});

// Add pre-delete hook to remove related activities and resources
CropSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  const cropId = this._id;
  await Promise.all([
    Activity.deleteMany({ cropId }),
    Resource.deleteMany({ cropId })
  ]);
  next();
});

export const Crop = model<ICrop>('Crop', CropSchema);