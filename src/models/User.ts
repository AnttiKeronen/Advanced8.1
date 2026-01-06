import mongoose, { Schema, Document } from 'mongoose';
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, minlength: 3, maxlength: 25 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }
});

export default mongoose.model<IUser>('User', UserSchema);
