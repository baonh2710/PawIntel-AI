import express from "express";
import { aiRouter } from "./ai.routes.js";
import { encyclopediaRouter } from "./encyclopedia.routes.js";

const v1Router = express.Router();

// Tất cả các route liên quan đến AI sẽ đi qua đây
v1Router.use("/ai", aiRouter);
v1Router.use("/encyclopedia", encyclopediaRouter);

// Sau này thêm Database, bạn chỉ cần cắm thêm:
// import encyclopediaRoutes from './encyclopedia.routes.js';
// router.use('/encyclopedia', encyclopediaRoutes);

export { v1Router };
