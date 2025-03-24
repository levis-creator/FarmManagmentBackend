import { Schema, model, Document, Types } from 'mongoose';

interface IActivity extends Document {
  activity:string;
  description: string;
  date: Date;
  cropId: Types.ObjectId; // Reference to the Crop model
}

const ActivitySchema = new Schema<IActivity>({
  activity: {type:String},
  description: { type: String, required: true },
  date: { type: Date, required: true },
  cropId: { type: Schema.Types.ObjectId, ref: 'Crop', required: true }, // Relationship with Crop
});

export const Activity = model<IActivity>('Activity', ActivitySchema);