import mongoose, {Schema, Document} from "mongoose";


export interface IEntry extends Document {
    mood : number;
    note?: string;
    aiReflection? : string;
    createdAt: Date;
}

const EntrySchema = new Schema<IEntry>({
    mood: { type: Number, required: true },   
    note: { type: String },                   
    aiReflection: { type: String },           
    createdAt: { type: Date, default: Date.now }, 
  });
  
  // Prevent model overwrite in dev
  export default mongoose.models.Entry || mongoose.model<IEntry>("Entry", EntrySchema);