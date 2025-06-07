import { Router } from "express";
import { handleMarkAttendance } from "../controllers/classSchedule.controller.js";
const router = Router();
router.post("/mark-attendance/:id", handleMarkAttendance);



export default router;