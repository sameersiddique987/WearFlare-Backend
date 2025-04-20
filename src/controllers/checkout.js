// import dotenv from 'dotenv';
// import Stripe from 'stripe';

// dotenv.config();
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// const checkout = async (req, res) => {
//   try {
//     console.log("Request body:", req.body);

//     const { products } = req.body;
//     if (!products || !Array.isArray(products)) {
//       return res.status(400).json({ error: "Invalid products format" });
//     }

//     const lineItems = products.map((item) => ({
//       price_data: {
//         currency: "usd",
//         product_data: {
//           name: item.title,
//         },
//         unit_amount: Math.round(item.price * 100),
//       },
//       quantity: item.quantity,
//     }));

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: lineItems,
//       mode: "payment",
//       success_url: "https://wear-flare-project.vercel.app/success",
//       cancel_url: "https://wear-flare-project.vercel.app/cancel",
//     });

//     res.json({ message: "Session created", id: session.id });
//   } catch (error) {
//     console.error("Stripe error:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// export default checkout;




import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const checkout = async (req, res) => {
  try {
    const { products } = req.body;
    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ error: "Invalid products format" });
    }

    const lineItems = products.map((item) => {
      const selectedSize = item.size; // expected: 'S', 'M', 'XL', '2XL'

      if (!['S', 'M', 'XL', '2XL'].includes(selectedSize)) {
        throw new Error(`Invalid size "${selectedSize}" for product ${item.title}`);
      }

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title,
            description: `Size: ${selectedSize}`,
            metadata: {
              size: selectedSize,
              productId: item.id?.toString() || "N/A"
            }
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "https://wear-flare-project.vercel.app/success",
      cancel_url: "https://wear-flare-project.vercel.app/cancel",
    });

    res.json({ message: "Session created", id: session.id });
  } catch (error) {
    console.error("Stripe checkout error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export default checkout;
