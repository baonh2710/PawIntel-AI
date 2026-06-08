export class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  // Tìm một Document (dùng .lean() để tăng tốc độ parse JSON)
  async findOne(condition) {
    return await this.model.findOne(condition).lean();
  }

  // Tìm tất cả
  async findAll(condition = {}) {
    return await this.model.find(condition).lean();
  }

  // Tạo mới
  async create(data) {
    return await this.model.create(data);
  }
}