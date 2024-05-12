import express from "express";
import { getNotifications, insertNotification,deleteNotification } from "../controllers/notifications.js";

const router = express.Router();

// Route to fetch notifications
router.get("/", getNotifications);

// Route to insert notification
router.post("/", insertNotification);

// Route to delete notification
router.delete("/", deleteNotification);

export default router;
