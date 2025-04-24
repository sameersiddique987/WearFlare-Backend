import dotenv from 'dotenv';
import Stripe from 'stripe';
import Order from '../models/order.model.js'; 

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const checkout = async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ error: "Invalid products format" });
    }

    const userId = req.user?._id; 
    const userEmail = req.user?.email;

    const lineItems = products.map((item) => {
      const selectedSize = item.size;

      if (!['S', 'M', 'XL', '2XL'].includes(selectedSize)) {
        return res.status(400).json({ error: `Invalid size: ${selectedSize}` });
      }

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${item.title} - Size: ${selectedSize}`,
            metadata: {
              productId: item.id?.toString() || "N/A"
            }
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      };
    });

    //  1. Save order to DB before creating session
    const newOrder = new Order({
      userId,
      email: userEmail,
      products: products.map(p => ({
        title: p.title,
        price: p.price,
        size: p.size,
        quantity: p.quantity
      })),
      status: "pending",
      totalAmount: products.reduce((acc, item) => acc + item.price * item.quantity, 0),
    });

    await newOrder.save(); // Order status: pending

    //  2. Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `https://wear-flare-project.vercel.app/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: "https://wear-flare-project.vercel.app/cancel",
       
      metadata: {
        orderId: newOrder._id.toString(),
      }
    });

    res.json({ message: "Session created", id: session.id });
  } catch (error) {
    console.error("Checkout Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default checkout;
