import mongoose, { Schema, Document } from 'mongoose';
export interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  isAdmin: boolean;
}
const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }
});

export default mongoose.model<IUser>('User', UserSchema);
