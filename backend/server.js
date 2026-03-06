require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");

const { sequelize, connectDB } = require("./config/database");

// Routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const leadRoutes = require("./routes/lead.routes");
const clientRoutes = require("./routes/client.routes");
const employeeRoutes = require("./routes/employee.routes");
const reminderRoutes = require("./routes/reminder.routes");
const knowledgeRoutes = require("./routes/knowledge.routes");
const commissionRoutes = require("./routes/commission.routes");
const cibilRoutes = require("./routes/cibil.routes");
const kycRoutes = require("./routes/kyc.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const issueRoutes = require("./routes/issue.routes");
const notificationRoutes = require("./routes/notification.routes");
const activityRoutes = require("./routes/activity.routes");


const app = express();

/* ================= SECURITY ================= */

// Secure HTTP headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Rate limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

/* ================= BODY PARSER ================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= STATIC FILES ================= */

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ================= HEALTH CHECK ================= */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "BankFinance CRM Backend Running 🚀",
    environment: process.env.NODE_ENV || "development",
  });
});

/* ================= API ROUTES ================= */

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/knowledge", knowledgeRoutes);
app.use("/api/commission", commissionRoutes);
app.use("/api/cibil", cibilRoutes);
app.use("/api/kyc", kycRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/activity", activityRoutes);

/* ================= 404 HANDLER ================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* ================= GLOBAL ERROR HANDLER ================= */

app.use((err, req, res, next) => {
  console.error("Global Error:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* ================= START SERVER ================= */

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // Sync only in development
    if (process.env.NODE_ENV === "development") {
      await sequelize.sync({ alter: false });
      console.log("Database synced successfully.");
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();

/* ================= GRACEFUL SHUTDOWN ================= */

process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  await sequelize.close();
  process.exit(0);
});