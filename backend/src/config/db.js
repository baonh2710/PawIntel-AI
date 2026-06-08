import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Ưu tiên lấy URI từ file .env, nếu không có sẽ fallback về localhost
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pawintel_db';
    
    const conn = await mongoose.connect(mongoURI);
    
    // Log màu xanh lá báo thành công
    console.log(`🟢 [Database] MongoDB đã kết nối thành công tại trạm: ${conn.connection.host}`);
  } catch (error) {
    // Log màu đỏ báo lỗi
    console.error(`🔴 [Database] Lỗi kết nối MongoDB: ${error.message}`);
    // Dừng tiến trình (process) nếu không kết nối được DB
    process.exit(1);
  }
};

export default connectDB;