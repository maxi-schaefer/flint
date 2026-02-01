import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
  email: string;
  passwordHash: string;
  createdAt: Date;
}

const UserSchema = new Schema<User>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  passwordHash: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export const UserModel = mongoose.model<User>("User", UserSchema);