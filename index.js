// import dotenv from "dotenv";
// dotenv.config();
// import express from "express";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import connectDB from "./src/db/index.js";
// import routes from "./src/routes/user.routes.js";

// const app = express();
// app.use(express.json());
// app.use(cookieParser());

// const allowedOrigins = [
//   'https://wear-flare-project.vercel.app', 
//   'http://localhost:5173' 
// ];

// // ✅ CORS Middleware
// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, origin); 
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
// }));


// app.use((req, res, next) => {
//   const origin = req.headers.origin;
//   if (allowedOrigins.includes(origin)) {
//     res.setHeader("Access-Control-Allow-Origin", origin);
//   }
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   next();
// });


// app.options("*", (req, res) => {
//   res.sendStatus(200);
// });

// app.get("/", (req, res) => {
//   res.send("🚀 Server is running...");
// });
// // API Routes
// app.use("/api/v1", routes);


// connectDB()
//   .then(() => {
//     app.listen(process.env.PORT, () => {
//       console.log(`⚙️ Server running on port: ${process.env.PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.log("❌ MongoDB Connection Failed!", err);
//   });


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

// ✅ Proper CORS middleware — keep only this
// app.use(cors({
//   origin: allowedOrigins,
//   credentials: true,
// }));

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
  res.send("🚀 Server is running...");
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
