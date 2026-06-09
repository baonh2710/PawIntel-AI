import mongoose from "mongoose";

const funFactSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      // Ép kiểu chuẩn Tiếng Anh để dễ dàng filter hiển thị ngẫu nhiên trên UI
      enum: ["intelligence", "health", "behavior", "history"],
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
  },
);

export const FunFact = mongoose.model("FunFact", funFactSchema);
