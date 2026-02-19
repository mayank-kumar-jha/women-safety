import mongoose from 'mongoose';

export const connectDb = async (mongoUri) => {
  if (!mongoUri) throw new Error('MONGODB_URI missing');
  await mongoose.connect(mongoUri);
  console.log('MongoDB connected');
};
