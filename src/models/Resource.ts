import { Schema, model, Document, Types } from 'mongoose';

interface IResource extends Document {
  name: string;
  quantity: number;
  type: string;
  cropId: Types.ObjectId; // Reference to the Crop model
}

const ResourceSchema = new Schema<IResource>({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  type: { type: String, required: true },
  cropId: { type: Schema.Types.ObjectId, ref: 'Crop', required: true }, // Relationship with Crop
});

export const Resource = model<IResource>('Resource', ResourceSchema);