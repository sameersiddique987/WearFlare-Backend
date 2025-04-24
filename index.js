import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./src/db/index.js";
import routes from "./src/routes/user.routes.js";
import orderRoutes from "./src/routes/order.routes.js"
import  adminLogin  from "./src/routes/admin.login.routes.js"
const app = express();
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  'https://wear-flare-project.vercel.app',
  "https://wear-flare-admin-panel.vercel.app",
  'http://localhost:5173',
  'http://localhost:5174'
];


app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));



app.get("/", (req, res) => {
  res.send(" Server is running...");
});

// ✅ API Routes
app.use("/api/v1", routes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", adminLogin );

// ✅ Start DB and server
connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`⚙️ Server running on port: ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("❌ MongoDB Connection Failed!", err);
  });
