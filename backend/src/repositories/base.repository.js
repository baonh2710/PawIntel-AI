export class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async find(filter = {}, projection = {}, options = {}) {
    return await this.model.find(filter, projection, options).lean();
  }

  async findOne(filter = {}, projection = {}) {
    return await this.model.findOne(filter, projection).lean();
  }

  async countDocuments(filter = {}) {
    return await this.model.countDocuments(filter);
  }
}
