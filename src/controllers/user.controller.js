import User from "../models/user.model.js"
import { v2 as cloudinary } from 'cloudinary';
import bcrypt from "bcrypt"
import  jwt  from "jsonwebtoken";
import fs from "fs";

const generateaccesstoken = (user) => {
    return jwt.sign({email:user.email}, process.env.ACCESS_JWT_SECRET, {expiresIn : "6h" });
}

const generaterefreshtoken = (user) => {
    return jwt.sign({email:user.email}, process.env.REFRESH_JWT_SECRET, {expiresIn : "7d" });
}

    // Configuration
    cloudinary.config({ 
        cloud_name: 'dod9yfzup', 
        api_key: '666983146394437', 
        api_secret: 'fGB7pFLKckZW88NqHOy_ogzn414' 
    });


// upload image function
const uploadImageToCloudinary = async (localpath) => {
    try {
      const uploadResult = await cloudinary.uploader.upload(localpath, {
        resource_type: "auto",
      });
      fs.unlinkSync(localpath);
      return uploadResult.url;
    } catch (error) {
      fs.unlinkSync(localpath);
      return null;
    }
  };
  

// register user
const registerUser = async (req ,res )=>{
    const {firstname, lastname,email, password} = req.body;
    if (!firstname) return res.status(400).json({message:"firstname is requird"})
    if (!lastname) return res.status(400).json({message:"lastname is requird"})
    if (!email) return res.status(400).json({message:"email is requird"})
    if (!password) return res.status(401).json({message:"password is requird"})

        const user = await User.findOne({email,password})
        if(user) return res.status(401).json({message:"user already exist"})

        const createuser = await User.create({
            lastname,
            firstname,
            email,
            password
        })
        res.json({message:"user registered succesfully",data : createuser})
}

// login user

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });
  if (!password) return res.status(400).json({ message: "Password is required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "User not found" });

  // Password compare using bcrypt
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return res.status(400).json({ message: "Incorrect password" });

  // Generate tokens
  const accessToken = generateaccesstoken(user);
  const refreshToken = generaterefreshtoken(user);

  //  Fix Cookie settings
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, 
     secure: process.env.NODE_ENV === "production", 
    sameSite: "None", 
  });

  res.json({
    message: "Logged in successfully",
    accessToken,
    user: {
      id: user._id,
      email: user.email,
      name: user.name, 
    },
  });
};


// refreshtoken
const refreshToken = async (req , res) => {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if(!refreshToken) return res.status(404).json({message: "no refresh token found!" });
    try {
        const decodedToken =  jwt.verify(refreshToken , process.env.REFRESH_JWT_SECRET);
        const user = await User.findOne({email : decodedToken.email});
        if(!user) return res.status(404).json({message : "Invalid token"});
        const generateToken = generaterefreshtoken(user)
        res.json({
            message : "access token generate",
            accesstoken : generateToken,
            decodedToken
        })

    } catch (error) {
        return res.status(403).json({ message: "invalid or expired token" });
        
    }
    }

const logoutUser = (req , res) => {
res.clearCookie("refreshToken")
res.json({message : "User logedOut Successfully "})
}

// upload image
const uploadImage = async (req, res) => {
    if (!req.file)
      return res.status(400).json({
        message: "no image file uploaded",
      });
  
    try {
      const uploadResult = await uploadImageToCloudinary(req.file.path);
  
      if (!uploadResult)
        return res
          .status(500)
          .json({ message: "error occured while uploading image" });
  
      res.json({
        message: "image uploaded successfully",
        url: uploadResult,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "error occured while uploading image" });
    }
  };
  

export {registerUser , loginUser , logoutUser , refreshToken , uploadImage}