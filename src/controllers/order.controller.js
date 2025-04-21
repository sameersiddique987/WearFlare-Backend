import Order from "../models/order.model.js";

// ✅ Create new order (called before Stripe checkout)
export const createOrder = async (req, res) => {
  try {
    const { products, totalAmount } = req.body;
    const userId = req.user?._id;
    const email = req.user?.email;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Invalid products array" });
    }

    const newOrder = new Order({
      userId,
      email,
      products,
      totalAmount,
      status: "pending",
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("Order Create Error:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
};

// ✅ Get all orders (admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// ✅ Get user-specific orders
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user orders" });
  }
};

// ✅ Update order status (e.g., after webhook)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: "Failed to update order status" });
  }
};
