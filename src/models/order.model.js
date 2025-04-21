// models/Order.js
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  email: String,
  products: [
    {
      title: String,
      price: Number,
      size: String,
      quantity: Number
    }
  ],
  totalAmount: Number,
  status: { type: String, default: "pending" }, // pending, paid, failed
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
