import multer from "multer";

// Dùng MemoryStorage để hứng file vào RAM
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // Giới hạn 5MB
  },
});
