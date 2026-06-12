import { funFactRepository } from '../../repositories/encyclopedia/funfact.repository.js';

export class FunFactService {
  static async getRandomArchivalFact() {
    const fact = await funFactRepository.getRandomFact();
    return fact;
  }
}