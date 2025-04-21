import express from "express";
import {
  loginUser,
  logoutUser,
  refreshToken,
  registerUser,
  uploadImage,
} from "../controllers/user.controller.js";
import upload from "../middleware/multer.middleware.js";
import checkout from "../controllers/checkout.js";
import { createOrder, getAllOrders, getUserOrders, updateOrderStatus } from "../controllers/order.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js"; 

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/refreshtoken", refreshToken);
router.post("/uploadimage", upload.single(), uploadImage);

router.post('/checkout', checkout);


router.post("/", verifyToken, createOrder);         // Save order
router.get("/", verifyToken, getAllOrders);         // Get all (admin)
router.get("/my-orders", verifyToken, getUserOrders); // User orders
router.put("/status", verifyToken, updateOrderStatus); // Update status


export default router;