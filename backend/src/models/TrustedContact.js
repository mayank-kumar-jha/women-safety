import mongoose from 'mongoose';

const trustedContactSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    name: { type: String, required: true },
    phone: String,
    email: String,
    socketUserId: String
  },
  { timestamps: true }
);

export const TrustedContact = mongoose.model('Trusted_Contact', trustedContactSchema);
