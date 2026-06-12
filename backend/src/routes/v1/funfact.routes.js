import { Router } from "express";
import { getRandomFact } from "../../controllers/encyclopedia/funfact.controller.js";

const funFactRouter = Router();

// Endpoint: GET /api/v1/facts/random
funFactRouter.get("/random", getRandomFact);

export { funFactRouter };
