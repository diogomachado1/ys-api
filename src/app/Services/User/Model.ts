import bcrypt from 'bcrypt';
import { Document, HookNextFunction } from 'mongoose';
import mongoose from '@config/database';

export interface IUser extends Document {
  name: string;
  email: string;
  username: string;
  about?: string;
  password: string;
  active: boolean;
  streamKey: string;
  imageUrl?: string;
  stream?: {
    streamThumbUrl: string;
    streamUrl: string;
    streamStartedAt: Date;
    streamTitle: string
  };
  inLive?: boolean;
}

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    about:{
      type: String,
    },
    imageUrl:{
      default: "https://yourstreamtv.s3.amazonaws.com/defaultPerfil.png",
      type: String,
    },
    active: {
      type: Boolean,
      default: false,
    },
    streamKey: {
      type: String,
      required: true,
    },
    stream:{
      streamThumbUrl: {
        type: String,
        default: "https://yourstreamtv.s3.amazonaws.com/defaultThumb.png",
      },
      streamUrl: {
        type: String,
      },
      streamStartedAt: {
        type: Date,
      },
      streamTitle:{
        type: String,
      }
    },
    inLive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure virtual fields are serialised.
UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret._id;
  },
});

UserSchema.pre<IUser>('save', async function passwordHook(
  next: HookNextFunction
) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

const User = mongoose.model<IUser>('Users', UserSchema);

export default User;
