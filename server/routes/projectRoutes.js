import express from "express";
import {
  createProject,
  getProjects,
  deleteProject,
  getProjectById
} from "../controllers/projectController.js";

import { protect } from "../middleware/authMiddleware.js";
import { addMember } from "../controllers/projectController.js";

const router = express.Router();

router.post("/", protect, createProject);
router.get("/", protect, getProjects);
router.delete("/:id",protect,deleteProject);
router.put("/:projectId/add-member",protect,addMember);
router.get("/:id",protect,getProjectById);

export default router;