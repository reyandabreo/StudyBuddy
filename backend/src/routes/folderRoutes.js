import express from "express";
import {
  getAllFolders,
  createFolder,
  deleteFolder,
} from "../controllers/folderController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect ALL routes
router.get("/", authenticateUser, getAllFolders);
router.post("/", authenticateUser, createFolder);
router.delete("/:id", authenticateUser, deleteFolder);

export default router;