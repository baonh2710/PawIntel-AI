import mongoose from 'mongoose';

const funFactSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true,
      // Đã cập nhật enum khớp với dữ liệu từ file seed.js
      enum: ['intelligence', 'history', 'health', 'behavior', 'general'],
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    schemaVersion: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Sử dụng Named Export
export const FunFact = mongoose.model('FunFact', funFactSchema);