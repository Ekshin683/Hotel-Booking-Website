import jwt from "jsonwebtoken";

exports.authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    res.status(401).json({ message: "Authentication failed" });
  }
};

exports.generateToken = (userId, role = "customer") => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "7d" }
  );
};

exports.refreshToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );

    const newToken = exports.generateToken(decoded.userId, decoded.role);
    res.json({ token: newToken });
  } catch (err) {
    res.status(401).json({ message: "Token refresh failed" });
  }
};