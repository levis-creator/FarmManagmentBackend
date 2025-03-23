import { Schema, model, Document } from 'mongoose';

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

export const Crop = model<ICrop>('Crop', CropSchema);