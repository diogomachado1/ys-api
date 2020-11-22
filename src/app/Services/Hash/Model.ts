import { Document } from 'mongoose';
import mongoose from '@config/database';

export interface IHash extends Document {
  hash: string;
  user: string;
  type: 'CONFIRM_EMAIL' | 'CHANGE_PASSWORD';
}

const HashSchema = new mongoose.Schema(
  {
    hash: {
      type: String,
      require: true,
    },
    type: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
    },
  },
  {
    timestamps: true,
  }
);

// Ensure virtual fields are serialised.
HashSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret._id;
  },
});

const Hash = mongoose.model<IHash>('Hashs', HashSchema);

export default Hash;
