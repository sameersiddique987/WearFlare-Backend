// import mongoose from "mongoose";
// import bcrypt from "bcrypt";

// const userSchema = new mongoose.Schema({
//   firstname: {
//     type: String,
//     required: [true, "Firstname is required"],
//   },
//   lastname: {
//     type: String,
//     required: [true, "Lastname is required"],
//   },
//   email: {
//     type: String,
//     required: [true, "Email is required"],
//     unique: true, 
//   },
//   password: {
//     type: String,
//     required: [true, "Password is required"],
//   },
// },
// { timestamps: true }
// );

// // **Password Hashing Middleware**
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// export default mongoose.model("User", userSchema);

import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "Firstname is required"],
    },
    lastname: {
      type: String,
      required: [true, "Lastname is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: ["user", "admin"], // Role can either be 'user' or 'admin'
      default: "user", // Default is 'user'
    },
  },
  { timestamps: true }
);

// **Password Hashing Middleware**
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.model("User", userSchema);

