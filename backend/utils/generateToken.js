const jwt = require("jsonwebtoken");


// ================= ACCESS TOKEN =================
const generateAccessToken = (id, role) => {
  try {
    return jwt.sign(
      { id, role },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE || "15m",
      }
    );
  } catch (error) {
    console.error("Access Token Error:", error.message);
    throw new Error("Failed to generate access token");
  }
};


// ================= REFRESH TOKEN =================
const generateRefreshToken = (id) => {
  try {
    return jwt.sign(
      { id },
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_REFRESH_EXPIRE || "30d",
      }
    );
  } catch (error) {
    console.error("Refresh Token Error:", error.message);
    throw new Error("Failed to generate refresh token");
  }
};


// ================= VERIFY TOKEN =================
const verifyToken = (token, isRefresh = false) => {
  try {
    const secret = isRefresh
      ? process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
      : process.env.JWT_SECRET;

    return jwt.verify(token, secret);
  } catch (error) {
    throw error;
  }
};


module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
};