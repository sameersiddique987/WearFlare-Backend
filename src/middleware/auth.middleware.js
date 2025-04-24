import jwt from "jsonwebtoken";

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No or invalid token header" });
  }

  const token = authHeader.split(" ")[1]; 

  try {
    const user = jwt.verify(token, process.env.ACCESS_JWT_SECRET);
    req.user = user; 
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

export default authenticateUser;
