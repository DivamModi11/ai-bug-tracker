import express from "express";

import {
  createBug,
  getProjectBugs,
  updateBugStatus,
  deleteBug,
  addComment,
  analyzeBug
} from "../controllers/bugController.js";


import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/", protect, createBug);

router.get("/project/:projectId",protect,getProjectBugs);

router.put("/:id/status",protect,updateBugStatus);

router.delete("/:id",protect,deleteBug);

router.post("/:bugId/comment",protect,addComment);

router.get("/:bugId/analyze",protect,analyzeBug);

export default router;