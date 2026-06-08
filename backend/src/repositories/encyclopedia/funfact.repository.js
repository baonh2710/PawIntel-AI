import { BaseRepository } from "../base.repository.js";
import { FunFact } from "../../models/encyclopedia/FunFact.model.js";

class FunFactRepository extends BaseRepository {
  constructor() {
    super(FunFact); // 👈 Giờ thằng Base lại tự hiểu và làm việc với bảng FunFact!
  }
}
export const funFactRepository = new FunFactRepository();
