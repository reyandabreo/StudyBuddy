import express from "express";
import {
  getNotesByFolder,
  createNote,
  deleteNote,
} from "../controllers/noteController.js";

const router = express.Router();

router.get("/:folderId", getNotesByFolder);
router.post("/", createNote);
router.delete("/:id", deleteNote);

export default router;
