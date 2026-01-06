import mongoose, { Schema, Document } from 'mongoose';
export interface ITopic extends Document {
  title: string;
  content: string;
  username: string;
  createdAt: Date;
}
const TopicSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  username: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model<ITopic>('Topic', TopicSchema);
