const { Sequelize } = require("sequelize");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",

    logging: isProduction ? false : false,

    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },

    dialectOptions: isProduction
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {},
  }
);


// 🔹 Function to connect DB manually (Better Practice)
const connectDB = async () => {
  console.log("DB_HOST:", process.env.DB_HOST)
  console.log("DB_PORT:", process.env.DB_PORT)
  console.log("DB_NAME:", process.env.DB_NAME)
  console.log("DB_USER:", process.env.DB_USER)
  console.log("DB_PASSWORD:", process.env.DB_PASSWORD)

  let retries = 10;
  while (retries) {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");
    return;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    // process.exit(1);
    retries--;
    await new Promise(r => setTimeout(r, 5000));
  }

}
};

module.exports = {
  sequelize,
  connectDB,
};