const jwt = require("jsonwebtoken");
const User = require("../models/User");


// ================= PROTECT MIDDLEWARE =================
const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "Access denied. No token provided.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password", "refreshToken"] },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid token. User not found.",
      });
    }

    if (user.status !== "active") {
      return res.status(403).json({
        message: "Your account is inactive. Contact admin.",
      });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error("Authentication Error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired. Please login again.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid token.",
      });
    }

    return res.status(500).json({
      message: "Authentication failed.",
    });
  }
};



// ================= ROLE BASED AUTHORIZATION =================
const authorize = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "Not authenticated.",
        });
      }

      // Allow super admin automatically if you want future upgrade
      if (req.user.role === "admin") {
        return next();
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          message: `Access denied. Role '${req.user.role}' not permitted.`,
        });
      }

      next();

    } catch (error) {
      console.error("Authorization Error:", error.message);
      return res.status(500).json({
        message: "Authorization failed.",
      });
    }
  };
};


module.exports = {
  protect,
  authorize,
};