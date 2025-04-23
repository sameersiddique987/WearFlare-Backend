import express from "express";
import { getAllOrders, getUserOrders, createOrder, updateOrderStatus } from "../controllers/order.controller.js";
import authenticateUser from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/all", authenticateUser, getAllOrders); // ✅ admin
router.get("/my", authenticateUser, getUserOrders); // ✅ user-specific
router.post("/", authenticateUser, createOrder);
router.put("/status", authenticateUser, updateOrderStatus);

export default router;
