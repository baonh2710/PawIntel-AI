import { Router } from 'express';
import { getBreedsList, getBreedProfile } from '../../controllers/encyclopedia/breed.controller.js';

const encyclopediaRouter = Router();

// GET /api/v1/breeds - Trang danh sách + Bộ lọc + Tìm kiếm (Tối ưu select mảng nặng)
encyclopediaRouter.get('/breeds', getBreedsList);

// GET /api/v1/breeds/:breedId - Trang chi tiết chuẩn tạp chí (Trả đầy đủ Object)
encyclopediaRouter.get('/breeds/:breedId', getBreedProfile);

export { encyclopediaRouter };