import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  createMechanicByAdmin,
  listMechanicsByAdmin,
  getMechanicByAdmin,
  updateMechanicByAdmin,
  deleteMechanicByAdmin,
} from "../controllers/adminMechanicController.js";

const router = express.Router();

// All routes here require admin
router.use(protect, admin);

router.post("/", createMechanicByAdmin);
router.get("/", listMechanicsByAdmin);
router.get("/:id", getMechanicByAdmin);
router.put("/:id", updateMechanicByAdmin);
router.delete("/:id", deleteMechanicByAdmin);

export default router;


