// import jwt from "jsonwebtoken";

// const authenticateUser = async (req, res, next) => {
//   const token = req.headers["authorization"];
//   if (!token) return res.status(404).json({ message: "no token found" });

//   jwt.verify(token, process.env.ACCESS_JWT_SECRET, (err, user) => {
//     if (err) return res.status(403).json({ message: "invalid token" });
//     req.user = user;
//     next();
//   });
// };

// export default authenticateUser;


import jwt from "jsonwebtoken";

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No or invalid token header" });
  }

  const token = authHeader.split(" ")[1]; // Only the token part

  try {
    const user = jwt.verify(token, process.env.ACCESS_JWT_SECRET);
    req.user = user; // This should contain userId/email etc.
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

export default authenticateUser;
